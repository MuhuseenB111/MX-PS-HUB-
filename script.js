"use strict";

/*
========================================================
MX-PS HUB — MAIN FRONTEND JAVASCRIPT
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

THIS FILE HANDLES:

- Navigation
- Smooth scrolling
- Active navigation
- Language switching
- Marketplace interactions
- Login
- Registration
- JWT session
- Current user
- Password visibility
- Notifications
- API connection
- Database status
- Accessibility
- Frontend error monitoring

IMPORTANT:
NEVER PUT:
- JWT_SECRET
- Database passwords
- Private API keys
- Private blockchain keys

inside this file.
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

    auth: "/api/auth",

    login: "/api/auth/login",

    register: "/api/auth/register",

    me: "/api/auth/me"

  },

  defaultLanguage: "en",

  supportedLanguages: [
    "en",
    "ha"
  ],

  notificationDuration: 4000,

  tokenStorageKey:
    "mxps_access_token",

  userStorageKey:
    "mxps_user"

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

  authenticated: false,

  user: null,

  token: null,

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
    getElement(
      "#mxps-notification-container"
    );

  if (container) {

    return container;

  }


  container =
    document.createElement("div");


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

      width:
        "min(360px, calc(100% - 40px))",

      pointerEvents: "none"

    }
  );


  document.body.appendChild(
    container
  );


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

      border:
        "1px solid rgba(255,255,255,0.12)",

      background: "#101720",

      color: "#f5f7fa",

      boxShadow:
        "0 15px 40px rgba(0,0,0,0.35)",

      fontSize: "14px",

      fontWeight: "600",

      lineHeight: "1.5",

      pointerEvents: "auto",

      opacity: "0",

      transform:
        "translateY(-10px)",

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


  container.appendChild(
    notification
  );


  requestAnimationFrame(() => {

    notification.style.opacity =
      "1";

    notification.style.transform =
      "translateY(0)";

  });


  setTimeout(() => {

    notification.style.opacity =
      "0";

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
    getElements(
      'a[href^="#"]'
    );


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
    getElements(
      "main section[id]"
    );


  if (
    !navigationLinks.length ||
    !sections.length
  ) {

    return;

  }


  const observer =
    new IntersectionObserver(

      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            const id =
              entry.target.id;


            navigationLinks.forEach(
              (link) => {

                const active =
                  link.getAttribute(
                    "href"
                  ) ===
                  `#${id}`;


                link.style.color =
                  active
                    ? "var(--gold-light)"
                    : "";

              }
            );

          }
        );

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

    marketplace:
      "Marketplace",

    ecosystem:
      "Ecosystem",

    trust:
      "Trust & KYC",

    about:
      "About",

    signIn:
      "Sign In",

    getStarted:
      "Get Started",

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
      "Create Account",

    account:
      "MX-PS HUB Account",

    signInTitle:
      "Access Your MX-PS HUB Account.",

    accountDescription:
      "Create your account or sign in to access the MX-PS HUB ecosystem.",

    existingUser:
      "EXISTING USER",

    newUser:
      "NEW USER",

    emailPhone:
      "Email or Phone",

    password:
      "Password",

    fullName:
      "Full Name",

    email:
      "Email Address",

    phone:
      "Phone Number",

    confirmPassword:
      "Confirm Password",

    rememberMe:
      "Remember me",

    forgotPassword:
      "Forgot password?",

    terms:
      "I agree to the MX-PS HUB Terms and Privacy Policy.",

    signInAccount:
      "Sign In",

    createNewAccount:
      "Create Account"

  },


  ha: {

    home:
      "Gida",

    marketplace:
      "Kasuwar Kayayyaki",

    ecosystem:
      "Tsarin MX-PS",

    trust:
      "Aminci & KYC",

    about:
      "Game da Mu",

    signIn:
      "Shiga",

    getStarted:
      "Fara Yanzu",

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
      "Kirkiri Account",

    account:
      "Asusun MX-PS HUB",

    signInTitle:
      "Shiga Asusunka na MX-PS HUB.",

    accountDescription:
      "Kirkiri account ko shiga domin samun damar amfani da MX-PS HUB.",

    existingUser:
      "MAI AMFANI NA YANZU",

    newUser:
      "SABON MAI AMFANI",

    emailPhone:
      "Email ko Lambar Waya",

    password:
      "Kalmar Sirri",

    fullName:
      "Cikakken Suna",

    email:
      "Adireshin Email",

    phone:
      "Lambar Waya",

    confirmPassword:
      "Tabbatar da Kalmar Sirri",

    rememberMe:
      "A tuna da ni",

    forgotPassword:
      "Ka manta kalmar sirri?",

    terms:
      "Na amince da Ka'idojin MX-PS HUB da Privacy Policy.",

    signInAccount:
      "Shiga",

    createNewAccount:
      "Kirkiri Account"

  }

};


/*
========================================================
LANGUAGE HELPERS
========================================================
*/

