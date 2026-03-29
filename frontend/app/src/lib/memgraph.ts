import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

export const getDriver = (): Driver => {
  if (!driver) {
    const uri = process.env.MEMGRAPH_URI || 'bolt://localhost:7687';
    const user = process.env.MEMGRAPH_USER || '';
    const password = process.env.MEMGRAPH_PASS || '';
    
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
};

export const closeDriver = async () => {
  if (driver) {
    await driver.close();
  }
};
