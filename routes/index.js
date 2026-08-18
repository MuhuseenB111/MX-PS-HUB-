"use strict";

/*
========================================================
MX-PS HUB — ROUTE REGISTRY
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================
*/

const express = require("express");

const router = express.Router();

/*
========================================================
LOAD ROUTES
========================================================
*/

const healthRoutes = require("./health");
const databaseRoutes = require("./database");
const authRoutes = require("./auth");
const kycRoutes = require("./kyc");

/*
========================================================
REGISTER ROUTES
========================================================
*/

router.use("/health", healthRoutes);

router.use("/database", databaseRoutes);

router.use("/auth", authRoutes);

router.use("/kyc", kycRoutes);

/*
========================================================
API INDEX
========================================================
*/

router.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    name: "MX-PS HUB API",

    version: "1.0.0",

    company:
      "MX-PS Katsina Gold and Precious Stones Trading Company",

    availableRoutes: [
      "/api/health",
      "/api/database",
      "/api/auth",
      "/api/kyc"
    ],

    timestamp:
      new Date().toISOString()

  });

});

/*
========================================================
EXPORT
========================================================
*/

module.exports = router;
