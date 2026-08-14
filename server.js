"use strict";

/*
=========================================================
MX-PS HUB — MAIN SERVER
MX-PS Katsina Gold & Precious Stones Trading Company
=========================================================
*/

const express = require("express");
const path = require("path");

const APP_CONFIG = require("./config/app");

const {
  securityHeaders,
  requestProtection,
  validateRequest,
  requestIdentifier
} = require("./middleware/security");

const healthRoute = require("./routes/health");
const databaseRoute = require("./routes/database");

const {
  closeDatabaseConnection
} = require("./database/connection");

const app = express();

/*
=========================================================
SERVER CONFIGURATION
=========================================================
*/

const PORT = APP_CONFIG.server.port;

const HOST =
  APP_CONFIG.server.host;

const NODE_ENV =
  APP_CONFIG.environment;

/*
=========================================================
APPLICATION INFORMATION
=========================================================
*/

const APP_INFO = {

  name:
    APP_CONFIG.appName,

  company:
    APP_CONFIG.companyName,

  version:
    APP_CONFIG.version,

  environment:
    NODE_ENV,

  description:
    "A secure Web3 platform connecting gold and precious-stones trading with blockchain technology.",

  ecosystems: {

    piNetwork:
      APP_CONFIG.ecosystems.pi,

    sidraChain:
      APP_CONFIG.ecosystems.sidra,

    mxpsToken:
      APP_CONFIG.ecosystems.mxpsToken

  },

  security: {

    kycRequired:
      APP_CONFIG.security.kycRequired,

    adminApprovalRequired:
      APP_CONFIG.security.adminApprovalRequired,

    secureTransactions:
      APP_CONFIG.security.secureTransactions

  },

  database: {

    type:
      "PostgreSQL",

    configured:
      APP_CONFIG.database.configured

  }

};

/*
=========================================================
GLOBAL SECURITY MIDDLEWARE
=========================================================
*/

app.use(
  securityHeaders
);

app.use(
  requestProtection
);

app.use(
  validateRequest
);

app.use(
  requestIdentifier
);

/*
=========================================================
BODY PARSING
=========================================================
*/

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb"
  })
);

/*
=========================================================
REQUEST LOGGER
=========================================================
*/

app.use(
  (req, res, next) => {

    const timestamp =
      new Date().toISOString();

    console.log(
      `[${timestamp}] ${req.method} ${req.originalUrl} [${req.mxpsRequestId}]`
    );

    next();

  }
);

/*
=========================================================
STATIC FRONTEND
=========================================================
*/

app.use(
  express.static(
    path.join(__dirname)
  )
);

/*
=========================================================
HEALTH ROUTES
=========================================================
*/

app.use(
  "/api/health",
  healthRoute
);

/*
=========================================================
DATABASE ROUTES
=========================================================
*/

app.use(
  "/api/database",
  databaseRoute
);

/*
=========================================================
API ROOT
=========================================================
*/

app.get(
  "/api",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Welcome to MX-PS HUB API",

      application:
        APP_INFO.name,

      version:
        APP_INFO.version,

      status:
        "online",

      environment:
        APP_INFO.environment,

      requestId:
        req.mxpsRequestId,

      endpoints: {

        api:
          "/api",

        health:
          "/api/health",

        ping:
          "/api/health/ping",

        info:
          "/api/info",

        time:
          "/api/time",

        databaseHealth:
          "/api/database/health"

      }

    });

  }
);

/*
=========================================================
APPLICATION INFORMATION
=========================================================
*/

app.get(
  "/api/info",
  (req, res) => {

    res.status(200).json({

      success: true,

      data:
        APP_INFO,

      requestId:
        req.mxpsRequestId

    });

  }
);

/*
=========================================================
SYSTEM TIME
=========================================================
*/

app.get(
  "/api/time",
  (req, res) => {

    res.status(200).json({

      success: true,

      timestamp:
        new Date().toISOString(),

      unix:
        Date.now(),

      requestId:
        req.mxpsRequestId

    });

  }
);

/*
=========================================================
HOME PAGE
=========================================================
*/

app.get(
  "/",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "index.html"
      )
    );

  }
);

/*
=========================================================
API 404 HANDLER
=========================================================
*/

