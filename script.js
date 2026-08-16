"use strict";

/*
========================================================
MX-PS HUB — MAIN FRONTEND JAVASCRIPT
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

PURPOSE:
- Navigation
- Smooth scrolling
- Language selector
- Marketplace interactions
- API status checking
- Backend connection
- Notifications
- Basic accessibility
- Safe frontend initialization

IMPORTANT:
This file does NOT contain private secrets.
Do not put JWT secrets, database passwords or API keys here.
========================================================
*/


/*
========================================================
APPLICATION CONFIGURATION
========================================================
*/

const MXPS_CONFIG = {
  apiBase: "/api",

  endpoints: {
    api: "/api",
    health: "/api/health",
    database: "/api/database/health",
    auth: "/api/auth"
  },

  defaultLanguage: "en",

  supportedLanguages: [
    "en",
    "ha"
  ],

  notificationDuration: 4000
};


/*
========================================================
APPLICATION STATE
========================================================
*/

const MXPS_STATE = {
  language: "en",

  apiOnline: false,

  databaseOnline: false,

  initialized: false
};


/*
========================================================
DOM HELPERS
========================================================
*/

function getElement(selector) {
  return document.querySelector(selector);
}


function getElements(selector) {
  return document.querySelectorAll(selector);
}


/*
========================================================
NOTIFICATION SYSTEM
========================================================
*/

function createNotificationContainer() {

  let container =
    getElement("#mxps-notification-container");

  if (container) {
    return container;
  }

  container = document.createElement("div");

  container.id =
    "mxps-notification-container";

  container.setAttribute(
    "aria-live",
    "polite"
  );

  container.setAttribute(
    "aria-atomic",
    "true"
  );

  Object.assign(
    container.style,
    {
      position: "fixed",
      top: "90px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "min(360px, calc(100% - 40px))",
      pointerEvents: "none"
    }
  );

  document.body.appendChild(container);

  return container;
}


function showNotification(
  message,
  type = "info"
) {

  const container =
    createNotificationContainer();

  const notification =
    document.createElement("div");

  notification.className =
    `mxps-notification mxps-notification-${type}`;

  notification.textContent =
    message;

  Object.assign(
    notification.style,
    {
      padding: "14px 17px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.12)",
      background: "#101720",
      color: "#f5f7fa",
      boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
      fontSize: "14px",
      fontWeight: "600",
      lineHeight: "1.5",
      pointerEvents: "auto",
      opacity: "0",
      transform: "translateY(-10px)",
      transition:
        "opacity 0.25s ease, transform 0.25s ease"
    }
  );

  if (type === "success") {
    notification.style.borderColor =
      "rgba(74,222,128,0.45)";
  }

  if (type === "error") {
    notification.style.borderColor =
      "rgba(239,68,68,0.45)";
  }

  if (type === "warning") {
    notification.style.borderColor =
      "rgba(215,168,79,0.55)";
  }

  container.appendChild(notification);

  requestAnimationFrame(() => {

    notification.style.opacity = "1";

    notification.style.transform =
      "translateY(0)";

  });

  setTimeout(() => {

    notification.style.opacity = "0";

    notification.style.transform =
      "translateY(-10px)";

    setTimeout(() => {

      notification.remove();

    }, 300);

  }, MXPS_CONFIG.notificationDuration);
}


/*
========================================================
SMOOTH NAVIGATION
========================================================
*/

function initializeSmoothNavigation() {

  const links =
    getElements('a[href^="#"]');

  links.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }

        const target =
          getElement(targetId);

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

      }
    );

  });
}


/*
========================================================
HEADER SCROLL EFFECT
========================================================
*/

function initializeHeaderScroll() {

  const header =
    getElement(".site-header");

  if (!header) {
    return;
  }

  function updateHeader() {

    if (window.scrollY > 20) {

      header.style.background =
        "rgba(7, 10, 15, 0.96)";

    } else {

      header.style.background =
        "rgba(7, 10, 15, 0.88)";

    }

  }

  window.addEventListener(
    "scroll",
    updateHeader,
    {
      passive: true
    }
  );

  updateHeader();
}


