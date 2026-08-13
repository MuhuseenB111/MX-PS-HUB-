/*
========================================================
MX-PS HUB — MAIN SERVER
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================
*/

"use strict";

const express = require("express");
const path = require("path");

const healthRoute = require("./routes/health");

const app = express();

/*
========================================================
SERVER CONFIGURATION
========================================================
*/

const PORT = process.env.PORT || 3000;

/*
========================================================
SECURITY HEADERS
========================================================
*/

app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
});

/*
========================================================
BODY PARSERS
========================================================
*/

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

/*
========================================================
STATIC WEBSITE
========================================================
*/

app.use(express.static(path.join(__dirname)));

/*
========================================================
API ROUTES
========================================================
*/

app.use("/api/health", healthRoute);

/*
========================================================
API ROOT
========================================================
*/

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    name: "MX-PS HUB API",
    version: "1.0.0",
    status: "online",
    company:
      "MX-PS Katsina Gold and Precious Stones Trading Company",
    endpoints: {
      health: "/api/health"
    }
  });
});

/*
========================================================
404 HANDLER
========================================================
*/

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      success: false,
      error: "API endpoint not found"
    });
  }

  res.status(404).send("Page not found");
});

/*
========================================================
GLOBAL ERROR HANDLER
========================================================
*/

app.use((err, req, res, next) => {
  console.error("MX-PS HUB ERROR:", err);

  res.status(500).json({
    success: false,
    error: "Internal server error"
  });
});

/*
========================================================
START SERVER
========================================================
*/

app.listen(PORT, () => {
  console.log("==============================================");
  console.log("MX-PS HUB SERVER");
  console.log("==============================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`API: /api`);
  console.log(`Health: /api/health`);
  console.log("==============================================");
});
