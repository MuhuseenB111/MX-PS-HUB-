"use strict";

/*
=========================================================
MX-PS HUB — HEALTH ROUTE
=========================================================
*/

const express = require("express");

const router = express.Router();

/*
=========================================================
HEALTH CHECK
=========================================================
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "MX-PS HUB API",
    message: "MX-PS HUB server is running successfully.",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/*
=========================================================
API STATUS
=========================================================
*/

router.get("/status", (req, res) => {
  res.status(200).json({
    success: true,
    application: "MX-PS HUB",
    version: "1.0.0",
    status: "operational",
    ecosystems: {
      piNetwork: true,
      sidraChain: true,
      mxpsToken: true
    },
    security: {
      kycRequired: true,
      adminApprovalRequired: true
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
