"use strict";

/*
============================================================
MX-PS HUB — APPLICATION CONFIGURATION
MX-PS Katsina Gold & Precious Stones Trading Company
============================================================
*/

const APP_CONFIG = {
  appName: "MX-PS HUB",

  companyName:
    "MX-PS Katsina Gold and Precious Stones Trading Company",

  version: "1.0.0",

  environment:
    process.env.NODE_ENV || "development",

  server: {
    port:
      Number(process.env.PORT) || 3000,

    host:
      process.env.HOST || "0.0.0.0"
  },

  database: {
    configured:
      Boolean(process.env.DATABASE_URL),

    poolMax:
      Number(process.env.DB_POOL_MAX) || 10,

    idleTimeout:
      Number(process.env.DB_IDLE_TIMEOUT) || 30000,

    connectionTimeout:
      Number(process.env.DB_CONNECTION_TIMEOUT) || 5000
  },

  ecosystems: {
    pi: true,
    sidra: true,
    mxpsToken: true
  },

  security: {
    kycRequired: true,
    adminApprovalRequired: true,
    secureTransactions: true
  }
};

module.exports = APP_CONFIG;
