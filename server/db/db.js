require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
  host: process.env.PGHOST,
});

pool
  .query('CREATE TABLE IF NOT EXISTS product (id SERIAL PRIMARY KEY, name VARCHAR(155) NOT NULL, slogan VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, category VARCHAR(40) NOT NULL, default_price VARCHAR(10))')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error executing query', err.stack))

module.exports = { pool };