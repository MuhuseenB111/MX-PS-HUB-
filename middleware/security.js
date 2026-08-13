/* =========================================================
   MX-PS HUB
   SECURITY MIDDLEWARE
   ========================================================= */

"use strict";


/* =========================================================
   SECURITY HEADERS
   ========================================================= */

function securityHeaders(req, res, next) {

    res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
    );

    res.setHeader(
        "X-Frame-Options",
        "SAMEORIGIN"
    );

    res.setHeader(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );

    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()"
    );

    next();
}


/* =========================================================
   REQUEST SIZE PROTECTION
   ========================================================= */

function requestProtection(req, res, next) {

    const contentLength =
        Number(
            req.headers["content-length"] || 0
        );

    const maximumSize =
        1024 * 1024;

    if (
        contentLength > maximumSize
    ) {

        return res.status(413).json({

            success: false,

            error:
                "Request payload is too large."

        });
    }

    next();
}


/* =========================================================
   BASIC REQUEST VALIDATION
   ========================================================= */

function validateRequest(req, res, next) {

    const blockedHeaders = [

        "x-forwarded-host",
        "x-http-method-override"

    ];


    for (
        const header of blockedHeaders
    ) {

        if (
            req.headers[header]
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Invalid request headers."

            });
        }
    }


    next();
}


/* =========================================================
   API REQUEST IDENTIFIER
   ========================================================= */

function requestIdentifier(req, res, next) {

    const requestId =
        `mxps-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 10)}`;


    req.mxpsRequestId =
        requestId;


    res.setHeader(
        "X-MXPS-Request-ID",
        requestId
    );


    next();
}


/* =========================================================
   EXPORTS
   ========================================================= */

module.exports = {

    securityHeaders,

    requestProtection,

    validateRequest,

    requestIdentifier

};


/* =========================================================
   END OF SECURITY MIDDLEWARE
   ========================================================= */
