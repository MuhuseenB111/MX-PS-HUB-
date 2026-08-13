/*
========================================================
MX-PS HUB — ROLES & PERMISSIONS MIDDLEWARE
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

Purpose:
- Control access based on user roles
- Protect administrative routes
- Protect seller-only routes
- Support multiple allowed roles
- Keep authorization separate from authentication

Authentication:
middleware/auth.js

Authorization:
middleware/roles.js
========================================================
*/

"use strict";

/*
========================================================
SUPPORTED ROLES
========================================================
*/

const ROLES = Object.freeze({
  USER: "user",
  SELLER: "seller",
  VERIFIED_SELLER: "verified_seller",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin"
});

/*
========================================================
ROLE HIERARCHY
========================================================

Higher number = higher privilege.

This allows us to create rules such as:

admin can access seller resources
super_admin can access everything
========================================================
*/

const ROLE_LEVELS = Object.freeze({
  [ROLES.USER]: 10,
  [ROLES.SELLER]: 20,
  [ROLES.VERIFIED_SELLER]: 30,
  [ROLES.ADMIN]: 40,
  [ROLES.SUPER_ADMIN]: 50
});

/*
========================================================
NORMALIZE ROLE
========================================================
*/

function normalizeRole(role) {
  if (!role) {
    return null;
  }

  return String(role)
    .trim()
    .toLowerCase();
}

/*
========================================================
CHECK VALID ROLE
========================================================
*/

function isValidRole(role) {
  const normalizedRole = normalizeRole(role);

  return Object.values(ROLES).includes(
    normalizedRole
  );
}

/*
========================================================
GET USER ROLE
========================================================
*/

function getUserRole(req) {
  if (!req || !req.user) {
    return null;
  }

  return normalizeRole(req.user.role);
}

/*
========================================================
REQUIRE SPECIFIC ROLES
========================================================

Example:

router.get(
  "/seller/dashboard",
  requireAuth,
  requireRole("seller", "verified_seller"),
  controller
);
========================================================
*/

function requireRole(...allowedRoles) {
  const normalizedAllowedRoles = allowedRoles
    .flat()
    .map(normalizeRole)
    .filter(Boolean);

  return function roleMiddleware(req, res, next) {
    const userRole = getUserRole(req);

    if (!userRole) {
      return res.status(401).json({
        success: false,
        error: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required."
      });
    }

    if (!isValidRole(userRole)) {
      return res.status(403).json({
        success: false,
        error: "INVALID_USER_ROLE",
        message: "Your account role is not recognized."
      });
    }

    if (normalizedAllowedRoles.length === 0) {
      return res.status(500).json({
        success: false,
        error: "ROLE_CONFIGURATION_ERROR",
        message: "No allowed roles were configured."
      });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: "ACCESS_DENIED",
        message: "You do not have permission to access this resource."
      });
    }

    return next();
  };
}

/*
========================================================
REQUIRE MINIMUM ROLE LEVEL
========================================================

Example:

requireMinimumRole("admin")

This allows:

admin
super_admin

But blocks:

user
seller
verified_seller
========================================================
*/

function requireMinimumRole(requiredRole) {
  const normalizedRequiredRole =
    normalizeRole(requiredRole);

  return function minimumRoleMiddleware(req, res, next) {
    const userRole = getUserRole(req);

    if (!userRole) {
      return res.status(401).json({
        success: false,
        error: "AUTHENTICATION_REQUIRED",
        message: "Authentication is required."
      });
    }

    if (!isValidRole(userRole)) {
      return res.status(403).json({
        success: false,
        error: "INVALID_USER_ROLE",
        message: "Your account role is not recognized."
      });
    }

    if (!isValidRole(normalizedRequiredRole)) {
      return res.status(500).json({
        success: false,
        error: "ROLE_CONFIGURATION_ERROR",
        message: "The required role is invalid."
      });
    }

    const userLevel =
      ROLE_LEVELS[userRole];

    const requiredLevel =
      ROLE_LEVELS[normalizedRequiredRole];

    if (userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        error: "INSUFFICIENT_PERMISSIONS",
        message: "You do not have sufficient permissions."
      });
    }

    return next();
  };
}

/*
========================================================
ADMIN ACCESS
========================================================
*/

function requireAdmin(req, res, next) {
  return requireMinimumRole(
    ROLES.ADMIN
  )(req, res, next);
}

/*
========================================================
SUPER ADMIN ACCESS
========================================================
*/

function requireSuperAdmin(req, res, next) {
  return requireRole(
    ROLES.SUPER_ADMIN
  )(req, res, next);
}

/*
========================================================
SELLER ACCESS
========================================================
*/

function requireSeller(req, res, next) {
  return requireRole(
    ROLES.SELLER,
    ROLES.VERIFIED_SELLER,
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN
  )(req, res, next);
}

/*
========================================================
VERIFIED SELLER ACCESS
========================================================
*/

function requireVerifiedSeller(req, res, next) {
  return requireMinimumRole(
    ROLES.VERIFIED_SELLER
  )(req, res, next);
}

/*
========================================================
ROLE CHECK HELPER
========================================================
*/

function hasRole(req, role) {
  const userRole = getUserRole(req);

  return userRole === normalizeRole(role);
}

/*
========================================================
MULTIPLE ROLE CHECK
========================================================
*/

function hasAnyRole(req, ...roles) {
  const userRole = getUserRole(req);

  if (!userRole) {
    return false;
  }

  const normalizedRoles = roles
    .flat()
    .map(normalizeRole);

  return normalizedRoles.includes(userRole);
}

/*
========================================================
EXPORTS
========================================================
*/

module.exports = {
  ROLES,
  ROLE_LEVELS,
  normalizeRole,
  isValidRole,
  getUserRole,
  requireRole,
  requireMinimumRole,
  requireAdmin,
  requireSuperAdmin,
  requireSeller,
  requireVerifiedSeller,
  hasRole,
  hasAnyRole
};
