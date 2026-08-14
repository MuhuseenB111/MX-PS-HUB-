"use strict";

/*
=========================================================
MX-PS HUB — DATABASE CONNECTION
MX-PS Katsina Gold & Precious Stones Trading Company
=========================================================
*/

const { Pool } = require("pg");

/*
=========================================================
DATABASE CONFIGURATION
=========================================================
*/

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,

  max: Number(
    process.env.DB_POOL_MAX || 10
  ),

  idleTimeoutMillis: Number(
    process.env.DB_IDLE_TIMEOUT || 30000
  ),

  connectionTimeoutMillis: Number(
    process.env.DB_CONNECTION_TIMEOUT || 5000
  ),

  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false
});

/*
=========================================================
DATABASE ERROR HANDLER
=========================================================
*/

pool.on(
  "error",
  (error) => {

    console.error(
      "[MX-PS HUB] Unexpected database error:",
      error
    );

  }
);

/*
=========================================================
DATABASE HEALTH CHECK
=========================================================
*/

async function checkDatabaseConnection() {

  const client =
    await pool.connect();

  try {

    await client.query(
      "SELECT 1"
    );

    return true;

  } finally {

    client.release();

  }
}

/*
=========================================================
DATABASE QUERY HELPER
=========================================================
*/

async function query(
  text,
  params = []
) {

  return pool.query(
    text,
    params
  );

}

/*
=========================================================
GRACEFUL DATABASE SHUTDOWN
=========================================================
*/

async function closeDatabaseConnection() {

  await pool.end();

  console.log(
    "[MX-PS HUB] Database connection pool closed."
  );

}

/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {

  pool,

  query,

  checkDatabaseConnection,

  closeDatabaseConnection

};
