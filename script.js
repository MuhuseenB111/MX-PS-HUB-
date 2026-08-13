/* =========================================================
   MX-PS HUB
   MX-PS Katsina Gold & Precious Stones Trading Company
   Global Web3 Gold & Precious Stones Ecosystem
   ---------------------------------------------------------
   FRONTEND APPLICATION LOGIC
   Version: 1.0.0
   ========================================================= */

"use strict";

/* =========================================================
   1. APPLICATION CONFIGURATION
   ========================================================= */

const MXPS_CONFIG = Object.freeze({
    appName: "MX-PS HUB",
    companyName: "MX-PS Katsina Gold and Precious Stones Trading Company",
    version: "1.0.0",

    ecosystems: {
        pi: true,
        sidra: true,
        mxpsToken: true
    },

    security: {
        kycRequired: true,
        adminApprovalRequired: true
    },

    environment: "development"
});


/* =========================================================
   2. GLOBAL APPLICATION STATE
   ========================================================= */

const MXPS_STATE = {
    initialized: false,

    user: {
        connected: false,
        authenticated: false,
        kycStatus: "not_started",
        walletConnected: false
    },

    ui: {
        mobileMenuOpen: false,
        activeSection: "home",
        modalOpen: false
    },

    network: {
        pi: "not_connected",
        sidra: "not_connected"
    }
};


/* =========================================================
   3. DOM HELPERS
   ========================================================= */

const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
};

const $$ = (selector, parent = document) => {
    return Array.from(parent.querySelectorAll(selector));
};

const byId = (id) => {
    return document.getElementById(id);
};


/* =========================================================
   4. SAFE EVENT LISTENER
   ========================================================= */

function on(element, event, handler, options = {}) {
    if (!element) return;

    element.addEventListener(event, handler, options);
}


/* =========================================================
   5. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    try {
        initializeMXPS();

    } catch (error) {

        console.error(
            "MX-PS HUB initialization error:",
            error
        );

        showToast(
            "MX-PS HUB encountered an initialization issue.",
            "error"
        );
    }
});


/* =========================================================
   6. MAIN INITIALIZATION
   ========================================================= */

function initializeMXPS() {

    if (MXPS_STATE.initialized) {
        return;
    }

    setupNavigation();
    setupMobileMenu();
    setupScrollEffects();
    setupSmoothScrolling();
    setupButtons();
    setupForms();
    setupModals();
    setupNetworkButtons();
    setupCounters();
    setupRevealAnimations();
    updateCurrentYear();
    updateApplicationStatus();

    MXPS_STATE.initialized = true;

    console.info(
        `${MXPS_CONFIG.appName} v${MXPS_CONFIG.version} initialized successfully.`
    );
}


/* =========================================================
   7. NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navLinks = $$(
        'nav a[href^="#"], header a[href^="#"], .nav-link[href^="#"]'
    );

    navLinks.forEach((link) => {

        on(link, "click", () => {

            const target = link.getAttribute("href");

            if (!target || target === "#") {
                return;
            }

            MXPS_STATE.ui.activeSection =
                target.replace("#", "");
        });
    });
}


/* =========================================================
   8. MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

    const menuButton =
        byId("menu-toggle") ||
        byId("mobile-menu-toggle") ||
        $(".menu-toggle") ||
        $(".mobile-menu-toggle");

    const mobileMenu =
        byId("mobile-menu") ||
        $(".mobile-menu") ||
        $(".nav-menu");

    if (!menuButton || !mobileMenu) {
        return;
    }

    on(menuButton, "click", () => {

        MXPS_STATE.ui.mobileMenuOpen =
            !MXPS_STATE.ui.mobileMenuOpen;

        mobileMenu.classList.toggle(
            "active",
            MXPS_STATE.ui.mobileMenuOpen
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(MXPS_STATE.ui.mobileMenuOpen)
        );
    });


    $$(".mobile-menu a, .nav-menu a").forEach((link) => {

        on(link, "click", () => {

            MXPS_STATE.ui.mobileMenuOpen = false;

            mobileMenu.classList.remove("active");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
}


/* =========================================================
   9. SMOOTH SCROLLING
   ========================================================= */

function setupSmoothScrolling() {

    $$('a[href^="#"]').forEach((link) => {

        on(link, "click", (event) => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#" ||
                targetId.length < 2
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            history.replaceState(
                null,
                "",
                targetId
            );
        });
    });
}


/* =========================================================
   10. HEADER SCROLL EFFECT
   ========================================================= */

