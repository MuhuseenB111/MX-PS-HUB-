"use strict";

/*
========================================================
MX-PS HUB — DATABASE ROUTE
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

Purpose:
- Check database connectivity
- Provide a safe database health endpoint
- Keep database logic outside server.js
========================================================
*/

const express = require("express");

const {
  checkDatabaseConnection
} = require("../database/connection");

const router = express.Router();

/*
========================================================
GET /api/database/health
========================================================
*/

router.get(
  "/health",
  async (req, res) => {

    try {

      const connected =
        await checkDatabaseConnection();

      if (!connected) {

        return res.status(503).json({

          success: false,

          status: "unavailable",

          service:
            "MX-PS HUB Database",

          requestId:
            req.mxpsRequestId || null

        });

      }

      return res.status(200).json({

        success: true,

        status: "healthy",

        service:
          "MX-PS HUB Database",

        database:
          "PostgreSQL",

        timestamp:
          new Date().toISOString(),

        requestId:
          req.mxpsRequestId || null

      });

    } catch (error) {

      console.error(
        "[MX-PS HUB] Database health check failed:",
        error
      );

      return res.status(503).json({

        success: false,

        status: "unavailable",

        service:
          "MX-PS HUB Database",

        error:
          "DATABASE_CONNECTION_ERROR",

        requestId:
          req.mxpsRequestId || null

      });

    }

  }
);

module.exports = router;
