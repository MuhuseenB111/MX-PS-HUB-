/*
========================================================
MX-PS HUB — AUTHENTICATION MIDDLEWARE
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

Purpose:
- Protect private API routes
- Validate JWT access tokens
- Attach authenticated user to req.user
- Provide optional authentication
- Keep authentication logic separate from routes

IMPORTANT:
- Never put JWT secrets directly in this file.
- The secret will come from environment variables.
========================================================
*/

"use strict";

const jwt = require("jsonwebtoken");

/*
========================================================
CONFIGURATION
========================================================
*/

const JWT_SECRET = process.env.JWT_SECRET;

/*
========================================================
TOKEN EXTRACTION
========================================================
*/

function extractToken(req) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const parts = authorization.trim().split(/\s+/);

  if (parts.length !== 2) {
    return null;
  }

  const [scheme, token] = parts;

  if (scheme.toLowerCase() !== "bearer") {
    return null;
  }

  if (!token) {
    return null;
  }

  return token;
}

/*
========================================================
REQUIRED AUTHENTICATION
========================================================

Use this middleware for protected routes.

Example:

router.get(
  "/profile",
  requireAuth,
  profileController
);
========================================================
*/

function requireAuth(req, res, next) {
  try {
    if (!JWT_SECRET) {
      console.error(
        "[MX-PS HUB] JWT_SECRET is not configured."
      );

      return res.status(500).json({
        success: false,
        error: "SERVER_CONFIGURATION_ERROR",
        message: "Authentication service is not configured."
      });
    }

    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "AUTHENTICATION_REQUIRED",
        message: "A valid Bearer access token is required."
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
        message: "The authentication token is invalid."
      });
    }

    /*
    Attach only verified token data.
    */

    req.user = {
      id: decoded.sub || decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || "user",
      status: decoded.status || "active"
    };

    /*
    Keep original verified payload available
    when needed internally.
    */

    req.auth = decoded;

    return next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "TOKEN_EXPIRED",
        message: "Your access token has expired."
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
        message: "Your access token is invalid."
      });
    }

    console.error(
      "[MX-PS HUB] Authentication error:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "AUTHENTICATION_ERROR",
      message: "Authentication could not be completed."
    });
  }
}

/*
========================================================
OPTIONAL AUTHENTICATION
========================================================

Useful for public endpoints where we want to know
whether a user is logged in, without blocking guests.
========================================================
*/

function optionalAuth(req, res, next) {
  try {
    if (!JWT_SECRET) {
      req.user = null;
      req.auth = null;
      return next();
    }

    const token = extractToken(req);

    if (!token) {
      req.user = null;
      req.auth = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"]
    });

    req.user = {
      id: decoded.sub || decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || "user",
      status: decoded.status || "active"
    };

    req.auth = decoded;

    return next();

  } catch (error) {
    /*
    Optional authentication should not block
    public users because their token is invalid
    or expired.
    */

    req.user = null;
    req.auth = null;

    return next();
  }
}

/*
========================================================
AUTHENTICATION HELPER
========================================================
*/

function isAuthenticated(req) {
  return Boolean(
    req.user &&
    req.user.id
  );
}

/*
========================================================
EXPORTS
========================================================
*/

module.exports = {
  requireAuth,
  optionalAuth,
  isAuthenticated
};
