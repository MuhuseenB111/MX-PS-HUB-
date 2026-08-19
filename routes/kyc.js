"use strict";

const express = require("express");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
*/

const authModule = require("../middleware/auth");

const requireAuth =
  typeof authModule === "function"
    ? authModule
    : authModule.requireAuth ||
      authModule.authenticate ||
      authModule.auth;

if (typeof requireAuth !== "function") {
  throw new Error(
    "[MX-PS HUB] Authentication middleware was not found in middleware/auth.js"
  );
}


/*
|--------------------------------------------------------------------------
| Temporary KYC Store
|--------------------------------------------------------------------------
| Wannan memory store ne na wucin gadi.
| Daga baya za mu mayar da KYC zuwa PostgreSQL/database.
|
| IMPORTANT:
| Kada a yi amfani da wannan memory store a production.
|--------------------------------------------------------------------------
*/

const kycRecords = new Map();


/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

function getUserId(req) {
  return (
    req.user?.id ||
    req.user?._id ||
    req.user?.userId ||
    req.user?.uid ||
    null
  );
}


function normalize(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}


function getUserRole(req) {
  return (
    req.user?.role ||
    req.user?.userRole ||
    req.user?.type ||
    null
  );
}


function isAdmin(req) {
  const role = getUserRole(req);

  return (
    role === "admin" ||
    role === "superadmin"
  );
}


/*
|--------------------------------------------------------------------------
| GET /api/kyc/status
|--------------------------------------------------------------------------
| User zai duba matsayin KYC dinsa.
|--------------------------------------------------------------------------
*/

