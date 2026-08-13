/* =========================================================
   MX-PS HUB — GLOBAL JAVASCRIPT
   MX-PS Katsina Gold & Precious Stones Trading Company
   Web3 Gold & Precious Stones Ecosystem
   ========================================================= */

"use strict";

/* =========================================================
   APP CONFIGURATION
   ========================================================= */

const MXPS_CONFIG = {
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
  }
};


/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log(
    `${MXPS_CONFIG.appName} v${MXPS_CONFIG.version} initialized.`
  );

  initializeNavigation();
  initializeButtons();
  initializeScrollEffects();
  initializeYear();

});


/* =========================================================
   MOBILE / MAIN NAVIGATION
   ========================================================= */

function initializeNavigation() {

  const menuButton =
    document.querySelector("[data-menu-toggle]");

  const navigation =
    document.querySelector("[data-navigation]");

  if (!menuButton || !navigation) {
    return;
  }

  menuButton.addEventListener("click", () => {

    navigation.classList.toggle("is-open");

    const isOpen =
      navigation.classList.contains("is-open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });

}


/* =========================================================
   BUTTON SYSTEM
   ========================================================= */

function initializeButtons() {

  const buttons =
    document.querySelectorAll("[data-action]");

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      const action =
        button.dataset.action;

      handleAction(action);

    });

  });

}


/* =========================================================
   ACTION HANDLER
   ========================================================= */

function handleAction(action) {

  switch (action) {

    case "connect-wallet":
      showComingSoon("Wallet connection");
      break;

    case "start-kyc":
      showComingSoon("KYC verification");
      break;

    case "pi":
      showComingSoon("Pi Network integration");
      break;

    case "sidra":
      showComingSoon("Sidra Chain integration");
      break;

    case "mxps-token":
      showComingSoon("MX-PS Token integration");
      break;

    default:
      console.log(
        `MX-PS action: ${action || "undefined"}`
      );

  }

}


/* =========================================================
   COMING SOON SYSTEM
   ========================================================= */

function showComingSoon(feature) {

  console.info(
    `${feature} module is planned for the next development stage.`
  );

  /*
    Important:

    Ba mu haɗa Pi SDK,
    Sidra Chain,
    wallet,
    KYC backend,
    ko token contract a wannan matakin.

    Za mu haɗa su ne bayan frontend architecture
    ya tsaya lafiya.
  */

}


/* =========================================================
   SCROLL EFFECTS
   ========================================================= */

function initializeScrollEffects() {

  const header =
    document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  window.addEventListener(
    "scroll",
    () => {

      if (window.scrollY > 30) {

        header.classList.add("is-scrolled");

      } else {

        header.classList.remove("is-scrolled");

      }

    },
    { passive: true }
  );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

function initializeYear() {

  const yearElements =
    document.querySelectorAll("[data-current-year]");

  const currentYear =
    new Date().getFullYear();

  yearElements.forEach((element) => {

    element.textContent =
      currentYear;

  });

}


/* =========================================================
   GLOBAL APP STATE
   ========================================================= */

window.MXPS = {

  config: MXPS_CONFIG,

  getStatus() {

    return {
      app: MXPS_CONFIG.appName,
      version: MXPS_CONFIG.version,
      piReady: MXPS_CONFIG.ecosystems.pi,
      sidraReady: MXPS_CONFIG.ecosystems.sidra,
      mxpsTokenReady:
        MXPS_CONFIG.ecosystems.mxpsToken,
      kycRequired:
        MXPS_CONFIG.security.kycRequired,
      adminApprovalRequired:
        MXPS_CONFIG.security.adminApprovalRequired
    };

  }

};


/* =========================================================
   END OF MX-PS HUB JAVASCRIPT
   ========================================================= */