/*
========================================================
ACTIVE NAVIGATION
========================================================
*/

function initializeActiveNavigation() {

  const navigationLinks =
    getElements(
      '.main-navigation a[href^="#"]'
    );

  const sections =
    getElements("main section[id]");

  if (
    !navigationLinks.length ||
    !sections.length
  ) {
    return;
  }

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          const id =
            entry.target.id;

          navigationLinks.forEach(
            (link) => {

              const active =
                link.getAttribute("href") ===
                `#${id}`;

              link.style.color =
                active
                  ? "var(--gold-light)"
                  : "";

            }
          );

        });

      },
      {
        rootMargin:
          "-30% 0px -60% 0px",
        threshold: 0
      }
    );

  sections.forEach(
    (section) => {
      observer.observe(section);
    }
  );
}


/*
========================================================
LANGUAGE SYSTEM
========================================================
*/

const MXPS_TRANSLATIONS = {

  en: {

    home: "Home",
    marketplace: "Marketplace",
    ecosystem: "Ecosystem",
    trust: "Trust & KYC",
    about: "About",

    signIn: "Sign In",
    getStarted: "Get Started",

    exploreMarketplace:
      "Explore Marketplace",

    exploreEcosystem:
      "Explore Ecosystem",

    viewGold:
      "View Gold",

    viewStones:
      "View Stones",

    becomeSeller:
      "Become a Seller",

    createAccount:
      "Create Account"

  },

  ha: {

    home: "Gida",
    marketplace: "Kasuwar Kayayyaki",
    ecosystem: "Tsarin MX-PS",
    trust: "Aminci & KYC",
    about: "Game da Mu",

    signIn: "Shiga",
    getStarted: "Fara Yanzu",

    exploreMarketplace:
      "Duba Kasuwa",

    exploreEcosystem:
      "Duba Tsarin MX-PS",

    viewGold:
      "Duba Zinare",

    viewStones:
      "Duba Duwatsu",

    becomeSeller:
      "Zama Mai Sayarwa",

    createAccount:
      "Kirkiri Account"

  }

};


function setTextIfExists(
  selector,
  text
) {

  const element =
    getElement(selector);

  if (element) {
    element.textContent = text;
  }
}


function applyLanguage(language) {

  if (
    !MXPS_CONFIG.supportedLanguages
      .includes(language)
  ) {
    language = "en";
  }

  MXPS_STATE.language =
    language;

  document.documentElement.lang =
    language;

  const t =
    MXPS_TRANSLATIONS[language];

  const navLinks =
    getElements(".main-navigation a");

  if (navLinks.length >= 5) {

    navLinks[0].textContent =
      t.home;

    navLinks[1].textContent =
      t.marketplace;

    navLinks[2].textContent =
      t.ecosystem;

    navLinks[3].textContent =
      t.trust;

    navLinks[4].textContent =
      t.about;

  }

  const headerButtons =
    getElements(".header-actions .button");

  if (headerButtons.length >= 2) {

    headerButtons[0].textContent =
      t.signIn;

    headerButtons[1].textContent =
      t.getStarted;

  }

  const heroButtons =
    getElements(".hero-actions .button");

  if (heroButtons.length >= 2) {

    heroButtons[0].textContent =
      t.exploreMarketplace;

    heroButtons[1].textContent =
      t.exploreEcosystem;

  }

  const marketButtons =
    getElements(
      ".market-card-content .button"
    );

  if (marketButtons.length >= 3) {

    marketButtons[0].textContent =
      t.viewGold;

    marketButtons[1].textContent =
      t.viewStones;

    marketButtons[2].textContent =
      t.becomeSeller;

  }

  const ctaButton =
    getElement(
      ".cta-container .button"
    );

  if (ctaButton) {
    ctaButton.textContent =
      t.createAccount;
  }

  const languageButton =
    getElement(".language-button");

  if (languageButton) {

    languageButton.textContent =
      language.toUpperCase();

    languageButton.setAttribute(
      "aria-label",
      language === "en"
        ? "Switch language to Hausa"
        : "Switch language to English"
    );

  }

  try {

    localStorage.setItem(
      "mxps-language",
      language
    );

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Language preference could not be saved."
    );

  }
}