router.get(
  "/status",
  requireAuth,
  (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User authentication information was not found."
        });
      }

      const kyc =
        kycRecords.get(String(userId));

      if (!kyc) {
        return res.status(200).json({
          success: true,
          verified: false,
          status: "not_submitted",
          message:
            "KYC has not been submitted yet."
        });
      }

      return res.status(200).json({
        success: true,
        verified:
          kyc.status === "verified",
        status: kyc.status,
        submittedAt:
          kyc.submittedAt,
        reviewedAt:
          kyc.reviewedAt || null,
        rejectionReason:
          kyc.rejectionReason || null
      });

    } catch (error) {
      console.error(
        "[MX-PS HUB] KYC status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve KYC status."
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| POST /api/kyc/submit
|--------------------------------------------------------------------------
| User yana submit basic KYC information.
|--------------------------------------------------------------------------
*/

router.post(
  "/submit",
  requireAuth,
  (req, res) => {
    try {
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User authentication information was not found."
        });
      }

      const existingKyc =
        kycRecords.get(String(userId));

      if (
        existingKyc &&
        existingKyc.status === "verified"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Your KYC is already verified."
        });
      }


      const {
        firstName,
        lastName,
        dateOfBirth,
        country,
        documentType
      } = req.body || {};


      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      const cleanFirstName =
        normalize(firstName);

      const cleanLastName =
        normalize(lastName);

      const cleanDateOfBirth =
        normalize(dateOfBirth);

      const cleanCountry =
        normalize(country);

      const cleanDocumentType =
        normalize(documentType);


      if (!cleanFirstName) {
        return res.status(400).json({
          success: false,
          message:
            "First name is required."
        });
      }


      if (!cleanLastName) {
        return res.status(400).json({
          success: false,
          message:
            "Last name is required."
        });
      }


      if (!cleanDateOfBirth) {
        return res.status(400).json({
          success: false,
          message:
            "Date of birth is required."
        });
      }


      if (!cleanCountry) {
        return res.status(400).json({
          success: false,
          message:
            "Country is required."
        });
      }


      if (!cleanDocumentType) {
        return res.status(400).json({
          success: false,
          message:
            "Document type is required."
        });
      }


      /*
      |--------------------------------------------------------------------------
      | Allowed Document Types
      |--------------------------------------------------------------------------
      */

      const allowedDocumentTypes = [
        "national_id",
        "passport",
        "drivers_license",
        "voters_card"
      ];


      if (
        !allowedDocumentTypes.includes(
          cleanDocumentType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid document type."
        });
      }


      /*
      |--------------------------------------------------------------------------
      | Create KYC Record
      |--------------------------------------------------------------------------
      */

      const now =
        new Date().toISOString();


      const kycRecord = {
        userId:
          String(userId),

        firstName:
          cleanFirstName,

        lastName:
          cleanLastName,

        dateOfBirth:
          cleanDateOfBirth,

        country:
          cleanCountry,

        documentType:
          cleanDocumentType,

        status:
          "pending",

        submittedAt:
          now,

        reviewedAt:
          null,

        rejectionReason:
          null
      };


      kycRecords.set(
        String(userId),
        kycRecord
      );


      return res.status(201).json({
        success: true,

        message:
          "KYC submitted successfully and is now pending review.",

        kyc: {
          status:
            kycRecord.status,

          submittedAt:
            kycRecord.submittedAt
        }
      });

    } catch (error) {
      console.error(
        "[MX-PS HUB] KYC submission error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to submit KYC."
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| ADMIN: GET /api/kyc/pending
|--------------------------------------------------------------------------
| Admin zai ga KYC records da suke pending.
|--------------------------------------------------------------------------
*/

router.get(
  "/pending",
  requireAuth,
  (req, res) => {
    try {
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message:
            "Admin access required."
        });
      }


      const pendingKyc =
        Array.from(
          kycRecords.values()
        )
        .filter(
          (kyc) =>
            kyc.status === "pending"
        )
        .map(
          (kyc) => ({
            userId:
              kyc.userId,

            firstName:
              kyc.firstName,

            lastName:
              kyc.lastName,

            country:
              kyc.country,

            documentType:
              kyc.documentType,

            status:
              kyc.status,

            submittedAt:
              kyc.submittedAt
          })
        );


      return res.status(200).json({
        success: true,

        count:
          pendingKyc.length,

        data:
          pendingKyc
      });

    } catch (error) {
      console.error(
        "[MX-PS HUB] Pending KYC error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to retrieve pending KYC records."
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| ADMIN: PATCH /api/kyc/:userId/verify
|--------------------------------------------------------------------------
| Admin yana tabbatar da KYC.
|--------------------------------------------------------------------------
*/

router.patch(
  "/:userId/verify",
  requireAuth,
  (req, res) => {
    try {
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message:
            "Admin access required."
        });
      }


      const userId =
        normalize(req.params.userId);


      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "User ID is required."
        });
      }


      const kyc =
        kycRecords.get(userId);


      if (!kyc) {
        return res.status(404).json({
          success: false,
          message:
            "KYC record not found."
        });
      }


      kyc.status =
        "verified";

      kyc.reviewedAt =
        new Date().toISOString();

      kyc.rejectionReason =
        null;


      kycRecords.set(
        userId,
        kyc
      );


      return res.status(200).json({
        success: true,

        message:
          "KYC verified successfully.",

        kyc: {
          userId:
            kyc.userId,

          status:
            kyc.status,

          reviewedAt:
            kyc.reviewedAt
        }
      });

    } catch (error) {
      console.error(
        "[MX-PS HUB] KYC verification error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to verify KYC."
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| ADMIN: PATCH /api/kyc/:userId/reject
|--------------------------------------------------------------------------
| Admin zai iya reject KYC tare da dalili.
|--------------------------------------------------------------------------
*/

router.patch(
  "/:userId/reject",
  requireAuth,
  (req, res) => {
    try {
      if (!isAdmin(req)) {
        return res.status(403).json({
          success: false,
          message:
            "Admin access required."
        });
      }


      const userId =
        normalize(req.params.userId);

      const reason =
        normalize(
          req.body?.reason
        );


      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "User ID is required."
        });
      }


      if (!reason) {
        return res.status(400).json({
          success: false,
          message:
            "A rejection reason is required."
        });
      }


      if (reason.length > 500) {
        return res.status(400).json({
          success: false,
          message:
            "Rejection reason is too long."
        });
      }


      const kyc =
        kycRecords.get(userId);


      if (!kyc) {
        return res.status(404).json({
          success: false,
          message:
            "KYC record not found."
        });
      }


      kyc.status =
        "rejected";

      kyc.rejectionReason =
        reason;

      kyc.reviewedAt =
        new Date().toISOString();


      kycRecords.set(
        userId,
        kyc
      );


      return res.status(200).json({
        success: true,

        message:
          "KYC rejected.",

        kyc: {
          userId:
            kyc.userId,

          status:
            kyc.status,

          rejectionReason:
            kyc.rejectionReason,

          reviewedAt:
            kyc.reviewedAt
        }
      });

    } catch (error) {
      console.error(
        "[MX-PS HUB] KYC rejection error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to reject KYC."
      });
    }
  }
);


/*
|--------------------------------------------------------------------------
| Export Router
|--------------------------------------------------------------------------
*/

module.exports = router;
