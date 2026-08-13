"use strict";

/*
=========================================================
MX-PS HUB — MAIN SERVER
MX-PS Katsina Gold & Precious Stones Trading Company
=========================================================
*/

const express = require("express");
const path = require("path");

const healthRoute = require("./routes/health");

const app = express();

/*
=========================================================
SERVER CONFIGURATION
=========================================================
*/

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";

/*
=========================================================
APPLICATION CONFIGURATION
=========================================================
*/

const APP_INFO = {
  name: "MX-PS HUB",
  company: "MX-PS Katsina Gold and Precious Stones Trading Company",
  version: "1.0.0",
  environment: NODE_ENV,

  description:
    "A secure Web3 platform connecting gold and precious-stones trading with blockchain technology.",

  ecosystems: {
    piNetwork: true,
    sidraChain: true,
    mxpsToken: true
  },

  security: {
    kycRequired: true,
    adminApprovalRequired: true,
    secureTransactions: true
  }
};

/*
=========================================================
MIDDLEWARE
=========================================================
*/

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "1mb"
}));

/*
=========================================================
SECURITY HEADERS
=========================================================
*/

app.use((req, res, next) => {
  res.setHeader(
    "X-Content-Type-Options",
    "nosniff"
  );

  res.setHeader(
    "X-Frame-Options",
    "SAMEORIGIN"
  );

  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );

  next();
});

/*
=========================================================
REQUEST LOGGER
=========================================================
*/

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[${timestamp}] ${req.method} ${req.originalUrl}`
  );

  next();
});

/*
=========================================================
FRONTEND STATIC FILES
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
API ROOT
=========================================================
*/

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,

    message: "Welcome to MX-PS HUB API",

    application: APP_INFO.name,

    version: APP_INFO.version,

    status: "online",

    endpoints: {
      api: "/api",
      health: "/api/health",
      status: "/api/health/status",
      info: "/api/info",
      time: "/api/time"
    }
  });
});

/*
=========================================================
APPLICATION INFORMATION
=========================================================
*/

app.get("/api/info", (req, res) => {
  res.status(200).json({
    success: true,
    data: APP_INFO
  });
});

/*
=========================================================
SYSTEM TIME
=========================================================
*/

app.get("/api/time", (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    unix: Date.now()
  });
});

/*
=========================================================
HOME PAGE
=========================================================
*/

app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "index.html")
  );
});

/*
=========================================================
API 404 HANDLER
=========================================================
*/

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    error: "API endpoint not found",
    path: req.originalUrl
  });
});

/*
=========================================================
GENERAL 404 HANDLER
=========================================================
*/

app.use((req, res) => {
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
      font-family: Arial, sans-serif;
      text-align: center;
    }

    .container {
      max-width: 520px;
      padding: 40px 25px;
    }

    h1 {
      font-size: 72px;
      margin: 0;
    }

    h2 {
      margin: 10px 0;
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
});

/*
=========================================================
GLOBAL ERROR HANDLER
=========================================================
*/

app.use((err, req, res, next) => {

  console.error(
    "MX-PS HUB SERVER ERROR:"
  );

  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,

    error: "Internal server error",

    message:
      NODE_ENV === "development"
        ? err.message
        : "Something went wrong on the server."
  });

});

/*
=========================================================
START SERVER
=========================================================
*/

const server = app.listen(
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
      `Environment : ${NODE_ENV}`
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
      `Status      : http://localhost:${PORT}/api/health/status`
    );

    console.log(
      `Information : http://localhost:${PORT}/api/info`
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

function shutdown(signal) {

  console.log("");

  console.log(
    `${signal} received.`
  );

  console.log(
    "Shutting down MX-PS HUB server..."
  );

  server.close(() => {

    console.log(
      "Server closed successfully."
    );

    process.exit(0);

  });

}

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);
