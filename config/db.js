const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wereport',
  password: 'kira',
  port: 5432,
});

module.exports = pool;