"use strict";

/*
========================================================
MX-PS HUB — AUTHENTICATION ROUTES
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

Purpose:
- Register users
- Login users
- Generate JWT access tokens
- Hash passwords securely
- Read authenticated user profile

Database:
PostgreSQL

Middleware:
middleware/auth.js
========================================================
*/

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  query
} = require("../database/connection");

const {
  requireAuth
} = require("../middleware/auth");

const router = express.Router();

/*
========================================================
CONFIGURATION
========================================================
*/

const JWT_SECRET =
  process.env.JWT_SECRET;

const JWT_EXPIRES_IN =
  process.env.JWT_EXPIRES_IN || "7d";

const SALT_ROUNDS = 12;

/*
========================================================
HELPER — CREATE ACCESS TOKEN
========================================================
*/

function createAccessToken(user) {

  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.account_status
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRES_IN
    }
  );
}

/*
========================================================
POST /api/auth/register
========================================================
*/

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
        email,
        phone,
        password,
        fullName
      } = req.body || {};

      /*
      ----------------------------------------------------
      BASIC VALIDATION
      ----------------------------------------------------
      */

      if (!password) {

        return res.status(400).json({

          success: false,

          error:
            "PASSWORD_REQUIRED",

          message:
            "Password is required."

        });
      }

      if (password.length < 8) {

        return res.status(400).json({

          success: false,

          error:
            "WEAK_PASSWORD",

          message:
            "Password must contain at least 8 characters."

        });
      }

      if (!email && !phone) {

        return res.status(400).json({

          success: false,

          error:
            "IDENTIFIER_REQUIRED",

          message:
            "Email or phone number is required."

        });
      }

      /*
      ----------------------------------------------------
      NORMALIZE INPUT
      ----------------------------------------------------
      */

      const normalizedEmail =
        email
          ? String(email)
              .trim()
              .toLowerCase()
          : null;

      const normalizedPhone =
        phone
          ? String(phone).trim()
          : null;

      const normalizedFullName =
        fullName
          ? String(fullName).trim()
          : null;

      /*
      ----------------------------------------------------
      CHECK EXISTING USER
      ----------------------------------------------------
      */

      const existingUser =
        await query(
          `
          SELECT id
          FROM users
          WHERE
            ($1::varchar IS NOT NULL AND email = $1)
            OR
            ($2::varchar IS NOT NULL AND phone = $2)
          LIMIT 1
          `,
          [
            normalizedEmail,
            normalizedPhone
          ]
        );

      if (
        existingUser.rows.length > 0
      ) {

        return res.status(409).json({

          success: false,

          error:
            "USER_ALREADY_EXISTS",

          message:
            "An account with this email or phone already exists."

        });
      }

      /*
      ----------------------------------------------------
      HASH PASSWORD
      ----------------------------------------------------
      */

      const passwordHash =
        await bcrypt.hash(
          password,
          SALT_ROUNDS
        );

      /*
      ----------------------------------------------------
      CREATE USER
      ----------------------------------------------------
      */

      const result =
        await query(
          `
          INSERT INTO users (
            email,
            phone,
            password_hash,
            full_name,
            role,
            account_status,
            kyc_status
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            'user',
            'pending',
            'not_started'
          )
          RETURNING
            id,
            email,
            phone,
            full_name,
            role,
            account_status,
            kyc_status,
            created_at
          `,
          [
            normalizedEmail,
            normalizedPhone,
            passwordHash,
            normalizedFullName
          ]
        );

      const user =
        result.rows[0];

      /*
      ----------------------------------------------------
      RESPONSE
      ----------------------------------------------------
      */

      return res.status(201).json({

        success: true,

        message:
          "MX-PS HUB account created successfully.",

        user

      });

    } catch (error) {

      console.error(
        "[MX-PS HUB] Registration error:",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          "REGISTRATION_ERROR",

        message:
          "Account registration could not be completed."

      });
    }
  }
);

