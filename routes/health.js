"use strict";

/*
========================================================
MX-PS HUB — HEALTH ROUTE
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================
*/

const express = require("express");

const router = express.Router();

/*
--------------------------------------------------------
GET /api/health
--------------------------------------------------------
Basic server health check
--------------------------------------------------------
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "MX-PS HUB API",
    company: "MX-PS Katsina Gold and Precious Stones Trading Company",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

/*
--------------------------------------------------------
GET /api/health/ping
--------------------------------------------------------
Simple API connectivity test
--------------------------------------------------------
*/

router.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MX-PS HUB API is online",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