function setupScrollEffects() {

    const header =
        $("header") ||
        $(".header") ||
        $(".site-header");

    if (!header) {
        return;
    }

    const updateHeader = () => {

        if (window.scrollY > 40) {
            header.classList.add("scrolled");

        } else {
            header.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );
}


/* =========================================================
   11. BUTTON HANDLERS
   ========================================================= */

function setupButtons() {

    $$("button").forEach((button) => {

        on(button, "click", () => {

            const action =
                button.dataset.action;

            if (!action) {
                return;
            }

            handleAction(action, button);
        });
    });


    $$("[data-action]").forEach((element) => {

        on(element, "click", () => {

            const action =
                element.dataset.action;

            handleAction(action, element);
        });
    });
}


/* =========================================================
   12. APPLICATION ACTION ROUTER
   ========================================================= */

function handleAction(action, element) {

    switch (action) {

        case "connect-pi":
            connectPi();
            break;

        case "connect-sidra":
            connectSidra();
            break;

        case "open-dashboard":
            openDashboard();
            break;

        case "start-kyc":
            startKYC();
            break;

        case "view-marketplace":
            scrollToSection("marketplace");
            break;

        case "view-assets":
            scrollToSection("assets");
            break;

        case "contact":
            scrollToSection("contact");
            break;

        case "learn-more":
            scrollToSection("about");
            break;

        default:

            console.info(
                "MX-PS action:",
                action,
                element
            );
    }
}


/* =========================================================
   13. PI NETWORK CONNECTION PLACEHOLDER
   ========================================================= */

function connectPi() {

    /*
       IMPORTANT:

       Real Pi SDK integration will be implemented
       in the dedicated integration layer.

       NEVER place Pi private keys, secrets,
       backend credentials or admin credentials
       inside this frontend file.
    */

    if (!MXPS_CONFIG.ecosystems.pi) {

        showToast(
            "Pi integration is currently disabled.",
            "warning"
        );

        return;
    }

    MXPS_STATE.network.pi = "pending";

    showToast(
        "Pi Network connection will be activated through the official Pi SDK integration.",
        "info"
    );

    console.info(
        "Pi SDK integration pending."
    );
}


/* =========================================================
   14. SIDRA CONNECTION PLACEHOLDER
   ========================================================= */

function connectSidra() {

    if (!MXPS_CONFIG.ecosystems.sidra) {

        showToast(
            "Sidra integration is currently disabled.",
            "warning"
        );

        return;
    }

    MXPS_STATE.network.sidra = "pending";

    showToast(
        "Sidra Chain connection will be activated through the secure integration layer.",
        "info"
    );

    console.info(
        "Sidra integration pending."
    );
}


/* =========================================================
   15. DASHBOARD
   ========================================================= */

function openDashboard() {

    const dashboard =
        byId("dashboard") ||
        $("#dashboard");

    if (dashboard) {

        dashboard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        return;
    }

    showToast(
        "The MX-PS dashboard module is being prepared.",
        "info"
    );
}


/* =========================================================
   16. KYC
   ========================================================= */

function startKYC() {

    if (!MXPS_CONFIG.security.kycRequired) {

        showToast(
            "KYC is not currently required.",
            "info"
        );

        return;
    }

    MXPS_STATE.user.kycStatus = "pending";

    showToast(
        "KYC onboarding will be handled through the secure backend.",
        "info"
    );

    console.info(
        "KYC onboarding requested."
    );
}


/* =========================================================
   17. SECTION SCROLL
   ========================================================= */

function scrollToSection(sectionId) {

    const section =
        byId(sectionId) ||
        document.querySelector(
            `#${sectionId}`
        );

    if (!section) {

        showToast(
            `Section "${sectionId}" is not available yet.`,
            "warning"
        );

        return;
    }

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    MXPS_STATE.ui.activeSection =
        sectionId;
}


/* =========================================================
   18. FORM HANDLING
   ========================================================= */

function setupForms() {

    $$("form").forEach((form) => {

        on(form, "submit", (event) => {

            event.preventDefault();

            handleFormSubmission(form);
        });
    });
}


function handleFormSubmission(form) {

    const formData =
        new FormData(form);

    const values = {};

    formData.forEach((value, key) => {

        values[key] =
            typeof value === "string"
                ? value.trim()
                : value;
    });

    console.info(
        "MX-PS form submission:",
        values
    );

    showToast(
        "Your request has been received. Backend processing will be connected in the next stage.",
        "success"
    );

    form.reset();
}


/* =========================================================
   19. MODAL SYSTEM
   ========================================================= */

function setupModals() {

    const modal =
        byId("mxps-modal") ||
        $(".mxps-modal") ||
        $(".modal");

    if (!modal) {
        return;
    }

    const closeButtons =
        $$(
            "[data-close-modal], .modal-close, .close-modal",
            modal
        );

    closeButtons.forEach((button) => {

        on(button, "click", () => {

            closeModal(modal);
        });
    });


    on(modal, "click", (event) => {

        if (event.target === modal) {
            closeModal(modal);
        }
    });
}


function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    MXPS_STATE.ui.modalOpen = true;
}


function closeModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    MXPS_STATE.ui.modalOpen = false;
}


/* =========================================================
   20. NETWORK STATUS
   ========================================================= */