app.use(
  "/api",
  (req, res) => {

    res.status(404).json({

      success: false,

      error:
        "API endpoint not found",

      path:
        req.originalUrl,

      requestId:
        req.mxpsRequestId

    });

  }
);

/*
=========================================================
GENERAL 404 HANDLER
=========================================================
*/

app.use(
  (req, res) => {

    res.status(404).send(`

<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>MX-PS HUB — 404</title>

  <style>

    * {
      box-sizing: border-box;
    }

    body {

      margin: 0;

      min-height: 100vh;

      display: flex;

      align-items: center;

      justify-content: center;

      background: #0b1117;

      color: #ffffff;

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      text-align: center;

    }

    .container {

      width: 100%;

      max-width: 520px;

      padding: 40px 25px;

    }

    h1 {

      margin: 0;

      font-size: 72px;

      line-height: 1;

    }

    h2 {

      margin: 15px 0;

    }

    p {

      color: #b8c0c8;

      line-height: 1.6;

    }

    a {

      display: inline-block;

      margin-top: 20px;

      padding: 12px 22px;

      border-radius: 8px;

      background: #d4af37;

      color: #111111;

      text-decoration: none;

      font-weight: bold;

    }

  </style>

</head>

<body>

  <div class="container">

    <h1>404</h1>

    <h2>Page Not Found</h2>

    <p>
      The page you requested could not be
      found on MX-PS HUB.
    </p>

    <a href="/">
      Return to MX-PS HUB
    </a>

  </div>

</body>

</html>

    `);

  }
);

/*
=========================================================
GLOBAL ERROR HANDLER
=========================================================
*/

app.use(
  (err, req, res, next) => {

    console.error(
      "[MX-PS HUB] SERVER ERROR:"
    );

    console.error(err);

    if (
      res.headersSent
    ) {

      return next(err);

    }

    res.status(500).json({

      success: false,

      error:
        "Internal server error",

      message:
        NODE_ENV === "development"
          ? err.message
          : "Something went wrong on the server.",

      requestId:
        req.mxpsRequestId || null

    });

  }
);

/*
=========================================================
START SERVER
=========================================================
*/

const server =
  app.listen(
    PORT,
    HOST,
    () => {

      console.log("");

      console.log(
        "================================================="
      );

      console.log(
        "              MX-PS HUB SERVER"
      );

      console.log(
        "================================================="
      );

      console.log(
        `Application : ${APP_INFO.name}`
      );

      console.log(
        `Company     : ${APP_INFO.company}`
      );

      console.log(
        `Version     : ${APP_INFO.version}`
      );

      console.log(
        `Environment : ${APP_INFO.environment}`
      );

      console.log("");

      console.log(
        `Server      : http://localhost:${PORT}`
      );

      console.log(
        `API         : http://localhost:${PORT}/api`
      );

      console.log(
        `Health      : http://localhost:${PORT}/api/health`
      );

      console.log(
        `Ping        : http://localhost:${PORT}/api/health/ping`
      );

      console.log(
        `Information : http://localhost:${PORT}/api/info`
      );

      console.log(
        `Database    : http://localhost:${PORT}/api/database/health`
      );

      console.log("");

      console.log(
        `Database Configured : ${APP_INFO.database.configured}`
      );

      console.log("");

      console.log(
        "Pi Network  : Integration Ready"
      );

      console.log(
        "Sidra Chain : Integration Ready"
      );

      console.log(
        "MX-PS Token : Integration Ready"
      );

      console.log("");

      console.log(
        "================================================="
      );

    }
  );

/*
=========================================================
GRACEFUL SHUTDOWN
=========================================================
*/

async function shutdown(signal) {

  console.log("");

  console.log(
    `${signal} received.`
  );

  console.log(
    "Shutting down MX-PS HUB server..."
  );

  server.close(
    async () => {

      try {

        await closeDatabaseConnection();

      } catch (error) {

        console.error(
          "[MX-PS HUB] Database shutdown error:",
          error
        );

      }

      console.log(
        "MX-PS HUB server closed successfully."
      );

      process.exit(0);

    }
  );

}

/*
=========================================================
PROCESS SIGNALS
=========================================================
*/

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);
