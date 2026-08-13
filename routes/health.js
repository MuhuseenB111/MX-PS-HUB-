/*
========================================================
MX-PS HUB — HEALTH API ROUTE
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================
*/

"use strict";

const express = require("express");

const router = express.Router();

/*
========================================================
GET /api/health
========================================================
*/

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "online",
    service: "MX-PS HUB API",
    company: "MX-PS Katsina Gold and Precious Stones Trading Company",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

/*
========================================================
EXPORT ROUTER
========================================================
*/

module.exports = router;
