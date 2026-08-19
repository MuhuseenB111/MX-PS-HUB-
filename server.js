"use strict";

const express = require("express");
const path = require("path");

const {
  securityHeaders,
  requestProtection,
  validateRequest,
  requestIdentifier
} = require("./middleware/security");

const healthRoutes = require("./routes/health");
const databaseRoutes = require("./routes/database");
const authRoutes = require("./routes/auth");
const kycRoutes = require("./routes/kyc");

const {
  checkDatabaseConnection
} = require("./database/connection");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

app.disable("x-powered-by");

app.use(securityHeaders);
app.use(requestProtection);
app.use(validateRequest);
app.use(requestIdentifier);

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

app.use(
  express.static(path.join(__dirname))
);

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "MX-PS HUB API",
    company:
      "MX-PS Katsina Gold and Precious Stones Trading Company",
    version: "1.0.0",
    status: "online",
    requestId: req.mxpsRequestId || null,
    timestamp: new Date().toISOString()
  });
});

app.use(
  "/api/health",
  healthRoutes
);

app.use(
  "/api/database",
  databaseRoutes
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/kyc",
  kycRoutes
);

app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success: false,
      error: "ROUTE_NOT_FOUND",
      message:
        "The requested API route was not found.",
      path: req.originalUrl,
      requestId: req.mxpsRequestId || null
    });
  }
);

app.get(
  "/{*splat}",
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        "index.html"
      )
    );
  }
);

app.use(
  (error, req, res, next) => {
    console.error(
      "[MX-PS HUB] Server error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      message:
        "An unexpected server error occurred.",
      requestId: req.mxpsRequestId || null
    });
  }
);

async function startServer() {
  try {
    console.log(
      "=============================================="
    );

    console.log(
      "MX-PS HUB — STARTING SERVER"
    );

    console.log(
      "=============================================="
    );

    const databaseConnected =
      await checkDatabaseConnection();

    if (databaseConnected) {
      console.log(
        "[MX-PS HUB] PostgreSQL database connected."
      );
    } else {
      console.warn(
        "[MX-PS HUB] PostgreSQL database is not connected."
      );

      console.warn(
        "[MX-PS HUB] Server will continue running."
      );
    }

    app.listen(
      PORT,
      HOST,
      () => {
        console.log(
          "=============================================="
        );

        console.log(
          "[MX-PS HUB] Server is running."
        );

        console.log(
          `[MX-PS HUB] Host: ${HOST}`
        );

        console.log(
          `[MX-PS HUB] Port: ${PORT}`
        );

        console.log(
          `[MX-PS HUB] API: http://localhost:${PORT}/api`
        );

        console.log(
          `[MX-PS HUB] Health: http://localhost:${PORT}/api/health`
        );

        console.log(
          `[MX-PS HUB] Database Health: http://localhost:${PORT}/api/database/health`
        );

        console.log(
          `[MX-PS HUB] Auth: http://localhost:${PORT}/api/auth`
        );

        console.log(
          `[MX-PS HUB] KYC: http://localhost:${PORT}/api/kyc`
        );

        console.log(
          "=============================================="
        );
      }
    );
  } catch (error) {
    console.error(
      "[MX-PS HUB] Failed to start server:"
    );

    console.error(error);

    process.exit(1);
  }
}

process.on(
  "unhandledRejection",
  (reason) => {
    console.error(
      "[MX-PS HUB] Unhandled Promise Rejection:",
      reason
    );
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "[MX-PS HUB] Uncaught Exception:",
      error
    );

    process.exit(1);
  }
);

startServer();

module.exports = app;
