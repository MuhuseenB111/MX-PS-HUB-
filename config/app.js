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

  environment: process.env.NODE_ENV || "development",

  server: {
    port: Number(process.env.PORT) || 3000
  },

  ecosystems: {
    pi: true,
    sidra: true,
    mxpsToken: true
  },

  security: {
    kycRequired: true,
    adminApprovalRequired: true
  }
};

module.exports = APP_CONFIG;
