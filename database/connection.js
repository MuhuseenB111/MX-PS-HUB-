"use strict";

/*
========================================================
MX-PS HUB — DATABASE CONNECTION
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================
*/

const { Pool } = require("pg");

/*
========================================================
DATABASE CONFIGURATION
========================================================
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false
        }
      : false,

  max: 10,

  idleTimeoutMillis: 30000,

  connectionTimeoutMillis: 5000
});

/*
========================================================
DATABASE ERROR LISTENER
========================================================
*/

pool.on("error", (error) => {
  console.error(
    "[MX-PS HUB] Unexpected PostgreSQL pool error:",
    error
  );
});

/*
========================================================
CHECK DATABASE CONNECTION
========================================================
*/

async function checkDatabaseConnection() {
  let client;

  try {
    client = await pool.connect();

    await client.query("SELECT 1");

    return true;

  } catch (error) {

    console.error(
      "[MX-PS HUB] PostgreSQL connection failed:",
      error
    );

    return false;

  } finally {

    if (client) {
      client.release();
    }

  }
}

/*
========================================================
QUERY HELPER
========================================================
*/

async function query(text, params = []) {
  return pool.query(text, params);
}

/*
========================================================
CLOSE DATABASE
========================================================
*/

async function closeDatabaseConnection() {
  await pool.end();
}

/*
========================================================
EXPORTS
========================================================
*/

module.exports = {
  pool,
  query,
  checkDatabaseConnection,
  closeDatabaseConnection
};