/*
========================================================
POST /api/auth/login
========================================================
*/

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        identifier,
        password
      } = req.body || {};

      /*
      ----------------------------------------------------
      VALIDATION
      ----------------------------------------------------
      */

      if (!identifier || !password) {

        return res.status(400).json({

          success: false,

          error:
            "LOGIN_FIELDS_REQUIRED",

          message:
            "Email/phone and password are required."

        });
      }

      /*
      ----------------------------------------------------
      FIND USER
      ----------------------------------------------------
      */

      const normalizedIdentifier =
        String(identifier)
          .trim()
          .toLowerCase();

      const result =
        await query(
          `
          SELECT
            id,
            email,
            phone,
            password_hash,
            full_name,
            role,
            account_status,
            email_verified,
            phone_verified,
            kyc_status,
            created_at
          FROM users
          WHERE
            LOWER(email) = $1
            OR phone = $2
          LIMIT 1
          `,
          [
            normalizedIdentifier,
            String(identifier).trim()
          ]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(401).json({

          success: false,

          error:
            "INVALID_CREDENTIALS",

          message:
            "Invalid login credentials."

        });
      }

      const user =
        result.rows[0];

      /*
      ----------------------------------------------------
      CHECK PASSWORD
      ----------------------------------------------------
      */

      if (!user.password_hash) {

        return res.status(401).json({

          success: false,

          error:
            "PASSWORD_NOT_CONFIGURED",

          message:
            "This account cannot currently use password login."

        });
      }

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password_hash
        );

      if (!passwordMatches) {

        return res.status(401).json({

          success: false,

          error:
            "INVALID_CREDENTIALS",

          message:
            "Invalid login credentials."

        });
      }

      /*
      ----------------------------------------------------
      ACCOUNT STATUS
      ----------------------------------------------------
      */

      if (
        user.account_status ===
        "suspended"
      ) {

        return res.status(403).json({

          success: false,

          error:
            "ACCOUNT_SUSPENDED",

          message:
            "Your account has been suspended."

        });
      }

      if (
        user.account_status ===
        "disabled"
      ) {

        return res.status(403).json({

          success: false,

          error:
            "ACCOUNT_DISABLED",

          message:
            "Your account has been disabled."

        });
      }

      /*
      ----------------------------------------------------
      CREATE JWT
      ----------------------------------------------------
      */

      const accessToken =
        createAccessToken(user);

      /*
      ----------------------------------------------------
      REMOVE PASSWORD HASH
      ----------------------------------------------------
      */

      delete user.password_hash;

      /*
      ----------------------------------------------------
      RESPONSE
      ----------------------------------------------------
      */

      return res.status(200).json({

        success: true,

        message:
          "Login successful.",

        token: accessToken,

        tokenType: "Bearer",

        expiresIn:
          JWT_EXPIRES_IN,

        user

      });

    } catch (error) {

      console.error(
        "[MX-PS HUB] Login error:",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          "LOGIN_ERROR",

        message:
          "Login could not be completed."

      });
    }
  }
);

/*
========================================================
GET /api/auth/me
========================================================

Protected endpoint.

Requires:

Authorization:
Bearer YOUR_TOKEN
========================================================
*/

router.get(
  "/me",
  requireAuth,
  async (req, res) => {

    try {

      const result =
        await query(
          `
          SELECT
            id,
            email,
            phone,
            full_name,
            role,
            account_status,
            email_verified,
            phone_verified,
            kyc_status,
            created_at,
            updated_at
          FROM users
          WHERE id = $1
          LIMIT 1
          `,
          [req.user.id]
        );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          error:
            "USER_NOT_FOUND",

          message:
            "Authenticated user was not found."

        });
      }

      return res.status(200).json({

        success: true,

        user:
          result.rows[0],

        requestId:
          req.mxpsRequestId || null

      });

    } catch (error) {

      console.error(
        "[MX-PS HUB] Profile error:",
        error
      );

      return res.status(500).json({

        success: false,

        error:
          "PROFILE_ERROR",

        message:
          "User profile could not be retrieved."

      });
    }
  }
);

/*
========================================================
EXPORT ROUTER
========================================================
*/

module.exports = router;

/*
========================================================
END OF AUTH ROUTES
========================================================
*/
