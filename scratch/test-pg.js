require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  console.log("Connecting to Postgres forcing IPv4...");
  const client = await pool.connect();
  console.log("Connected successfully!");
  const res = await client.query('SELECT NOW()');
  console.log("Time from DB:", res.rows[0]);
  client.release();
}

main()
  .catch(console.error)
  .finally(() => pool.end());
