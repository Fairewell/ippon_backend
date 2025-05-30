const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const connect = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database');
    return pool;
  } catch (err) {
    console.error('Error connecting to PostgreSQL database', err);
    throw err;
  }
};

module.exports = {
  connect,
  pool,
};