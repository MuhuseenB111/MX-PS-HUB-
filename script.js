"use strict";

/*
========================================================
MX-PS HUB — MAIN FRONTEND JAVASCRIPT
MX-PS Katsina Gold & Precious Stones Trading Company
========================================================

PURPOSE
- Navigation
- Language system
- Login
- Registration
- Logout
- JWT session
- User profile
- Password visibility
- Marketplace interactions
- API connection
- Database status
- Notifications
- Accessibility
- Error monitoring

IMPORTANT
- NEVER put JWT_SECRET in frontend code.
- NEVER put database passwords here.
- NEVER put private API keys here.
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

    health:
      "/api/health",

    database:
      "/api/database/health",

    auth:
      "/api/auth",

    login:
      "/api/auth/login",

    register:
      "/api/auth/register",

    me:
      "/api/auth/me"

  },

  defaultLanguage: "en",

  supportedLanguages: [
    "en",
    "ha"
  ],

  tokenStorageKey:
    "mxps_access_token",

  languageStorageKey:
    "mxps_language",

  userStorageKey:
    "mxps_user",

  notificationDuration:
    4000

};


/*
========================================================
APPLICATION STATE
========================================================
*/

const MXPS_STATE = {

  language:
    MXPS_CONFIG.defaultLanguage,

  apiOnline:
    false,

  databaseOnline:
    false,

  authenticated:
    false,

  user:
    null,

  initialized:
    false

};


/*
========================================================
DOM HELPERS
========================================================
*/

function getElement(selector) {

  return document.querySelector(
    selector
  );

}


function getElements(selector) {

  return document.querySelectorAll(
    selector
  );

}


/*
========================================================
SAFE TEXT HELPER
========================================================
*/

function setTextIfExists(
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
    document.createElement(
      "div"
    );

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

      pointerEvents:
        "none"

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
    document.createElement(
      "div"
    );

  notification.className =
    `mxps-notification mxps-notification-${type}`;

  notification.textContent =
    message;

  Object.assign(
    notification.style,
    {

      padding:
        "14px 17px",

      borderRadius:
        "12px",

      border:
        "1px solid rgba(255,255,255,0.12)",

      background:
        "#101720",

      color:
        "#f5f7fa",

      boxShadow:
        "0 15px 40px rgba(0,0,0,0.35)",

      fontSize:
        "14px",

      fontWeight:
        "600",

      lineHeight:
        "1.5",

      pointerEvents:
        "auto",

      opacity:
        "0",

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

  requestAnimationFrame(
    () => {

      notification.style.opacity =
        "1";

      notification.style.transform =
        "translateY(0)";

    }
  );

  setTimeout(
    () => {

      notification.style.opacity =
        "0";

      notification.style.transform =
        "translateY(-10px)";

      setTimeout(
        () => {

          notification.remove();

        },
        300
      );

    },
    MXPS_CONFIG.notificationDuration
  );

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

  links.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          const targetId =
            link.getAttribute(
              "href"
            );

          if (
            !targetId ||
            targetId === "#"
          ) {

            return;

          }

          const target =
            getElement(
              targetId
            );

          if (!target) {

            return;

          }

          event.preventDefault();

          target.scrollIntoView(
            {
              behavior:
                "smooth",

              block:
                "start"
            }
          );

          try {

            history.replaceState(
              null,
              "",
              targetId
            );

          } catch (error) {

            console.warn(
              "[MX-PS HUB] History update unavailable."
            );

          }

        }
      );

    }
  );

}


/*
========================================================
HEADER SCROLL EFFECT
========================================================
*/