function initializeLanguage() {

  const languageButton =
    getElement(".language-button");

  if (!languageButton) {
    return;
  }

  let savedLanguage = "en";

  try {

    savedLanguage =
      localStorage.getItem(
        "mxps-language"
      ) || "en";

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not read language preference."
    );

  }

  applyLanguage(savedLanguage);

  languageButton.addEventListener(
    "click",
    () => {

      const nextLanguage =
        MXPS_STATE.language === "en"
          ? "ha"
          : "en";

      applyLanguage(nextLanguage);

      showNotification(
        nextLanguage === "ha"
          ? "An canza harshen zuwa Hausa."
          : "Language changed to English.",
        "success"
      );

    }
  );
}


/*
========================================================
MARKETPLACE ACTIONS
========================================================
*/

function initializeMarketplace() {

  const marketCards =
    getElements(".market-card");

  if (!marketCards.length) {
    return;
  }

  const buttons =
    getElements(
      ".market-card-content .button"
    );

  buttons.forEach(
    (button, index) => {

      button.addEventListener(
        "click",
        () => {

          if (index === 0) {

            showNotification(
              "Gold Marketplace is being prepared. Asset verification and trading APIs will be connected in the next development stage.",
              "warning"
            );

            return;
          }

          if (index === 1) {

            showNotification(
              "Precious Stones Marketplace is being prepared. Verified asset services will be connected later.",
              "warning"
            );

            return;
          }

          if (index === 2) {

            const registerSection =
              getElement("#register");

            if (registerSection) {

              registerSection.scrollIntoView({
                behavior: "smooth"
              });

            }

          }

        }
      );

    }
  );
}


/*
========================================================
AUTHENTICATION BUTTONS
========================================================
*/

function initializeAuthenticationLinks() {

  const signInLinks =
    getElements(
      'a[href="#login"]'
    );

  signInLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          showNotification(
            "Sign In system zai haɗu da /api/auth a matakin authentication na gaba.",
            "info"
          );

        }
      );

    }
  );


  const registerLinks =
    getElements(
      'a[href="#register"]'
    );

  registerLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const registerSection =
            getElement("#register");

          if (!registerSection) {
            return;
          }

          event.preventDefault();

          registerSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }
      );

    }
  );
}


/*
========================================================
API REQUEST HELPER
========================================================
*/

async function apiRequest(
  endpoint,
  options = {}
) {

  const response =
    await fetch(
      endpoint,
      {
        ...options,

        headers: {
          "Accept":
            "application/json",

          "Content-Type":
            "application/json",

          ...(options.headers || {})
        }
      }
    );

  let data = null;

  try {

    data =
      await response.json();

  } catch (error) {

    data = null;

  }

  if (!response.ok) {

    const error =
      new Error(
        data?.message ||
        `API request failed with status ${response.status}`
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}


/*
========================================================
API CONNECTION CHECK
========================================================
*/

async function checkApiConnection() {

  try {

    const data =
      await apiRequest(
        MXPS_CONFIG.endpoints.api
      );

    if (
      data &&
      data.success === true
    ) {

      MXPS_STATE.apiOnline =
        true;

      console.log(
        "[MX-PS HUB] API connection: ONLINE"
      );

      return true;
    }

  } catch (error) {

    MXPS_STATE.apiOnline =
      false;

    console.warn(
      "[MX-PS HUB] API connection unavailable:",
      error.message
    );

  }

  return false;
}


/*
========================================================
DATABASE CONNECTION CHECK
========================================================
*/

async function checkDatabaseConnection() {

  try {

    const data =
      await apiRequest(
        MXPS_CONFIG.endpoints.database
      );

    if (
      data &&
      (
        data.success === true ||
        data.connected === true
      )
    ) {

      MXPS_STATE.databaseOnline =
        true;

      console.log(
        "[MX-PS HUB] Database connection: ONLINE"
      );

      return true;
    }

  } catch (error) {

    MXPS_STATE.databaseOnline =
      false;

    console.warn(
      "[MX-PS HUB] Database health check unavailable:",
      error.message
    );

  }

  return false;
}


/*
========================================================
BACKEND STATUS
========================================================
*/

async function initializeBackendStatus() {

  const apiOnline =
    await checkApiConnection();

  if (!apiOnline) {

    console.info(
      "[MX-PS HUB] Frontend is running without backend connection."
    );

    return;
  }

  await checkDatabaseConnection();

}


/*
========================================================
PAGE VISIBILITY
========================================================
*/

function initializeVisibilityHandling() {

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        console.log(
          "[MX-PS HUB] Application active."
        );

      }

    }
  );
}


