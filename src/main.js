// @ts-check
require('dotenv').config();

const { Client } = require('pg');

const { DB_NAME, DB_USER, DB_PASS } = process.env;

const program = require('commander');

const prompts = require('prompts');
const { query } = require('express');

/**
 * @returns {Promise<Client>}
 */
async function connect() {
  const client = new Client({
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });
  await client.connect();
  return client;
}
program.command('list').action(async () => {
  const client = await connect();
  const queryString = `SELECT * FROM users`;
  const result = await client.query(queryString);
  if (result.rowCount !== 0) {
    result.rows.forEach((row) => console.log(row));
  }
  await client.end();
});
program.command('add').action(async () => {
  const client = await connect();
  const userName = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Provide a user name to insert.',
  });

  const queryString = 'INSERT INTO users (name) VALUES ($1::text)';
  await client.query(queryString, [userName.userName]);
  await client.end();
});

program.command('remove').action(async () => {
  const client = await connect();
  const userName = await prompts({
    type: 'text',
    name: 'userName',
    message: 'Provide a user name to delete.',
  });
  // SQL injection이 가능한 지점
  await client.query(`DELETE FROM users WHERE name = $1::text`, [
    userName.userName,
  ]);
  await client.end();
});

program.parseAsync();