function setElementText(
  selector,
  text
) {

  const element =
    getElement(selector);


  if (element) {

    element.textContent =
      text;

  }

}


function applyLanguage(language) {

  if (
    !MXPS_CONFIG.supportedLanguages.includes(
      language
    )
  ) {

    language =
      MXPS_CONFIG.defaultLanguage;

  }


  MXPS_STATE.language =
    language;


  document.documentElement.lang =
    language;


  const t =
    MXPS_TRANSLATIONS[language];


  /*
  ------------------------------------------------------
  MAIN NAVIGATION
  ------------------------------------------------------
  */

  const navLinks =
    getElements(
      ".main-navigation a"
    );


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


  /*
  ------------------------------------------------------
  HEADER BUTTONS
  ------------------------------------------------------
  */

  const headerButtons =
    getElements(
      ".header-actions .button"
    );


  if (headerButtons.length >= 2) {

    headerButtons[0].textContent =
      t.signIn;

    headerButtons[1].textContent =
      t.getStarted;

  }


  /*
  ------------------------------------------------------
  HERO BUTTONS
  ------------------------------------------------------
  */

  const heroButtons =
    getElements(
      ".hero-actions .button"
    );


  if (heroButtons.length >= 2) {

    heroButtons[0].textContent =
      t.exploreMarketplace;

    heroButtons[1].textContent =
      t.exploreEcosystem;

  }


  /*
  ------------------------------------------------------
  MARKETPLACE BUTTONS
  ------------------------------------------------------
  */

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


  /*
  ------------------------------------------------------
  CTA
  ------------------------------------------------------
  */

  const ctaButton =
    getElement(
      ".cta-container .button"
    );


  if (ctaButton) {

    ctaButton.textContent =
      t.createAccount;

  }


  /*
  ------------------------------------------------------
  AUTHENTICATION
  ------------------------------------------------------
  */

  setElementText(
    ".authentication-section .eyebrow",
    t.account
  );


  setElementText(
    ".authentication-section h2",
    t.signInTitle
  );


  setElementText(
    ".authentication-section .section-heading p",
    t.accountDescription
  );


  setElementText(
    ".auth-card:nth-child(1) .auth-label",
    t.existingUser
  );


  setElementText(
    ".auth-card:nth-child(2) .auth-label",
    t.newUser
  );


  setElementText(
    '.auth-card:nth-child(1) h3',
    t.signInAccount
  );


  setElementText(
    '.auth-card:nth-child(2) h3',
    t.createNewAccount
  );


  setElementText(
    'label[for="login-identifier"]',
    t.emailPhone
  );


  setElementText(
    'label[for="login-password"]',
    t.password
  );


  setElementText(
    'label[for="register-full-name"]',
    t.fullName
  );


  setElementText(
    'label[for="register-email"]',
    t.email
  );


  setElementText(
    'label[for="register-phone"]',
    t.phone
  );


  setElementText(
    'label[for="register-password"]',
    t.password
  );


  setElementText(
    'label[for="register-confirm-password"]',
    t.confirmPassword
  );


  setElementText(
    ".auth-options .checkbox-label span",
    t.rememberMe
  );


  setElementText(
    "#forgot-password-button",
    t.forgotPassword
  );


  setElementText(
    ".auth-terms .checkbox-label span",
    t.terms
  );


  const authSubmitButtons =
    getElements(
      ".auth-submit"
    );


  if (authSubmitButtons.length >= 2) {

    authSubmitButtons[0].textContent =
      t.signInAccount;

    authSubmitButtons[1].textContent =
      t.createNewAccount;

  }


  /*
  ------------------------------------------------------
  LANGUAGE BUTTON
  ------------------------------------------------------
  */

  const languageButton =
    getElement(
      ".language-button"
    );


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


  /*
  ------------------------------------------------------
  SAVE LANGUAGE
  ------------------------------------------------------
  */

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


/*
========================================================
INITIALIZE LANGUAGE
========================================================
*/

function initializeLanguage() {

  const languageButton =
    getElement(
      ".language-button"
    );


  if (!languageButton) {

    return;

  }


  let savedLanguage =
    MXPS_CONFIG.defaultLanguage;


  try {

    savedLanguage =
      localStorage.getItem(
        "mxps-language"
      ) ||
      MXPS_CONFIG.defaultLanguage;

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not read language preference."
    );

  }


  applyLanguage(
    savedLanguage
  );


  languageButton.addEventListener(
    "click",
    () => {

      const nextLanguage =
        MXPS_STATE.language === "en"
          ? "ha"
          : "en";


      applyLanguage(
        nextLanguage
      );


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

  const buttons =
    getElements(
      ".market-card-content .button"
    );


  if (!buttons.length) {

    return;

  }


  buttons.forEach(
    (button, index) => {

      button.addEventListener(
        "click",
        () => {

          if (index === 0) {

            showNotification(

              MXPS_STATE.language === "ha"

                ? "Kasuwar zinare tana kan shiri. Za mu haɗa verification da trading APIs a mataki na gaba."

                : "Gold Marketplace is being prepared. Verification and trading APIs will be connected in the next development stage.",

              "warning"

            );


            return;

          }


          if (index === 1) {

            showNotification(

              MXPS_STATE.language === "ha"

                ? "Kasuwar duwatsu masu daraja tana kan shiri."

                : "Precious Stones Marketplace is being prepared.",

              "warning"

            );


            return;

          }


          if (index === 2) {

            const registerSection =
              getElement(
                "#register"
              );


            if (registerSection) {

              registerSection.scrollIntoView({

                behavior:
                  "smooth"

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
API REQUEST HELPER
========================================================
*/

async function apiRequest(
  endpoint,
  options = {}
) {

  const headers = {

    "Accept":
      "application/json",

    ...(options.body
      ? {
          "Content-Type":
            "application/json"
        }
      : {}),

    ...(options.headers || {})

  };


  const response =
    await fetch(

      endpoint,

      {

        ...options,

        headers

      }

    );


  let data =
    null;


  try {

    data =
      await response.json();

  } catch (error) {

    data =
      null;

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
TOKEN STORAGE
========================================================
*/

function saveAuthSession(
  token,
  user
) {

  MXPS_STATE.token =
    token || null;


  MXPS_STATE.user =
    user || null;


  MXPS_STATE.authenticated =
    Boolean(token);


  try {

    if (token) {

      localStorage.setItem(
        MXPS_CONFIG.tokenStorageKey,
        token
      );

    }


    if (user) {

      localStorage.setItem(
        MXPS_CONFIG.userStorageKey,
        JSON.stringify(user)
      );

    }

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not save authentication session."
    );

  }

}


/*
========================================================
LOAD AUTH SESSION
========================================================
*/

function loadAuthSession() {

  try {

    const token =
      localStorage.getItem(
        MXPS_CONFIG.tokenStorageKey
      );


    const storedUser =
      localStorage.getItem(
        MXPS_CONFIG.userStorageKey
      );


    MXPS_STATE.token =
      token || null;


    if (storedUser) {

      try {

        MXPS_STATE.user =
          JSON.parse(
            storedUser
          );

      } catch (error) {

        MXPS_STATE.user =
          null;

      }

    }


    MXPS_STATE.authenticated =
      Boolean(
        MXPS_STATE.token
      );


  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not load authentication session."
    );

  }

}


/*
========================================================
CLEAR AUTH SESSION
========================================================
*/

function clearAuthSession() {

  MXPS_STATE.token =
    null;


  MXPS_STATE.user =
    null;


  MXPS_STATE.authenticated =
    false;


  try {

    localStorage.removeItem(
      MXPS_CONFIG.tokenStorageKey
    );


    localStorage.removeItem(
      MXPS_CONFIG.userStorageKey
    );

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not clear authentication session."
    );

  }

}


/*
========================================================
AUTHORIZED REQUEST
========================================================
*/

async function authenticatedRequest(
  endpoint,
  options = {}
) {

  if (!MXPS_STATE.token) {

    throw new Error(
      "Authentication token is not available."
    );

  }


  return apiRequest(

    endpoint,

    {

      ...options,

      headers: {

        ...(options.headers || {}),

        Authorization:
          `Bearer ${MXPS_STATE.token}`

      }

    }

  );

}


/*
========================================================
LOGIN
========================================================
*/

async function loginUser(
  identifier,
  password
) {

  const data =
    await apiRequest(

      MXPS_CONFIG.endpoints.login,

      {

        method:
          "POST",

        body:
          JSON.stringify({

            identifier:
              identifier,

            password:
              password

          })

      }

    );


  if (
    !data ||
    !data.success ||
    !data.token
  ) {

    throw new Error(
      data?.message ||
      "Login failed."
    );

  }


  saveAuthSession(
    data.token,
    data.user
  );


  return data;

}


/*
========================================================
REGISTER
========================================================
*/

async function registerUser(
  fullName,
  email,
  phone,
  password
) {

  if (!email && !phone) {

    throw new Error(
      MXPS_STATE.language === "ha"

        ? "Email ko lambar waya dole ne."

        : "Email or phone number is required."
    );

  }


  const data =
    await apiRequest(

      MXPS_CONFIG.endpoints.register,

      {

        method:
          "POST",

        body:
          JSON.stringify({

            fullName:
              fullName || null,

            email:
              email || null,

            phone:
              phone || null,

            password:
              password

          })

      }

    );


  if (
    !data ||
    !data.success
  ) {

    throw new Error(
      data?.message ||
      "Registration failed."
    );

  }


  return data;

}


/*
========================================================
GET CURRENT USER
========================================================
*/

async function loadCurrentUser() {

  if (!MXPS_STATE.token) {

    return null;

  }


  try {

    const data =
      await authenticatedRequest(
        MXPS_CONFIG.endpoints.me
      );


    if (
      data &&
      data.success &&
      data.user
    ) {

      MXPS_STATE.user =
        data.user;


      MXPS_STATE.authenticated =
        true;


      try {

        localStorage.setItem(

          MXPS_CONFIG.userStorageKey,

          JSON.stringify(
            data.user
          )

        );

      } catch (error) {

        console.warn(
          "[MX-PS HUB] User profile could not be saved."
        );

      }


      return data.user;

    }


  } catch (error) {

    if (
      error.status === 401 ||
      error.status === 403
    ) {

      clearAuthSession();

    }


    console.warn(
      "[MX-PS HUB] Current user unavailable:",
      error.message
    );

  }


  return null;

}


/*
========================================================
LOGIN FORM
========================================================
*/

function initializeLoginForm() {

  const form =
    getElement(
      "#login-form"
    );


  if (!form) {

    return;

  }


  const statusElement =
    getElement(
      "#login-status"
    );


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const identifier =
        getElement(
          "#login-identifier"
        )?.value.trim();


      const password =
        getElement(
          "#login-password"
        )?.value;


      if (!identifier || !password) {

        const message =
          MXPS_STATE.language === "ha"

            ? "Da fatan ka cika email/lambar waya da kalmar sirri."

            : "Please enter your email/phone and password.";


        if (statusElement) {

          statusElement.textContent =
            message;

        }


        showNotification(
          message,
          "warning"
        );


        return;

      }


      const submitButton =
        form.querySelector(
          ".auth-submit"
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.dataset.originalText =
          submitButton.textContent;

        submitButton.textContent =
          MXPS_STATE.language === "ha"
            ? "Ana shiga..."
            : "Signing in...";

      }


      if (statusElement) {

        statusElement.textContent =
          "";

      }


      try {

        const data =
          await loginUser(
            identifier,
            password
          );


        if (statusElement) {

          statusElement.textContent =
            MXPS_STATE.language === "ha"

              ? "An shiga account cikin nasara."

              : "Login successful.";

        }


        showNotification(

          MXPS_STATE.language === "ha"

            ? "Barka da zuwa MX-PS HUB."

            : "Welcome to MX-PS HUB.",

          "success"

        );


        /*
        ----------------------------------------------
        UPDATE UI
        ----------------------------------------------
        */

        updateAuthenticationUI();


        console.log(
          "[MX-PS HUB] User logged in:",
          data.user
        );


      } catch (error) {

        console.error(
          "[MX-PS HUB] Login failed:",
          error
        );


        const message =
          error.message ||
          (
            MXPS_STATE.language === "ha"

              ? "An kasa shiga account."

              : "Login failed."
          );


        if (statusElement) {

          statusElement.textContent =
            message;

        }


        showNotification(
          message,
          "error"
        );

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;


          submitButton.textContent =
            submitButton.dataset.originalText ||
            (
              MXPS_STATE.language === "ha"
                ? "Shiga"
                : "Sign In"
            );

        }

      }

    }
  );

}


/*
========================================================
REGISTER FORM
========================================================
*/

function initializeRegisterForm() {

  const form =
    getElement(
      "#register-form"
    );


  if (!form) {

    return;

  }


  const statusElement =
    getElement(
      "#register-status"
    );


  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      const fullName =
        getElement(
          "#register-full-name"
        )?.value.trim();


      const email =
        getElement(
          "#register-email"
        )?.value.trim();


      const phone =
        getElement(
          "#register-phone"
        )?.value.trim();


      const password =
        getElement(
          "#register-password"
        )?.value;


      const confirmPassword =
        getElement(
          "#register-confirm-password"
        )?.value;


      const terms =
        getElement(
          "#register-terms"
        )?.checked;


      /*
      ----------------------------------------------
      VALIDATION
      ----------------------------------------------
      */

      if (!fullName) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Da fatan ka saka cikakken suna."

            : "Please enter your full name.",

          "warning"

        );


        return;

      }


      if (!email && !phone) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Saka email ko lambar waya."

            : "Please enter an email or phone number.",

          "warning"

        );


        return;

      }


      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Email ɗin ba daidai ba ne."

            : "Please enter a valid email address.",

          "warning"

        );


        return;

      }


      if (!password) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Saka kalmar sirri."

            : "Please enter a password.",

          "warning"

        );


        return;

      }


      if (password.length < 8) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Kalmar sirri dole ta kasance aƙalla characters 8."

            : "Password must contain at least 8 characters.",

          "warning"

        );


        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Kalmomin sirri ba su yi daidai ba."

            : "Passwords do not match.",

          "error"

        );


        return;

      }


      if (!terms) {

        showNotification(

          MXPS_STATE.language === "ha"

            ? "Dole ne ka amince da Terms da Privacy Policy."

            : "You must agree to the Terms and Privacy Policy.",

          "warning"

        );


        return;

      }


      /*
      ----------------------------------------------
      DISABLE BUTTON
      ----------------------------------------------
      */

      const submitButton =
        form.querySelector(
          ".auth-submit"
        );


      if (submitButton) {

        submitButton.disabled =
          true;


        submitButton.dataset.originalText =
          submitButton.textContent;


        submitButton.textContent =
          MXPS_STATE.language === "ha"

            ? "Ana kirkirar account..."

            : "Creating account...";

      }


      if (statusElement) {

        statusElement.textContent =
          "";

      }


      /*
      ----------------------------------------------
      SEND REQUEST
      ----------------------------------------------
      */

      try {

        const data =
          await registerUser(

            fullName,

            email,

            phone,

            password

          );


        if (statusElement) {

          statusElement.textContent =
            data.message ||
            (
              MXPS_STATE.language === "ha"

                ? "An kirkiri account."

                : "Account created successfully."
            );

        }


        showNotification(

          MXPS_STATE.language === "ha"

            ? "An kirkiri account cikin nasara. Yanzu zaka iya shiga."

            : "Account created successfully. You can now sign in.",

          "success"

        );


        /*
        ----------------------------------------------
        CLEAR PASSWORDS
        ----------------------------------------------
        */

        const passwordInput =
          getElement(
            "#register-password"
          );


        const confirmInput =
          getElement(
            "#register-confirm-password"
          );


        if (passwordInput) {

          passwordInput.value =
            "";

        }


        if (confirmInput) {

          confirmInput.value =
            "";

        }


        /*
        ----------------------------------------------
        MOVE TO LOGIN
        ----------------------------------------------
        */

        setTimeout(() => {

          const loginSection =
            getElement(
              "#login"
            );


          if (loginSection) {

            loginSection.scrollIntoView({

              behavior:
                "smooth",

              block:
                "start"

            });

          }

        }, 600);


      } catch (error) {

        console.error(
          "[MX-PS HUB] Registration failed:",
          error
        );


        const message =
          error.message ||
          (
            MXPS_STATE.language === "ha"

              ? "An kasa kirkirar account."

              : "Registration failed."
          );


        if (statusElement) {

          statusElement.textContent =
            message;

        }


        showNotification(
          message,
          "error"
        );

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;


          submitButton.textContent =
            submitButton.dataset.originalText ||
            (
              MXPS_STATE.language === "ha"

                ? "Kirkiri Account"

                : "Create Account"
            );

        }

      }

    }
  );

}


