const mysql = require('mysql2/promise');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const config = {
  host: process.env.DB_HOST || 'mysql',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'cardekho',
  password: process.env.DB_PASSWORD || 'cardekho_password',
  database: process.env.DB_NAME || 'cardekho_shortlist'
};

const run = async () => {
  for (let attempt = 1; attempt <= 40; attempt += 1) {
    try {
      const connection = await mysql.createConnection(config);
      await connection.ping();
      await connection.end();
      console.log('Database is ready.');
      return;
    } catch (error) {
      console.log(`Waiting for database (${attempt}/40)...`);
      await wait(3000);
    }
  }
  throw new Error('Database did not become ready in time.');
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