/*
========================================================
EXTERNAL LINK PROTECTION
========================================================
*/

function initializeExternalLinks() {

  const links =
    getElements(
      'a[target="_blank"]'
    );

  links.forEach(
    (link) => {

      const rel =
        link.getAttribute("rel") || "";

      if (
        !rel.includes("noopener")
      ) {

        link.setAttribute(
          "rel",
          `${rel} noopener noreferrer`.trim()
        );

      }

    }
  );
}


/*
========================================================
BUTTON KEYBOARD ACCESSIBILITY
========================================================
*/

function initializeButtonAccessibility() {

  const buttons =
    getElements("button");

  buttons.forEach(
    (button) => {

      if (
        !button.hasAttribute("aria-label") &&
        button.textContent.trim()
      ) {

        button.setAttribute(
          "aria-label",
          button.textContent.trim()
        );

      }

    }
  );
}


/*
========================================================
ERROR MONITORING
========================================================
*/

function initializeErrorMonitoring() {

  window.addEventListener(
    "error",
    (event) => {

      console.error(
        "[MX-PS HUB] Frontend error:",
        event.error || event.message
      );

    }
  );


  window.addEventListener(
    "unhandledrejection",
    (event) => {

      console.error(
        "[MX-PS HUB] Unhandled frontend promise:",
        event.reason
      );

    }
  );
}


/*
========================================================
WELCOME MESSAGE
========================================================
*/

function initializeWelcomeMessage() {

  console.log(
    "================================================"
  );

  console.log(
    "MX-PS HUB — FRONTEND INITIALIZED"
  );

  console.log(
    "MX-PS Katsina Gold & Precious Stones Trading Company"
  );

  console.log(
    "Where Gold Meets Blockchain."
  );

  console.log(
    "================================================"
  );
}


/*
========================================================
APPLICATION INITIALIZATION
========================================================
*/

async function initializeMXPSHub() {

  if (MXPS_STATE.initialized) {
    return;
  }

  initializeWelcomeMessage();

  initializeSmoothNavigation();

  initializeHeaderScroll();

  initializeActiveNavigation();

  initializeLanguage();

  initializeMarketplace();

  initializeAuthenticationLinks();

  initializeVisibilityHandling();

  initializeExternalLinks();

  initializeButtonAccessibility();

  initializeErrorMonitoring();

  MXPS_STATE.initialized =
    true;

  /*
  ----------------------------------------------
  BACKEND CHECK
  ----------------------------------------------
  */

  await initializeBackendStatus();

  console.log(
    "[MX-PS HUB] Initialization complete."
  );
}


/*
========================================================
START APPLICATION
========================================================
*/

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeMXPSHub
  );

} else {

  initializeMXPSHub();

}


/*
========================================================
PUBLIC MX-PS API
========================================================
*/

window.MXPS = {

  config:
    MXPS_CONFIG,

  state:
    MXPS_STATE,

  notify:
    showNotification,

  setLanguage:
    applyLanguage,

  checkAPI:
    checkApiConnection,

  checkDatabase:
    checkDatabaseConnection

};


/*
========================================================
END OF SCRIPT
========================================================
*/