/*
========================================================
PASSWORD VISIBILITY
========================================================
*/

function initializePasswordToggles() {

  const buttons =
    getElements(
      ".password-toggle"
    );


  buttons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const targetId =
            button.dataset.target;


          if (!targetId) {

            return;

          }


          const input =
            getElement(
              `#${targetId}`
            );


          if (!input) {

            return;

          }


          if (
            input.type ===
            "password"
          ) {

            input.type =
              "text";


            button.textContent =
              MXPS_STATE.language === "ha"
                ? "Boye"
                : "Hide";


            button.setAttribute(
              "aria-label",
              MXPS_STATE.language === "ha"
                ? "Boye kalmar sirri"
                : "Hide password"
            );

          } else {

            input.type =
              "password";


            button.textContent =
              "Show";


            button.setAttribute(
              "aria-label",
              MXPS_STATE.language === "ha"
                ? "Nuna kalmar sirri"
                : "Show password"
            );

          }

        }
      );

    }
  );

}


/*
========================================================
FORGOT PASSWORD
========================================================
*/

function initializeForgotPassword() {

  const button =
    getElement(
      "#forgot-password-button"
    );


  if (!button) {

    return;

  }


  button.addEventListener(
    "click",
    () => {

      showNotification(

        MXPS_STATE.language === "ha"

          ? "Forgot Password system za mu haɗa shi da verification/email service a mataki na gaba."

          : "Password recovery will be connected to the secure verification/email service in a later development stage.",

        "info"

      );

    }
  );

}


