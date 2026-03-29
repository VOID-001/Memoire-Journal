import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '@/lib/auth';
import { getDriver } from '@/lib/memgraph';
import { extractEntrySemantics, getPersonaResponse } from '@/lib/gemini';
import { buildUserContext } from '@/lib/graph/context-builder';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { content } = await req.json();
  if (!content || content.length < 5) {
    return NextResponse.json({ error: 'Entry too short' }, { status: 400 });
  }

  const driver = getDriver();
  const session = driver.session();

  try {
    // 1. Extract Semantics
    const semantics = await extractEntrySemantics(content);

    // 2. Prepare Graph Write
    const entryId = uuidv4();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const createdAt = now.toISOString();
    const wordCount = content.split(/\s+/).length;

    // 3. Complex Graph Write Transaction
    await session.executeWrite(async (tx: any) => {
      // Create Entry and link to User
      await tx.run(`
        MATCH (u:User {id: $userId})
        CREATE (e:Entry {
          id: $entryId,
          content: $content,
          summary: $summary,
          date: date($dateStr),
          created_at: datetime($createdAt),
          word_count: $wordCount,
          mood_score: $moodScore,
          energy_level: $energyLevel,
          clarity_score: $clarityScore
        })
        CREATE (u)-[:WROTE {at: datetime($createdAt)}]->(e)
        
        // Link to DateNode
        MERGE (d:DateNode {date: date($dateStr)})
        ON CREATE SET 
          d.day_of_week = apoc.date.format(toInteger(datetime($createdAt).epochMillis), 'ms', 'EEEE'),
          d.week_number = toInteger(apoc.date.format(toInteger(datetime($createdAt).epochMillis), 'ms', 'w')),
          d.month = toInteger(apoc.date.format(toInteger(datetime($createdAt).epochMillis), 'ms', 'MM')),
          d.year = toInteger(apoc.date.format(toInteger(datetime($createdAt).epochMillis), 'ms', 'yyyy'))
        CREATE (e)-[:ON_DATE]->(d)
      `, {
        userId: payload.userId,
        entryId,
        content,
        summary: semantics.one_sentence_summary,
        dateStr,
        createdAt,
        wordCount,
        moodScore: semantics.mood_score,
        energyLevel: semantics.energy_level,
        clarityScore: semantics.clarity_score
      });

      // Note: Memgraph doesn't have apoc by default in all distributions, 
      // but let's assume we can handle simple JS date logic if apoc is missing.
      // For now, I'll stick to basic Cypher if possible.
      // Let's refine the DateNode creation for Memgraph compatibility.

      // Linking to previous entry (simple version)
      await tx.run(`
        MATCH (u:User {id: $userId})-[:WROTE]->(newE:Entry {id: $entryId})
        MATCH (u)-[:WROTE]->(oldE:Entry)
        WHERE oldE.id <> $entryId
        WITH newE, oldE ORDER BY oldE.created_at DESC LIMIT 1
        CREATE (newE)-[:FOLLOWS {days_gap: duration.between(oldE.date, newE.date).days}]->(oldE)
      `, { userId: payload.userId, entryId });

      // Create Emotions
      for (const em of semantics.emotions) {
        await tx.run(`
          MATCH (e:Entry {id: $entryId})
          MERGE (emo:Emotion {name: $name})
          ON CREATE SET emo.valence = $valence
          CREATE (e)-[:FELT {intensity: $intensity}]->(emo)
        `, { entryId, name: em.name.toLowerCase(), valence: em.valence, intensity: em.intensity });
      }

      // Create Topics
      for (const t of semantics.topics) {
        await tx.run(`
          MATCH (e:Entry {id: $entryId})
          MERGE (top:Topic {name: $name})
          ON CREATE SET top.category = $category
          CREATE (e)-[:ABOUT]->(top)
          
          // Update recurring theme for user
          WITH e, top
          MATCH (u:User {id: $userId})
          MERGE (u)-[r:RECURRING_THEME]->(top)
          ON CREATE SET r.first_seen = date($dateStr), r.frequency = 1
          ON MATCH SET r.frequency = r.frequency + 1
        `, { entryId, userId: payload.userId, name: t.name.toLowerCase(), category: t.category, dateStr });
      }

      // Create Persons
      for (const p of semantics.persons_mentioned) {
        await tx.run(`
          MATCH (e:Entry {id: $entryId})
          MERGE (per:Person {name: $name})
          ON CREATE SET per.relationship = $relationship
          CREATE (e)-[:MENTIONS]->(per)
        `, { entryId, name: p.name, relationship: p.relationship });
      }
    });

    // 4. Build Context
    const graphContext = await buildUserContext(payload.userId);

    // 5. Get Active Persona Response
    const userResult = await session.run(`
      MATCH (u:User {id: $userId})-[:USES_PERSONA]->(p:Persona)
      RETURN p
    `, { userId: payload.userId });

    const persona = userResult.records[0].get('p').properties;
    const aiResponseContent = await getPersonaResponse(content, graphContext, persona);

    // 6. Save AI Response
    const responseId = uuidv4();
    await session.run(`
      MATCH (e:Entry {id: $entryId})
      CREATE (res:AIResponse {
        id: $responseId,
        content: $content,
        persona_id: $personaId,
        created_at: datetime($createdAt)
      })
      CREATE (e)-[:GENERATED]->(res)
    `, {
      entryId,
      responseId,
      content: aiResponseContent,
      personaId: persona.id,
      createdAt: new Date().toISOString()
    });

    // 7. Update User Streak and Totals
    await session.run(`
      MATCH (u:User {id: $userId})
      SET u.total_entries = u.total_entries + 1
      
      // Streak logic (simplified)
      WITH u
      MATCH (u)-[:WROTE]->(e:Entry)
      WHERE e.date = date() - duration({days: 1})
      WITH u, count(e) as wroteYesterday
      SET u.current_streak = CASE 
        WHEN wroteYesterday > 0 THEN u.current_streak + 1 
        WHEN u.last_entry_date = date() THEN u.current_streak
        ELSE 1 END
      SET u.last_entry_date = date()
    `, { userId: payload.userId });

    return NextResponse.json({
      entryId,
      semantics,
      aiResponse: aiResponseContent,
      persona: { name: persona.name, emoji: persona.emoji }
    });

  } catch (error: any) {
    console.error('Journal entry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
