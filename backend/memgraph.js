import neo4j from 'neo4j-driver';

const uri = process.env.MEMGRAPH_URI || 'bolt://memgraph:7687';
const user = process.env.MEMGRAPH_USER || '';
const password = process.env.MEMGRAPH_PASSWORD || '';

export const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

export async function runCypher(query, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result;
  } catch (error) {
    console.error("Memgraph Cypher Error:", error);
    throw error;
  } finally {
    await session.close();
  }
}
