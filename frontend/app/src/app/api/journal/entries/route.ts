import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getDriver } from '@/lib/memgraph';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)
      OPTIONAL MATCH (e)-[:FELT]->(em:Emotion)
      OPTIONAL MATCH (e)-[:ABOUT]->(t:Topic)
      OPTIONAL MATCH (e)-[:GENERATED]->(res:AIResponse)
      WITH e, collect(DISTINCT em) as emotions, collect(DISTINCT t) as topics, res
      ORDER BY e.date DESC, e.created_at DESC
      SKIP toInteger($skip) LIMIT toInteger($limit)
      RETURN e, emotions, topics, res
    `, { userId: payload.userId, skip: skip, limit: limit });

    const entries = result.records.map((record: any) => {
      const e = record.get('e').properties;
      const emotions = record.get('emotions').map((em: any) => em.properties);
      const topics = record.get('topics').map((t: any) => t.properties);
      const res = record.get('res')?.properties;

      return {
        id: e.id,
        content: e.content,
        summary: e.summary,
        date: e.date.toString(),
        created_at: e.created_at.toString(),
        mood_score: e.mood_score,
        energy_level: e.energy_level,
        clarity_score: e.clarity_score,
        word_count: e.word_count.toNumber ? e.word_count.toNumber() : e.word_count,
        emotions,
        topics,
        aiResponse: res ? {
          content: res.content,
          persona_id: res.persona_id,
          created_at: res.created_at.toString()
        } : null
      };
    });

    return NextResponse.json({ entries, page, limit });

  } catch (error: any) {
    console.error('History retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await session.close();
  }
}