/*
========================================================
AUTHENTICATION LINKS
========================================================
*/

function initializeAuthenticationLinks() {

  const loginLinks =
    getElements(
      'a[href="#login"]'
    );


  loginLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const loginSection =
            getElement(
              "#login"
            );


          if (!loginSection) {

            return;

          }


          event.preventDefault();


          loginSection.scrollIntoView({

            behavior:
              "smooth",

            block:
              "start"

          });

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
            getElement(
              "#register"
            );


          if (!registerSection) {

            return;

          }


          event.preventDefault();


          registerSection.scrollIntoView({

            behavior:
              "smooth",

            block:
              "center"

          });

        }
      );

    }
  );

}


/*
========================================================
AUTHENTICATION UI
========================================================
*/

function updateAuthenticationUI() {

  const headerActions =
    getElement(
      ".header-actions"
    );


  if (!headerActions) {

    return;

  }


  /*
  ------------------------------------------------------
  LOGGED IN
  ------------------------------------------------------
  */

  if (
    MXPS_STATE.authenticated &&
    MXPS_STATE.user
  ) {

    const userName =
      MXPS_STATE.user.full_name ||
      MXPS_STATE.user.email ||
      MXPS_STATE.user.phone ||
      "MX-PS User";


    const existingUserBadge =
      getElement(
        "#mxps-user-badge"
      );


    if (!existingUserBadge) {

      const badge =
        document.createElement(
          "span"
        );


      badge.id =
        "mxps-user-badge";


      badge.className =
        "mxps-user-badge";


      badge.textContent =
        userName;


      Object.assign(
        badge.style,
        {

          display:
            "inline-flex",

          alignItems:
            "center",

          padding:
            "8px 12px",

          borderRadius:
            "999px",

          border:
            "1px solid rgba(215,168,79,0.35)",

          color:
            "#f4d38a",

          fontSize:
            "13px",

          fontWeight:
            "700"

        }
      );


      headerActions.prepend(
        badge
      );

    }


    const signIn =
      headerActions.querySelector(
        'a[href="#login"]'
      );


    if (signIn) {

      signIn.textContent =
        MXPS_STATE.language === "ha"
          ? "Account"
          : "Account";

    }


    return;

  }


  /*
  ------------------------------------------------------
  LOGGED OUT
  ------------------------------------------------------
  */

  const badge =
    getElement(
      "#mxps-user-badge"
    );


  if (badge) {

    badge.remove();

  }

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
VISIBILITY HANDLING
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
        link.getAttribute(
          "rel"
        ) || "";


      if (
        !rel.includes(
          "noopener"
        )
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
BUTTON ACCESSIBILITY
========================================================
*/

function initializeButtonAccessibility() {

  const buttons =
    getElements(
      "button"
    );


  buttons.forEach(
    (button) => {

      if (
        !button.hasAttribute(
          "aria-label"
        ) &&
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

        event.error ||
        event.message

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

  if (
    MXPS_STATE.initialized
  ) {

    return;

  }


  initializeWelcomeMessage();


  /*
  ------------------------------------------------------
  BASIC FRONTEND
  ------------------------------------------------------
  */

  initializeSmoothNavigation();

  initializeHeaderScroll();

  initializeActiveNavigation();

  initializeLanguage();


  /*
  ------------------------------------------------------
  MARKETPLACE
  ------------------------------------------------------
  */

  initializeMarketplace();


  /*
  ------------------------------------------------------
  AUTHENTICATION
  ------------------------------------------------------
  */

  initializeAuthenticationLinks();

  initializeLoginForm();

  initializeRegisterForm();

  initializePasswordToggles();

  initializeForgotPassword();


  /*
  ------------------------------------------------------
  ACCESSIBILITY / SECURITY
  ------------------------------------------------------
  */

  initializeVisibilityHandling();

  initializeExternalLinks();

  initializeButtonAccessibility();

  initializeErrorMonitoring();


  /*
  ------------------------------------------------------
  LOAD EXISTING SESSION
  ------------------------------------------------------
  */

  loadAuthSession();


  /*
  ------------------------------------------------------
  UPDATE AUTH UI
  ------------------------------------------------------
  */

  updateAuthenticationUI();


  /*
  ------------------------------------------------------
  MARK INITIALIZED
  ------------------------------------------------------
  */

  MXPS_STATE.initialized =
    true;


  /*
  ------------------------------------------------------
  BACKEND CHECK
  ------------------------------------------------------
  */

  await initializeBackendStatus();


  /*
  ------------------------------------------------------
  VERIFY EXISTING SESSION
  ------------------------------------------------------
  */

  if (
    MXPS_STATE.token
  ) {

    await loadCurrentUser();

    updateAuthenticationUI();

  }


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
    checkDatabaseConnection,

  login:
    loginUser,

  register:
    registerUser,

  currentUser:
    loadCurrentUser,

  logout:
    clearAuthSession

};


/*
========================================================
END OF MX-PS HUB SCRIPT
========================================================
*/