function updateApplicationStatus() {

    const statusElements =
        $$("[data-mxps-status]");

    statusElements.forEach((element) => {

        element.textContent =
            "MX-PS HUB Online";
    });
}


function getNetworkStatus() {

    return {
        pi: MXPS_STATE.network.pi,
        sidra: MXPS_STATE.network.sidra
    };
}


/* =========================================================
   21. COUNTER ANIMATIONS
   ========================================================= */

function setupCounters() {

    const counters =
        $$("[data-counter]");

    if (!counters.length) {
        return;
    }

    counters.forEach((counter) => {

        const target =
            Number(
                counter.dataset.counter
            );

        if (
            Number.isNaN(target) ||
            target < 0
        ) {
            return;
        }

        animateCounter(
            counter,
            target
        );
    });
}


function animateCounter(
    element,
    target
) {

    const duration = 1200;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const value =
            Math.floor(
                start +
                (target - start) *
                eased
            );

        element.textContent =
            value.toLocaleString();

        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        } else {

            element.textContent =
                target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}


/* =========================================================
   22. SCROLL REVEAL ANIMATIONS
   ========================================================= */

function setupRevealAnimations() {

    const elements =
        $$(
            ".reveal, .fade-in, .slide-up, [data-reveal]"
        );

    if (!elements.length) {
        return;
    }

    if (
        !("IntersectionObserver" in window)
    ) {

        elements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (entries, obs) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add(
                        "visible"
                    );

                    obs.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12
            }
        );

    elements.forEach((element) => {
        observer.observe(element);
    });
}


/* =========================================================
   23. CURRENT YEAR
   ========================================================= */

function updateCurrentYear() {

    const year =
        new Date().getFullYear();

    $$(
        "[data-current-year]"
    ).forEach((element) => {

        element.textContent =
            String(year);
    });
}


/* =========================================================
   24. TOAST NOTIFICATION SYSTEM
   ========================================================= */

function showToast(
    message,
    type = "info"
) {

    let container =
        byId("mxps-toast-container");

    if (!container) {

        container =
            document.createElement("div");

        container.id =
            "mxps-toast-container";

        Object.assign(
            container.style,
            {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: "99999",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "360px",
                width: "calc(100% - 40px)"
            }
        );

        document.body.appendChild(
            container
        );
    }


    const toast =
        document.createElement("div");

    toast.className =
        `mxps-toast mxps-toast-${type}`;

    Object.assign(
        toast.style,
        {
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#101720",
            color: "#f5f7fa",
            border: "1px solid rgba(215,168,79,.35)",
            boxShadow: "0 12px 35px rgba(0,0,0,.35)",
            fontSize: "14px",
            lineHeight: "1.5",
            cursor: "pointer"
        }
    );

    toast.textContent =
        message;

    container.appendChild(
        toast
    );


    on(toast, "click", () => {

        toast.remove();
    });


    setTimeout(() => {

        if (toast.parentNode) {
            toast.remove();
        }

    }, 5000);
}


/* =========================================================
   25. KEYBOARD ACCESSIBILITY
   ========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            MXPS_STATE.ui.modalOpen
        ) {

            const modal =
                $(".mxps-modal.active") ||
                $(".modal.active");

            if (modal) {
                closeModal(modal);
            }
        }
    }
);


/* =========================================================
   26. ONLINE / OFFLINE STATUS
   ========================================================= */

window.addEventListener(
    "online",
    () => {

        showToast(
            "Internet connection restored.",
            "success"
        );
    }
);


window.addEventListener(
    "offline",
    () => {

        showToast(
            "You are currently offline.",
            "warning"
        );
    }
);


/* =========================================================
   27. GLOBAL MX-PS API
   ========================================================= */

window.MXPS = {

    config: MXPS_CONFIG,

    state: MXPS_STATE,

    getStatus() {

        return {

            app:
                MXPS_CONFIG.appName,

            version:
                MXPS_CONFIG.version,

            environment:
                MXPS_CONFIG.environment,

            piReady:
                MXPS_CONFIG.ecosystems.pi,

            sidraReady:
                MXPS_CONFIG.ecosystems.sidra,

            mxpsTokenReady:
                MXPS_CONFIG.ecosystems.mxpsToken,

            kycRequired:
                MXPS_CONFIG.security.kycRequired,

            adminApprovalRequired:
                MXPS_CONFIG.security.adminApprovalRequired
        };
    },

    getNetworkStatus,

    showToast,

    scrollToSection,

    connectPi,

    connectSidra,

    startKYC,

    openDashboard
};


/* =========================================================
   28. SECURITY NOTE
   ========================================================= */

/*
   NEVER store any of the following inside this frontend file:

   - Pi private keys
   - Pi secret keys
   - Sidra private keys
   - Database passwords
   - Admin passwords
   - JWT secrets
   - Backend API secrets
   - User KYC documents
   - Payment credentials

   These will be handled securely by the backend.
*/


/* =========================================================
   END OF MX-PS HUB JAVASCRIPT
   ========================================================= */
