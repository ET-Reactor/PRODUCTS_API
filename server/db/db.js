require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
});

pool
  .query('CREATE TABLE IF NOT EXISTS product (id SERIAL PRIMARY KEY, name VARCHAR(155) NOT NULL, slogan VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, category VARCHAR(40) NOT NULL, default_price VARCHAR(10) NOT NULL)')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error creating product table', err.stack));
pool
  .query('CREATE TABLE IF NOT EXISTS related (id SERIAL PRIMARY KEY, current_product_id INT REFERENCES product (id), related_product_id INT)')
  .then(res => console.log(res.rows))
  .catch(err => console.error('Error creating related table', err.stack));

module.exports = { pool };