function initializeHeaderScroll() {

  const header =
    getElement(
      ".site-header"
    );

  if (!header) {

    return;

  }

  function updateHeader() {

    if (
      window.scrollY > 20
    ) {

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
      passive:
        true
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

  if (
    typeof IntersectionObserver ===
    "undefined"
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

        threshold:
          0

      }
    );

  sections.forEach(
    (section) => {

      observer.observe(
        section
      );

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

    home:
      "Home",

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

    login:
      "Login",

    register:
      "Register",

    email:
      "Email",

    phone:
      "Phone",

    password:
      "Password",

    fullName:
      "Full Name",

    confirmPassword:
      "Confirm Password",

    submit:
      "Submit",

    logout:
      "Logout"

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

    login:
      "Shiga Account",

    register:
      "Kirkiri Account",

    email:
      "Email",

    phone:
      "Lambar Waya",

    password:
      "Kalmar Sirri",

    fullName:
      "Cikakken Suna",

    confirmPassword:
      "Tabbatar da Kalmar Sirri",

    submit:
      "Tura",

    logout:
      "Fita"

  }

};


function applyLanguage(
  language
) {

  if (
    !MXPS_CONFIG.supportedLanguages
      .includes(language)
  ) {

    language =
      MXPS_CONFIG.defaultLanguage;

  }

  MXPS_STATE.language =
    language;

  document.documentElement.lang =
    language;

  const t =
    MXPS_TRANSLATIONS[
      language
    ];

  const navLinks =
    getElements(
      ".main-navigation a"
    );

  if (
    navLinks.length >= 5
  ) {

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
    getElements(
      ".header-actions .button"
    );

  if (
    headerButtons.length >= 2
  ) {

    headerButtons[0].textContent =
      t.signIn;

    headerButtons[1].textContent =
      t.getStarted;

  }

  const heroButtons =
    getElements(
      ".hero-actions .button"
    );

  if (
    heroButtons.length >= 2
  ) {

    heroButtons[0].textContent =
      t.exploreMarketplace;

    heroButtons[1].textContent =
      t.exploreEcosystem;

  }

  const marketButtons =
    getElements(
      ".market-card-content .button"
    );

  if (
    marketButtons.length >= 3
  ) {

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

  try {

    localStorage.setItem(
      MXPS_CONFIG.languageStorageKey,
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
    getElement(
      ".language-button"
    );

  let savedLanguage =
    MXPS_CONFIG.defaultLanguage;

  try {

    savedLanguage =
      localStorage.getItem(
        MXPS_CONFIG.languageStorageKey
      ) ||
      MXPS_CONFIG.defaultLanguage;

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Language preference unavailable."
    );

  }

  applyLanguage(
    savedLanguage
  );

  if (!languageButton) {

    return;

  }

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
PASSWORD VISIBILITY
========================================================
*/

function initializePasswordVisibility() {

  const buttons =
    getElements(
      "[data-password-toggle]"
    );

  buttons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const targetSelector =
            button.getAttribute(
              "data-password-toggle"
            );

          if (!targetSelector) {

            return;

          }

          const input =
            getElement(
              targetSelector
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
              "Hide";

          } else {

            input.type =
              "password";

            button.textContent =
              "Show";

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

  const requestOptions = {

    ...options,

    headers: {

      "Accept":
        "application/json",

      ...(options.body
        ? {
            "Content-Type":
              "application/json"
          }
        : {}),

      ...(options.headers || {})

    }

  };

  const token =
    getAccessToken();

  if (token) {

    requestOptions.headers.Authorization =
      `Bearer ${token}`;

  }

  const response =
    await fetch(
      endpoint,
      requestOptions
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
TOKEN MANAGEMENT
========================================================
*/

function getAccessToken() {

  try {

    return localStorage.getItem(
      MXPS_CONFIG.tokenStorageKey
    );

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not access token storage."
    );

    return null;

  }

}


function saveAccessToken(
  token
) {

  if (!token) {

    return false;

  }

  try {

    localStorage.setItem(
      MXPS_CONFIG.tokenStorageKey,
      token
    );

    return true;

  } catch (error) {

    console.error(
      "[MX-PS HUB] Token could not be saved."
    );

    return false;

  }

}


function removeAccessToken() {

  try {

    localStorage.removeItem(
      MXPS_CONFIG.tokenStorageKey
    );

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Token could not be removed."
    );

  }

}


function saveUser(
  user
) {

  MXPS_STATE.user =
    user || null;

  try {

    if (user) {

      localStorage.setItem(
        MXPS_CONFIG.userStorageKey,
        JSON.stringify(user)
      );

    } else {

      localStorage.removeItem(
        MXPS_CONFIG.userStorageKey
      );

    }

  } catch (error) {

    console.warn(
      "[MX-PS HUB] User session could not be saved."
    );

  }

}


function getStoredUser() {

  try {

    const stored =
      localStorage.getItem(
        MXPS_CONFIG.userStorageKey
      );

    if (!stored) {

      return null;

    }

    return JSON.parse(
      stored
    );

  } catch (error) {

    return null;

  }

}


/*
========================================================
AUTH SESSION
========================================================
*/

async function loadCurrentUser() {

  const token =
    getAccessToken();

  if (!token) {

    MXPS_STATE.authenticated =
      false;

    MXPS_STATE.user =
      null;

    return null;

  }

  try {

    const data =
      await apiRequest(
        MXPS_CONFIG.endpoints.me
      );

    if (
      data &&
      data.success &&
      data.user
    ) {

      MXPS_STATE.authenticated =
        true;

      saveUser(
        data.user
      );

      updateAuthenticationUI();

      return data.user;

    }

  } catch (error) {

    if (
      error.status === 401 ||
      error.status === 403
    ) {

      logout(
        false
      );

    } else {

      const storedUser =
        getStoredUser();

      if (storedUser) {

        MXPS_STATE.user =
          storedUser;

        MXPS_STATE.authenticated =
          true;

        updateAuthenticationUI();

      }

    }

  }

  return null;

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

  if (
    !identifier ||
    !password
  ) {

    throw new Error(
      "Email/phone and password are required."
    );

  }

  const data =
    await apiRequest(
      MXPS_CONFIG.endpoints.login,
      {

        method:
          "POST",

        body:
          JSON.stringify(
            {
              identifier:
                String(
                  identifier
                ).trim(),

              password:
                String(
                  password
                )

            }
          )

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

  saveAccessToken(
    data.token
  );

  saveUser(
    data.user
  );

  MXPS_STATE.authenticated =
    true;

  updateAuthenticationUI();

  return data;

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

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const identifierInput =
        form.querySelector(
          '[name="identifier"], [name="email"], #login-identifier'
        );

      const passwordInput =
        form.querySelector(
          '[name="password"], #login-password'
        );

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      const identifier =
        identifierInput
          ? identifierInput.value.trim()
          : "";

      const password =
        passwordInput
          ? passwordInput.value
          : "";

      if (
        !identifier ||
        !password
      ) {

        showNotification(
          "Please enter your login details.",
          "warning"
        );

        return;

      }

      const originalText =
        submitButton
          ? submitButton.textContent
          : "";

      try {

        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.textContent =
            "Signing in...";

        }

        await loginUser(
          identifier,
          password
        );

        showNotification(
          MXPS_STATE.language === "ha"
            ? "An shiga MX-PS HUB cikin nasara."
            : "You have signed in successfully.",
          "success"
        );

        form.reset();

        setTimeout(
          () => {

            updateAuthenticationUI();

          },
          300
        );

      } catch (error) {

        console.error(
          "[MX-PS HUB] Login failed:",
          error
        );

        showNotification(
          error.message ||
          "Login failed.",
          "error"
        );

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            originalText ||
            "Sign In";

        }

      }

    }
  );

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

  if (!password) {

    throw new Error(
      "Password is required."
    );

  }

  if (
    password.length <
    8
  ) {

    throw new Error(
      "Password must contain at least 8 characters."
    );

  }

  if (
    !email &&
    !phone
  ) {

    throw new Error(
      "Email or phone number is required."
    );

  }

  const data =
    await apiRequest(
      MXPS_CONFIG.endpoints.register,
      {

        method:
          "POST",

        body:
          JSON.stringify(
            {

              fullName:
                fullName
                  ? String(
                      fullName
                    ).trim()
                  : "",

              email:
                email
                  ? String(
                      email
                    ).trim()
                  : "",

              phone:
                phone
                  ? String(
                      phone
                    ).trim()
                  : "",

              password:
                password

            }
          )

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

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const fullNameInput =
        form.querySelector(
          '[name="fullName"], #full-name'
        );

      const emailInput =
        form.querySelector(
          '[name="email"], #register-email'
        );

      const phoneInput =
        form.querySelector(
          '[name="phone"], #register-phone'
        );

      const passwordInput =
        form.querySelector(
          '[name="password"], #register-password'
        );

      const confirmPasswordInput =
        form.querySelector(
          '[name="confirmPassword"], #confirm-password'
        );

      const termsInput =
        form.querySelector(
          '[name="terms"], #terms'
        );

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      const fullName =
        fullNameInput
          ? fullNameInput.value.trim()
          : "";

      const email =
        emailInput
          ? emailInput.value.trim()
          : "";

      const phone =
        phoneInput
          ? phoneInput.value.trim()
          : "";

      const password =
        passwordInput
          ? passwordInput.value
          : "";

      const confirmPassword =
        confirmPasswordInput
          ? confirmPasswordInput.value
          : "";

      if (
        password.length <
        8
      ) {

        showNotification(
          "Password must contain at least 8 characters.",
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

      if (
        !email &&
        !phone
      ) {

        showNotification(
          MXPS_STATE.language === "ha"
            ? "Saka email ko lambar waya."
            : "Please provide an email or phone number.",
          "warning"
        );

        return;

      }

      if (
        termsInput &&
        !termsInput.checked
      ) {

        showNotification(
          MXPS_STATE.language === "ha"
            ? "Dole ne ka amince da Terms."
            : "You must accept the Terms.",
          "warning"
        );

        return;

      }

      const originalText =
        submitButton
          ? submitButton.textContent
          : "";

      try {

        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.textContent =
            "Creating account...";

        }

        await registerUser(
          fullName,
          email,
          phone,
          password
        );

        showNotification(
          MXPS_STATE.language === "ha"
            ? "An kirkiri account cikin nasara."
            : "Account created successfully.",
          "success"
        );

        form.reset();

      } catch (error) {

        console.error(
          "[MX-PS HUB] Registration failed:",
          error
        );

        showNotification(
          error.message ||
          "Registration failed.",
          "error"
        );

      } finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            originalText ||
            "Create Account";

        }

      }

    }
  );

}


/*
========================================================
LOGOUT
========================================================
*/

function logout(
  showMessage = true
) {

  removeAccessToken();

  saveUser(
    null
  );

  MXPS_STATE.authenticated =
    false;

  MXPS_STATE.user =
    null;

  updateAuthenticationUI();

  if (showMessage) {

    showNotification(
      MXPS_STATE.language === "ha"
        ? "An fita daga account."
        : "You have been signed out.",
      "success"
    );

  }

}


/*
========================================================
AUTHENTICATION UI
========================================================
*/

function updateAuthenticationUI() {

  const signInLinks =
    getElements(
      'a[href="#login"]'
    );

  const registerLinks =
    getElements(
      'a[href="#register"]'
    );

  if (
    MXPS_STATE.authenticated
  ) {

    signInLinks.forEach(
      (link) => {

        link.textContent =
          MXPS_STATE.user?.full_name ||
          "Account";

      }
    );

    registerLinks.forEach(
      (link) => {

        link.textContent =
          "Account";

      }
    );

  } else {

    const t =
      MXPS_TRANSLATIONS[
        MXPS_STATE.language
      ];

    signInLinks.forEach(
      (link) => {

        link.textContent =
          t.signIn;

      }
    );

    registerLinks.forEach(
      (link) => {

        link.textContent =
          t.createAccount;

      }
    );

  }

}


/*
========================================================
AUTHENTICATION LINKS
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

          const loginSection =
            getElement(
              "#login"
            );

          if (!loginSection) {

            showNotification(
              MXPS_STATE.language === "ha"
                ? "Login section ba ta samuwa yanzu."
                : "Login section is not available yet.",
              "info"
            );

            return;

          }

          event.preventDefault();

          loginSection.scrollIntoView(
            {
              behavior:
                "smooth",

              block:
                "center"
            }
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
            getElement(
              "#register"
            );

          if (!registerSection) {

            return;

          }

          event.preventDefault();

          registerSection.scrollIntoView(
            {
              behavior:
                "smooth",

              block:
                "center"
            }
          );

        }
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

  buttons.forEach(
    (button, index) => {

      button.addEventListener(
        "click",
        () => {

          if (index === 0) {

            showNotification(
              MXPS_STATE.language === "ha"
                ? "Kasuwar zinare tana kan shiri."
                : "Gold Marketplace is being prepared.",
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

            if (
              registerSection
            ) {

              registerSection.scrollIntoView(
                {
                  behavior:
                    "smooth",

                  block:
                    "center"
                }
              );

            }

          }

        }
      );

    }
  );

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
      "[MX-PS HUB] Frontend running without backend connection."
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

  initializeSmoothNavigation();

  initializeHeaderScroll();

  initializeActiveNavigation();

  initializeLanguage();

  initializePasswordVisibility();

  initializeLoginForm();

  initializeRegisterForm();

  initializeMarketplace();

  initializeAuthenticationLinks();

  initializeVisibilityHandling();

  initializeExternalLinks();

  initializeButtonAccessibility();

  initializeErrorMonitoring();

  MXPS_STATE.initialized =
    true;

  /*
  ----------------------------------------------------
  BACKEND
  ----------------------------------------------------
  */

  await initializeBackendStatus();

  /*
  ----------------------------------------------------
  CURRENT SESSION
  ----------------------------------------------------
  */

  await loadCurrentUser();

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

  login:
    loginUser,

  register:
    registerUser,

  logout:
    logout,

  currentUser:
    loadCurrentUser,

  getToken:
    getAccessToken,

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
