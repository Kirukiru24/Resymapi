// const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'wereport',
//   password: 'kira',
//   port: 5432,
// });

// module.exports = pool;

const { Pool } = require('pg');
require('dotenv').config(); // Loads variables from .env during local development

// Check if we are running on Render (production)
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  // Use the connection string provided by the environment variable
  connectionString: process.env.DATABASE_URL,
  
  // SSL is required for cloud databases but usually not for local ones
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

module.exports = pool;