import { getDriver } from '../memgraph';

export async function buildUserContext(userId: string): Promise<string> {
  const driver = getDriver();
  const session = driver.session();

  try {
    // 1. Recent mood trajectory (14 days)
    const moodTrend = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)
      WHERE e.date >= date() - duration({days: 14})
      RETURN e.date AS date, e.mood_score AS mood_score, e.energy_level AS energy_level, e.summary AS summary
      ORDER BY e.date ASC
    `, { userId });

    // 2. Most frequent topics (all time, weighted recent)
    const topTopics = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)-[:ABOUT]->(t:Topic)
      WITH t.name AS topic, count(e) AS total,
           sum(CASE WHEN e.date >= date() - duration({days: 14}) THEN 2 ELSE 1 END) AS weighted
      RETURN topic, total, weighted
      ORDER BY weighted DESC LIMIT 8
    `, { userId });

    // 3. Dominant emotions (last 30 days)
    const emotions = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)-[:FELT]->(em:Emotion)
      WHERE e.date >= date() - duration({days: 30})
      RETURN em.name AS name, em.valence AS valence, count(e) AS frequency
      ORDER BY frequency DESC LIMIT 6
    `, { userId });

    // 4. Topic co-occurrence
    const coOccurrences = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)
      MATCH (e)-[:ABOUT]->(t1:Topic), (e)-[:ABOUT]->(t2:Topic)
      WHERE t1.name < t2.name
      WITH t1.name AS a, t2.name AS b, count(e) AS together
      WHERE together > 2
      RETURN a, b, together
      ORDER BY together DESC LIMIT 5
    `, { userId });

    // 5. Recurring silences
    const droppedTopics = await session.run(`
      MATCH (u:User {id: $userId})-[:RECURRING_THEME]->(t:Topic)
      WHERE NOT EXISTS {
        MATCH (u)-[:WROTE]->(e:Entry)-[:ABOUT]->(t)
        WHERE e.date >= date() - duration({days: 14})
      }
      RETURN t.name AS name
      LIMIT 3
    `, { userId });

    // 6. Day-of-week mood pattern
    const dayPattern = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)-[:ON_DATE]->(d:DateNode)
      WITH d.day_of_week AS day, avg(e.mood_score) AS avg_mood
      RETURN day, avg_mood
      ORDER BY avg_mood DESC
    `, { userId });

    // 7. Journaling gap analysis
    const gapData = await session.run(`
      MATCH (u:User {id: $userId})-[:WROTE]->(e:Entry)
      RETURN e.date AS date ORDER BY e.date DESC LIMIT 2
    `, { userId });

    return formatContextBlock({
      moodTrend: moodTrend.records,
      topTopics: topTopics.records,
      emotions: emotions.records,
      coOccurrences: coOccurrences.records,
      droppedTopics: droppedTopics.records,
      dayPattern: dayPattern.records,
      gapData: gapData.records,
    });

  } finally {
    await session.close();
  }
}

function formatContextBlock(data: any): string {
  const moodTrend = data.moodTrend.map((r: any) => `- ${r.get('date')}: Mood ${r.get('mood_score').toFixed(1)}, ${r.get('summary')}`).join('\n');
  const topTopics = data.topTopics.map((r: any) => `- ${r.get('topic')} (mentioned ${r.get('total')} times)`).join('\n');
  const emotions = data.emotions.map((r: any) => `- ${r.get('name')} [${r.get('valence')}] — ${r.get('frequency')} entries`).join('\n');
  const coOccurrences = data.coOccurrences.map((r: any) => `- "${r.get('a')}" and "${r.get('b')}" co-occur in ${r.get('together')} entries`).join('\n');
  const droppedTopics = data.droppedTopics.map((r: any) => `- "${r.get('name')}" — no mention recently`).join('\n');
  const dayPattern = data.dayPattern.map((r: any) => `- ${r.get('day')}: avg mood ${Number(r.get('avg_mood')).toFixed(2)}`).join('\n');

  return `
=== JOURNAL HISTORY CONTEXT ===
This is a summary of who this person has been across their journal history.
Use this to make your response feel like you actually know them.

MOOD TRAJECTORY (last 14 days):
${moodTrend || 'None yet.'}

TOP RECURRING TOPICS (weighted by recency):
${topTopics || 'None yet.'}

DOMINANT EMOTIONS (last 30 days):
${emotions || 'None yet.'}

TOPIC CLUSTERS (what appears together):
${coOccurrences || 'None yet.'}

TOPICS THEY'VE GONE QUIET ON (last 2 weeks):
${droppedTopics || 'None yet.'}

DAY-OF-WEEK MOOD PATTERN:
${dayPattern || 'None yet.'}

=== END CONTEXT ===
`;
}
