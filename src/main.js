// @ts-check
require('dotenv').config();
const { Client } = require('pg');
const { DB_NAME, DB_USER, DB_PASS } = process.env;

const client = new Client();
async function main() {
  await client.connect();

  const res = await client.query('SELECT $1::text as message', [
    'Hello world!',
  ]);
  console.log(res.rows[0].message); // Hello world!
  await client.end();
}

main();
