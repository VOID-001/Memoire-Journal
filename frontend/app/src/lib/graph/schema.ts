export const INIT_QUERIES = [
  // Uniqueness constraints
  "CREATE CONSTRAINT ON (u:User) ASSERT u.id IS UNIQUE",
  "CREATE CONSTRAINT ON (u:User) ASSERT u.email IS UNIQUE",
  "CREATE CONSTRAINT ON (e:Entry) ASSERT e.id IS UNIQUE",
  "CREATE CONSTRAINT ON (t:Topic) ASSERT t.name IS UNIQUE",
  "CREATE CONSTRAINT ON (em:Emotion) ASSERT em.name IS UNIQUE",
  "CREATE CONSTRAINT ON (p:Persona) ASSERT p.id IS UNIQUE",
  "CREATE CONSTRAINT ON (d:DateNode) ASSERT d.date IS UNIQUE",

  // Indexes for frequent lookups
  "CREATE INDEX ON :Entry(date)",
  "CREATE INDEX ON :Entry(mood_score)",
  "CREATE INDEX ON :User(email)",
  "CREATE INDEX ON :Topic(category)",
  "CREATE INDEX ON :DateNode(day_of_week)",
];
