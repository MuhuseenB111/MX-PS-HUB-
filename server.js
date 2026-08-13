/* =========================================================
   MX-PS HUB
   MX-PS Katsina Gold & Precious Stones Trading Company

   BACKEND SERVER
   Version: 1.0.0
   ========================================================= */

"use strict";


/* =========================================================
   1. DEPENDENCIES
   ========================================================= */

const express = require("express");
const path = require("path");


/* =========================================================
   2. APPLICATION CONFIGURATION
   ========================================================= */

const app = express();

const PORT =
    Number(process.env.PORT) || 3000;

const HOST =
    process.env.HOST || "0.0.0.0";

const APP_NAME =
    "MX-PS HUB";

const APP_VERSION =
    "1.0.0";


/* =========================================================
   3. SECURITY / BASIC SERVER SETTINGS
   ========================================================= */

app.disable("x-powered-by");


/* =========================================================
   4. MIDDLEWARE
   ========================================================= */

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);


/* =========================================================
   5. STATIC FRONTEND
   ========================================================= */

app.use(
    express.static(
        path.join(__dirname)
    )
);


/* =========================================================
   6. REQUEST LOGGER
   ========================================================= */

app.use(
    (req, res, next) => {

        const timestamp =
            new Date().toISOString();

        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl}`
        );

        next();
    }
);


/* =========================================================
   7. HEALTH CHECK
   ========================================================= */

app.get(
    "/api/health",
    (req, res) => {

        res.status(200).json({

            success: true,

            app: APP_NAME,

            version: APP_VERSION,

            status: "online",

            environment:
                process.env.NODE_ENV ||
                "development",

            timestamp:
                new Date().toISOString()
        });
    }
);


/* =========================================================
   8. APPLICATION INFORMATION
   ========================================================= */

app.get(
    "/api",
    (req, res) => {

        res.status(200).json({

            success: true,

            name: APP_NAME,

            company:
                "MX-PS Katsina Gold and Precious Stones Trading Company",

            version: APP_VERSION,

            message:
                "MX-PS HUB backend API is running.",

            modules: {

                authentication: "planned",

                kyc: "planned",

                admin: "planned",

                marketplace: "planned",

                wallet: "planned",

                piNetwork: "integration planned",

                sidraChain: "integration planned",

                mxpsToken: "integration planned"

            }
        });
    }
);


/* =========================================================
   9. ROOT ROUTE
   ========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );
    }
);


/* =========================================================
   10. TEST API
   ========================================================= */

app.get(
    "/api/test",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "MX-PS HUB API test successful.",

            timestamp:
                new Date().toISOString()

        });
    }
);


/* =========================================================
   11. 404 HANDLER
   ========================================================= */

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            error: "Route not found",

            path: req.originalUrl

        });
    }
);


/* =========================================================
   12. GLOBAL ERROR HANDLER
   ========================================================= */

app.use(
    (error, req, res, next) => {

        console.error(
            "MX-PS HUB server error:",
            error
        );

        if (res.headersSent) {
            return next(error);
        }

        res.status(500).json({

            success: false,

            error:
                "Internal server error"

        });
    }
);


/* =========================================================
   13. SERVER START
   ========================================================= */

const server =
    app.listen(
        PORT,
        HOST,
        () => {

            console.log(
                "=========================================="
            );

            console.log(
                "        MX-PS HUB BACKEND SERVER"
            );

            console.log(
                "=========================================="
            );

            console.log(
                `Application: ${APP_NAME}`
            );

            console.log(
                `Version: ${APP_VERSION}`
            );

            console.log(
                `Port: ${PORT}`
            );

            console.log(
                `Environment: ${
                    process.env.NODE_ENV ||
                    "development"
                }`
            );

            console.log(
                "Status: ONLINE"
            );

            console.log(
                "=========================================="
            );

        }
    );


/* =========================================================
   14. GRACEFUL SHUTDOWN
   ========================================================= */

function shutdown(signal) {

    console.log(
        `\n${signal} received. Shutting down MX-PS HUB...`
    );

    server.close(
        () => {

            console.log(
                "MX-PS HUB server stopped."
            );

            process.exit(0);
        }
    );
}


process.on(
    "SIGTERM",
    () => shutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => shutdown("SIGINT")
);


/* =========================================================
   END OF SERVER
   ========================================================= */
