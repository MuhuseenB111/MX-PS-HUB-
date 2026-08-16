"use strict";

/*
========================================================
MX-PS HUB — GLOBAL FRONTEND JAVASCRIPT
========================================================
MX-PS Katsina Gold & Precious Stones Trading Company

GLOBAL FEATURES:
- Multi-language system
- English
- Hausa
- French
- Arabic
- Spanish
- Chinese
- Language persistence
- Navigation
- Smooth scrolling
- Marketplace interactions
- API connection
- Database status
- Authentication hooks
- Notifications
- Accessibility
- Error monitoring
- Mobile-friendly behavior

IMPORTANT:
Never put private secrets, database passwords,
JWT secrets or private API keys in this file.
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
    "ha",
    "fr",
    "ar",
    "es",
    "zh"
  ],

  notificationDuration: 4000

};


/*
========================================================
APPLICATION STATE
========================================================
*/

const MXPS_STATE = {

  language:
    MXPS_CONFIG.defaultLanguage,

  apiOnline: false,

  databaseOnline: false,

  initialized: false

};


/*
========================================================
LANGUAGE INFORMATION
========================================================
*/

const MXPS_LANGUAGES = {

  en: {
    name: "English",
    nativeName: "English",
    direction: "ltr",
    flag: "🇬🇧"
  },

  ha: {
    name: "Hausa",
    nativeName: "Hausa",
    direction: "ltr",
    flag: "🇳🇬"
  },

  fr: {
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    flag: "🇫🇷"
  },

  ar: {
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    flag: "🇸🇦"
  },

  es: {
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    flag: "🇪🇸"
  },

  zh: {
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
    flag: "🇨🇳"
  }

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
SAFE TEXT HELPER
========================================================
*/

function setText(selector, text) {

  const element =
    getElement(selector);

  if (element) {

    element.textContent =
      text;

  }

}


function setTexts(selector, texts) {

  const elements =
    getElements(selector);

  elements.forEach(
    (element, index) => {

      if (
        texts[index] !== undefined
      ) {

        element.textContent =
          texts[index];

      }

    }
  );

}


/*
========================================================
NOTIFICATION CONTAINER
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

      zIndex: "99999",

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


/*
========================================================
NOTIFICATION SYSTEM
========================================================
*/

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
        "opacity .25s ease, transform .25s ease"

    }
  );


  if (type === "success") {

    notification.style.borderColor =
      "rgba(74,222,128,.45)";

  }


  if (type === "error") {

    notification.style.borderColor =
      "rgba(239,68,68,.45)";

  }


  if (type === "warning") {

    notification.style.borderColor =
      "rgba(215,168,79,.55)";

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
GLOBAL TRANSLATIONS
========================================================
*/

const MXPS_TRANSLATIONS = {

  /*
  ======================================================
  ENGLISH
  ======================================================
  */

  en: {

    nav: [
      "Home",
      "Marketplace",
      "Ecosystem",
      "Trust & KYC",
      "About"
    ],

    signIn:
      "Sign In",

    getStarted:
      "Get Started",

    heroEyebrow:
      "GLOBAL WEB3 GOLD & PRECIOUS STONES ECOSYSTEM",

    heroTitle:
      "Where Gold Meets",

    heroTitleSpan:
      "Blockchain.",

    heroDescription:
      "MX-PS HUB is building a trusted digital ecosystem for gold and precious-stones trading — connecting verified people, secure transactions, blockchain technology and global markets.",

    exploreMarketplace:
      "Explore Marketplace",

    exploreEcosystem:
      "Explore Ecosystem",

    secure:
      "Secure",

    secureText:
      "Built with security in mind",

    kyc:
      "KYC",

    kycText:
      "Verified participants",

    web3:
      "Web3",

    web3Text:
      "Blockchain-ready ecosystem",

    ecosystemEyebrow:
      "THE MX-PS ECOSYSTEM",

    ecosystemTitle:
      "One Platform. Multiple Possibilities.",

    ecosystemDescription:
      "A secure foundation designed to connect real-world gold and precious-stones commerce with modern Web3 infrastructure.",

    goldMarketplace:
      "Gold Marketplace",

    goldMarketplaceText:
      "Discover, list and trade verified gold through a structured digital marketplace.",

    exploreGold:
      "Explore Gold →",

    preciousStones:
      "Precious Stones",

    preciousStonesText:
      "A trusted environment for discovering and trading precious stones with detailed asset information.",

    exploreStones:
      "Explore Stones →",

    trustKyc:
      "KYC & Trust",

    trustKycText:
      "Verified users, trusted sellers and controlled access designed for a global marketplace.",

    learnTrust:
      "Learn About Trust →",

    blockchainReady:
      "Blockchain Ready",

    blockchainReadyText:
      "Designed to support blockchain-based traceability, digital assets and secure transactions.",

    exploreBlockchain:
      "Explore Blockchain →",

    marketplaceEyebrow:
      "GLOBAL MARKETPLACE",

    marketplaceTitle:
      "Trade With Greater Confidence.",

    marketplaceDescription:
      "A future-ready marketplace connecting verified buyers, sellers, miners and traders.",

    verifiedAsset:
      "VERIFIED ASSET",

    gold:
      "Gold",

    goldText:
      "Verified gold assets with structured information and transaction records.",

    viewGold:
      "View Gold",

    stones:
      "Precious Stones",

    stonesText:
      "Explore verified precious stones with detailed asset information.",

    viewStones:
      "View Stones",

    verifiedSellers:
      "VERIFIED SELLERS",

    sellAssets:
      "Sell Your Assets",

    sellAssetsText:
      "Verified sellers will be able to list eligible gold and precious-stones assets.",

    becomeSeller:
      "Become a Seller",

    trustEyebrow:
      "TRUST & SECURITY",

    trustTitle:
      "Built Around Verification.",

    trustDescription:
      "MX-PS HUB is designed around identity, verification, security and responsible participation.",

    createAccount:
      "Create Account",

    completeKyc:
      "Complete KYC",

    submitVerification:
      "Submit the required verification information.",

    adminReview:
      "Admin Review",

    adminReviewText:
      "Authorized administrators review verification before full platform access.",

    participate:
      "Participate",

    participateText:
      "Approved users can access the features available to their account role.",

    blockchainEyebrow:
      "WEB3 INFRASTRUCTURE",

    blockchainTitle:
      "Connecting Real-World Assets With Digital Infrastructure.",

    blockchainDescription:
      "MX-PS HUB is designed with dedicated integration layers for supported blockchain ecosystems.",

    ecosystem:
      "ECOSYSTEM",

    piNetwork:
      "Pi Network",

    piText:
      "Dedicated architecture for official Pi authentication, payments and supported developer integrations.",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "A separate integration layer designed for supported Sidra Chain services and assets.",

    mxpsEcosystem:
      "MX-PS ECOSYSTEM",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "Dedicated infrastructure for the MX-PS Token and its future ecosystem utilities.",

    integrationReady:
      "Integration Layer Ready",

    architecturePlanned:
      "Architecture Planned",

    aboutEyebrow:
      "ABOUT MX-PS",

    aboutTitle:
      "Building a New Standard for Gold & Precious-Stones Commerce.",

    aboutText1:
      "MX-PS Katsina Gold and Precious Stones Trading Company is building a technology-driven ecosystem designed to make gold and precious-stones commerce more accessible, transparent, secure and globally connected.",

    aboutText2:
      "MX-PS HUB is the digital foundation of this vision, bringing together trusted participants, marketplace infrastructure, verification, digital asset traceability and Web3 technologies.",

    ourVision:
      "OUR VISION",

    vision:
      "Secure. Transparent. Global.",

    visionText:
      "Where Gold Meets Blockchain.",

    joinEyebrow:
      "JOIN THE ECOSYSTEM",

    joinTitle:
      "Be Part of the Future of Digital Gold Commerce.",

    joinText:
      "Create your MX-PS HUB account and prepare to participate in a trusted global ecosystem.",

    platform:
      "Platform",

    company:
      "Company",

    legal:
      "Legal",

    aboutMxps:
      "About MX-PS",

    joinUs:
      "Join Us",

    privacy:
      "Privacy",

    terms:
      "Terms",

    footerDescription:
      "A Web3 ecosystem for gold and precious-stones commerce.",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. All rights reserved.",

    footerTagline:
      "MX-PS HUB — Where Gold Meets Blockchain."

  },


  /*
  ======================================================
  HAUSA
  ======================================================
  */

  ha: {

    nav: [
      "Gida",
      "Kasuwar Kayayyaki",
      "Tsarin MX-PS",
      "Aminci & KYC",
      "Game da Mu"
    ],

    signIn:
      "Shiga",

    getStarted:
      "Fara Yanzu",

    heroEyebrow:
      "TSARIN WEB3 NA DUNIYA NA ZINARE DA DUWATSU MASU DARaja",

    heroTitle:
      "Inda Zinare Ya Haɗu da",

    heroTitleSpan:
      "Blockchain.",

    heroDescription:
      "MX-PS HUB yana gina amintaccen tsarin dijital na kasuwancin zinare da duwatsu masu daraja, wanda ke haɗa mutane da aka tantance, amintattun mu'amaloli, fasahar blockchain da kasuwannin duniya.",

    exploreMarketplace:
      "Duba Kasuwa",

    exploreEcosystem:
      "Duba Tsarin MX-PS",

    secure:
      "Tsaro",

    secureText:
      "An gina shi da kula da tsaro",

    kyc:
      "KYC",

    kycText:
      "Masu amfani da aka tantance",

    web3:
      "Web3",

    web3Text:
      "Tsarin da aka shirya da Blockchain",

    ecosystemEyebrow:
      "TSARIN MX-PS",

    ecosystemTitle:
      "Dandali Ɗaya. Dama Masu Yawa.",

    ecosystemDescription:
      "Tsayayyen tushe da aka tsara domin haɗa kasuwancin zinare da duwatsu masu daraja na zahiri da fasahar Web3 ta zamani.",

    goldMarketplace:
      "Kasuwar Zinare",

    goldMarketplaceText:
      "Gano, saka da kasuwanci da ingantaccen zinare ta hanyar kasuwar dijital.",

    exploreGold:
      "Duba Zinare →",

    preciousStones:
      "Duwatsu Masu Daraja",

    preciousStonesText:
      "Wuri amintacce domin gano da kasuwanci da duwatsu masu daraja tare da cikakken bayani.",

    exploreStones:
      "Duba Duwatsu →",

    trustKyc:
      "KYC & Aminci",

    trustKycText:
      "Masu amfani da aka tantance, masu sayarwa amintattu da tsarin shiga da aka sarrafa.",

    learnTrust:
      "Kara Sanin Aminci →",

    blockchainReady:
      "An Shirya Blockchain",

    blockchainReadyText:
      "An tsara shi domin bin diddigin kayayyaki ta Blockchain, kadarorin dijital da amintattun mu'amaloli.",

    exploreBlockchain:
      "Duba Blockchain →",

    marketplaceEyebrow:
      "KASUWAR DUNIYA",

    marketplaceTitle:
      "Yi Kasuwanci Cikin Ƙarin Aminci.",

    marketplaceDescription:
      "Kasuwar zamani da ke haɗa masu saye, masu sayarwa, masu hakar ma'adinai da 'yan kasuwa da aka tantance.",

    verifiedAsset:
      "KADARAR DA AKA TANTANCE",

    gold:
      "Zinare",

    goldText:
      "Ingantaccen zinare tare da cikakken bayani da bayanan mu'amala.",

    viewGold:
      "Duba Zinare",

    stones:
      "Duwatsu Masu Daraja",

    stonesText:
      "Duba duwatsu masu daraja da aka tantance tare da cikakken bayani.",

    viewStones:
      "Duba Duwatsu",

    verifiedSellers:
      "MASU SAYARWA DA AKA TANTANCE",

    sellAssets:
      "Sayar da Kayanka",

    sellAssetsText:
      "Masu sayarwa da aka tantance za su iya saka zinare da duwatsu masu daraja da suka cancanta.",

    becomeSeller:
      "Zama Mai Sayarwa",

    trustEyebrow:
      "AMINCI & TSARO",

    trustTitle:
      "An Gina Tsarin Ne Bisa Tantancewa.",

    trustDescription:
      "MX-PS HUB an tsara shi ne bisa tantance mutum, tsaro da amfani da dandali cikin gaskiya.",

    createAccount:
      "Ƙirƙiri Account",

    completeKyc:
      "Kammala KYC",

    submitVerification:
      "Tura bayanan da ake buƙata domin tantancewa.",

    adminReview:
      "Binciken Admin",

    adminReviewText:
      "Masu kula da tsarin da aka ba izini za su binciki bayanan kafin a ba da cikakken damar shiga.",

    participate:
      "Shiga Tsarin",

    participateText:
      "Masu amfani da aka amince da su za su iya amfani da abubuwan da matsayinsu ya ba su dama.",

    blockchainEyebrow:
      "TSARIN WEB3",

    blockchainTitle:
      "Haɗa Kadarorin Zahiri da Tsarin Dijital.",

    blockchainDescription:
      "MX-PS HUB an tsara shi da tsarin haɗin kai na musamman domin blockchain ecosystems da ake tallafawa.",

    ecosystem:
      "TSARIN",

    piNetwork:
      "Pi Network",

    piText:
      "Tsarin da aka tanada domin ingantaccen Pi authentication, payments da developer integrations.",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "Tsarin haɗin kai na musamman domin ayyuka da kadarorin Sidra Chain da ake tallafawa.",

    mxpsEcosystem:
      "TSARIN MX-PS",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "Tsarin da aka tanada domin MX-PS Token da ayyukansa na gaba.",

    integrationReady:
      "An Shirya Integration",

    architecturePlanned:
      "An Shirya Tsarin Architecture",

    aboutEyebrow:
      "GAME DA MX-PS",

    aboutTitle:
      "Gina Sabon Matsayi a Kasuwancin Zinare da Duwatsu Masu Daraja.",

    aboutText1:
      "MX-PS Katsina Gold and Precious Stones Trading Company yana gina tsarin fasaha domin sanya kasuwancin zinare da duwatsu masu daraja ya zama mai sauƙi, bayyananne, amintacce kuma haɗe da duniya.",

    aboutText2:
      "MX-PS HUB shi ne tushen dijital na wannan buri, yana haɗa masu amfani amintattu, kasuwa, tantancewa, bin diddigin kadarorin dijital da fasahar Web3.",

    ourVision:
      "BURINMU",

    vision:
      "Amintacce. Bayyananne. Na Duniya.",

    visionText:
      "Inda Zinare Ya Haɗu da Blockchain.",

    joinEyebrow:
      "SHIGA TSARIN",

    joinTitle:
      "Kasance cikin Makomar Kasuwancin Zinare na Dijital.",

    joinText:
      "Ƙirƙiri MX-PS HUB account ɗinka kuma ka shirya shiga cikin amintaccen tsarin duniya.",

    platform:
      "Dandali",

    company:
      "Kamfani",

    legal:
      "Doka",

    aboutMxps:
      "Game da MX-PS",

    joinUs:
      "Shiga Mu",

    privacy:
      "Sirri",

    terms:
      "Sharuɗɗa",

    footerDescription:
      "Tsarin Web3 na kasuwancin zinare da duwatsu masu daraja.",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. An kiyaye dukkan haƙƙoƙi.",

    footerTagline:
      "MX-PS HUB — Inda Zinare Ya Haɗu da Blockchain."

  },


  /*
  ======================================================
  FRENCH
  ======================================================
  */

  fr: {

    nav: [
      "Accueil",
      "Marché",
      "Écosystème",
      "Confiance & KYC",
      "À propos"
    ],

    signIn:
      "Connexion",

    getStarted:
      "Commencer",

    heroEyebrow:
      "ÉCOSYSTÈME WEB3 MONDIAL POUR L'OR ET LES PIERRES PRÉCIEUSES",

    heroTitle:
      "Là où l'or rencontre",

    heroTitleSpan:
      "la Blockchain.",

    heroDescription:
      "MX-PS HUB construit un écosystème numérique fiable pour le commerce de l'or et des pierres précieuses, reliant des participants vérifiés, des transactions sécurisées, la blockchain et les marchés mondiaux.",

    exploreMarketplace:
      "Explorer le marché",

    exploreEcosystem:
      "Explorer l'écosystème",

    secure:
      "Sécurisé",

    secureText:
      "Conçu avec la sécurité à l'esprit",

    kyc:
      "KYC",

    kycText:
      "Participants vérifiés",

    web3:
      "Web3",

    web3Text:
      "Écosystème prêt pour la blockchain",

    ecosystemEyebrow:
      "L'ÉCOSYSTÈME MX-PS",

    ecosystemTitle:
      "Une plateforme. Plusieurs possibilités.",

    ecosystemDescription:
      "Une base sécurisée conçue pour connecter le commerce réel de l'or et des pierres précieuses aux infrastructures Web3 modernes.",

    goldMarketplace:
      "Marché de l'or",

    goldMarketplaceText:
      "Découvrez, référencez et échangez de l'or vérifié sur un marché numérique structuré.",

    exploreGold:
      "Explorer l'or →",

    preciousStones:
      "Pierres précieuses",

    preciousStonesText:
      "Un environnement fiable pour découvrir et échanger des pierres précieuses avec des informations détaillées.",

    exploreStones:
      "Explorer les pierres →",

    trustKyc:
      "KYC & Confiance",

    trustKycText:
      "Utilisateurs vérifiés, vendeurs fiables et accès contrôlé pour un marché mondial.",

    learnTrust:
      "En savoir plus →",

    blockchainReady:
      "Prêt pour la Blockchain",

    blockchainReadyText:
      "Conçu pour la traçabilité blockchain, les actifs numériques et les transactions sécurisées.",

    exploreBlockchain:
      "Explorer la Blockchain →",

    marketplaceEyebrow:
      "MARCHÉ MONDIAL",

    marketplaceTitle:
      "Commercez avec plus de confiance.",

    marketplaceDescription:
      "Un marché moderne reliant acheteurs, vendeurs, mineurs et commerçants vérifiés.",

    verifiedAsset:
      "ACTIF VÉRIFIÉ",

    gold:
      "Or",

    goldText:
      "Actifs en or vérifiés avec informations structurées et historiques de transactions.",

    viewGold:
      "Voir l'or",

    stones:
      "Pierres précieuses",

    stonesText:
      "Découvrez des pierres précieuses vérifiées avec des informations détaillées.",

    viewStones:
      "Voir les pierres",

    verifiedSellers:
      "VENDEURS VÉRIFIÉS",

    sellAssets:
      "Vendre vos actifs",

    sellAssetsText:
      "Les vendeurs vérifiés pourront référencer des actifs d'or et de pierres précieuses éligibles.",

    becomeSeller:
      "Devenir vendeur",

    trustEyebrow:
      "CONFIANCE & SÉCURITÉ",

    trustTitle:
      "Construit autour de la vérification.",

    trustDescription:
      "MX-PS HUB est conçu autour de l'identité, de la vérification, de la sécurité et de la participation responsable.",

    createAccount:
      "Créer un compte",

    completeKyc:
      "Terminer le KYC",

    submitVerification:
      "Soumettez les informations nécessaires à la vérification.",

    adminReview:
      "Examen administratif",

    adminReviewText:
      "Les administrateurs autorisés examinent la vérification avant l'accès complet.",

    participate:
      "Participer",

    participateText:
      "Les utilisateurs approuvés peuvent accéder aux fonctions correspondant à leur rôle.",

    blockchainEyebrow:
      "INFRASTRUCTURE WEB3",

    blockchainTitle:
      "Connecter les actifs réels à l'infrastructure numérique.",

    blockchainDescription:
      "MX-PS HUB est conçu avec des couches d'intégration dédiées aux écosystèmes blockchain pris en charge.",

    ecosystem:
      "ÉCOSYSTÈME",

    piNetwork:
      "Pi Network",

    piText:
      "Architecture dédiée à l'authentification Pi officielle, aux paiements et aux intégrations développeurs prises en charge.",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "Couche d'intégration dédiée aux services et actifs Sidra Chain pris en charge.",

    mxpsEcosystem:
      "ÉCOSYSTÈME MX-PS",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "Infrastructure dédiée au MX-PS Token et à ses futures utilités.",

    integrationReady:
      "Couche d'intégration prête",

    architecturePlanned:
      "Architecture planifiée",

    aboutEyebrow:
      "À PROPOS DE MX-PS",

    aboutTitle:
      "Construire une nouvelle norme pour le commerce de l'or et des pierres précieuses.",

    aboutText1:
      "MX-PS Katsina Gold and Precious Stones Trading Company construit un écosystème technologique destiné à rendre le commerce de l'or et des pierres précieuses plus accessible, transparent, sécurisé et connecté au monde.",

    aboutText2:
      "MX-PS HUB est la fondation numérique de cette vision, réunissant participants de confiance, infrastructure de marché, vérification, traçabilité des actifs numériques et technologies Web3.",

    ourVision:
      "NOTRE VISION",

    vision:
      "Sécurisé. Transparent. Mondial.",

    visionText:
      "Là où l'or rencontre la Blockchain.",

    joinEyebrow:
      "REJOINDRE L'ÉCOSYSTÈME",

    joinTitle:
      "Participez à l'avenir du commerce de l'or numérique.",

    joinText:
      "Créez votre compte MX-PS HUB et préparez-vous à participer à un écosystème mondial fiable.",

    platform:
      "Plateforme",

    company:
      "Entreprise",

    legal:
      "Juridique",

    aboutMxps:
      "À propos de MX-PS",

    joinUs:
      "Nous rejoindre",

    privacy:
      "Confidentialité",

    terms:
      "Conditions",

    footerDescription:
      "Un écosystème Web3 pour le commerce de l'or et des pierres précieuses.",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. Tous droits réservés.",

    footerTagline:
      "MX-PS HUB — Là où l'or rencontre la Blockchain."

  },


  /*
  ======================================================
  ARABIC
  ======================================================
  */

  ar: {

    nav: [
      "الرئيسية",
      "السوق",
      "النظام البيئي",
      "الثقة و KYC",
      "من نحن"
    ],

    signIn:
      "تسجيل الدخول",

    getStarted:
      "ابدأ الآن",

    heroEyebrow:
      "منظومة WEB3 عالمية للذهب والأحجار الكريمة",

    heroTitle:
      "حيث يلتقي الذهب مع",

    heroTitleSpan:
      "البلوك تشين.",

    heroDescription:
      "تعمل MX-PS HUB على بناء منظومة رقمية موثوقة لتجارة الذهب والأحجار الكريمة، تربط بين المستخدمين الموثقين والمعاملات الآمنة وتقنية البلوك تشين والأسواق العالمية.",

    exploreMarketplace:
      "استكشف السوق",

    exploreEcosystem:
      "استكشف المنظومة",

    secure:
      "آمن",

    secureText:
      "مصمم مع التركيز على الأمان",

    kyc:
      "KYC",

    kycText:
      "مستخدمون موثقون",

    web3:
      "Web3",

    web3Text:
      "منظومة جاهزة للبلوك تشين",

    ecosystemEyebrow:
      "منظومة MX-PS",

    ecosystemTitle:
      "منصة واحدة. إمكانيات متعددة.",

    ecosystemDescription:
      "بنية آمنة مصممة لربط تجارة الذهب والأحجار الكريمة الحقيقية بالبنية التحتية الحديثة لـ Web3.",

    goldMarketplace:
      "سوق الذهب",

    goldMarketplaceText:
      "اكتشف الذهب الموثق وأدرجه وتاجر به عبر سوق رقمي منظم.",

    exploreGold:
      "استكشف الذهب ←",

    preciousStones:
      "الأحجار الكريمة",

    preciousStonesText:
      "بيئة موثوقة لاكتشاف وتجارة الأحجار الكريمة مع معلومات تفصيلية.",

    exploreStones:
      "استكشف الأحجار ←",

    trustKyc:
      "KYC والثقة",

    trustKycText:
      "مستخدمون موثقون وبائعون موثوقون ونظام وصول مضبوط لسوق عالمي.",

    learnTrust:
      "تعرف على الثقة ←",

    blockchainReady:
      "جاهز للبلوك تشين",

    blockchainReadyText:
      "مصمم لتتبع الأصول عبر البلوك تشين والأصول الرقمية والمعاملات الآمنة.",

    exploreBlockchain:
      "استكشف البلوك تشين ←",

    marketplaceEyebrow:
      "السوق العالمي",

    marketplaceTitle:
      "تاجر بثقة أكبر.",

    marketplaceDescription:
      "سوق حديث يربط المشترين والبائعين وعمال المناجم والتجار الموثقين.",

    verifiedAsset:
      "أصل موثق",

    gold:
      "الذهب",

    goldText:
      "أصول ذهبية موثقة مع معلومات منظمة وسجلات للمعاملات.",

    viewGold:
      "عرض الذهب",

    stones:
      "الأحجار الكريمة",

    stonesText:
      "استكشف الأحجار الكريمة الموثقة مع معلومات تفصيلية.",

    viewStones:
      "عرض الأحجار",

    verifiedSellers:
      "بائعون موثقون",

    sellAssets:
      "بع أصولك",

    sellAssetsText:
      "سيتمكن البائعون الموثقون من إدراج أصول الذهب والأحجار الكريمة المؤهلة.",

    becomeSeller:
      "كن بائعاً",

    trustEyebrow:
      "الثقة والأمان",

    trustTitle:
      "مبني على التحقق.",

    trustDescription:
      "تم تصميم MX-PS HUB حول الهوية والتحقق والأمان والمشاركة المسؤولة.",

    createAccount:
      "إنشاء حساب",

    completeKyc:
      "إكمال KYC",

    submitVerification:
      "أرسل معلومات التحقق المطلوبة.",

    adminReview:
      "مراجعة الإدارة",

    adminReviewText:
      "يقوم المسؤولون المعتمدون بمراجعة التحقق قبل منح الوصول الكامل.",

    participate:
      "المشاركة",

    participateText:
      "يمكن للمستخدمين المعتمدين الوصول إلى الميزات المتاحة لدورهم.",

    blockchainEyebrow:
      "بنية WEB3 التحتية",

    blockchainTitle:
      "ربط الأصول الحقيقية بالبنية الرقمية.",

    blockchainDescription:
      "تم تصميم MX-PS HUB بطبقات تكامل مخصصة لمنظومات البلوك تشين المدعومة.",

    ecosystem:
      "المنظومة",

    piNetwork:
      "Pi Network",

    piText:
      "بنية مخصصة لمصادقة Pi الرسمية والمدفوعات وتكاملات المطورين المدعومة.",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "طبقة تكامل منفصلة لخدمات وأصول Sidra Chain المدعومة.",

    mxpsEcosystem:
      "منظومة MX-PS",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "بنية مخصصة لـ MX-PS Token واستخداماته المستقبلية.",

    integrationReady:
      "طبقة التكامل جاهزة",

    architecturePlanned:
      "البنية مخططة",

    aboutEyebrow:
      "عن MX-PS",

    aboutTitle:
      "نبني معياراً جديداً لتجارة الذهب والأحجار الكريمة.",

    aboutText1:
      "تعمل شركة MX-PS Katsina Gold and Precious Stones Trading Company على بناء منظومة تقنية تجعل تجارة الذهب والأحجار الكريمة أكثر سهولة وشفافية وأماناً واتصالاً بالعالم.",

    aboutText2:
      "MX-PS HUB هي الأساس الرقمي لهذه الرؤية، حيث تجمع بين المشاركين الموثوقين والبنية التحتية للسوق والتحقق وتتبع الأصول الرقمية وتقنيات Web3.",

    ourVision:
      "رؤيتنا",

    vision:
      "آمن. شفاف. عالمي.",

    visionText:
      "حيث يلتقي الذهب مع البلوك تشين.",

    joinEyebrow:
      "انضم إلى المنظومة",

    joinTitle:
      "كن جزءاً من مستقبل تجارة الذهب الرقمية.",

    joinText:
      "أنشئ حساب MX-PS HUB واستعد للمشاركة في منظومة عالمية موثوقة.",

    platform:
      "المنصة",

    company:
      "الشركة",

    legal:
      "قانوني",

    aboutMxps:
      "عن MX-PS",

    joinUs:
      "انضم إلينا",

    privacy:
      "الخصوصية",

    terms:
      "الشروط",

    footerDescription:
      "منظومة Web3 لتجارة الذهب والأحجار الكريمة.",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. جميع الحقوق محفوظة.",

    footerTagline:
      "MX-PS HUB — حيث يلتقي الذهب مع البلوك تشين."

  },


  /*
  ======================================================
  SPANISH
  ======================================================
  */

  es: {

    nav: [
      "Inicio",
      "Mercado",
      "Ecosistema",
      "Confianza y KYC",
      "Nosotros"
    ],

    signIn:
      "Iniciar sesión",

    getStarted:
      "Comenzar",

    heroEyebrow:
      "ECOSISTEMA WEB3 GLOBAL PARA ORO Y PIEDRAS PRECIOSAS",

    heroTitle:
      "Donde el oro se encuentra con",

    heroTitleSpan:
      "Blockchain.",

    heroDescription:
      "MX-PS HUB está construyendo un ecosistema digital confiable para el comercio de oro y piedras preciosas, conectando personas verificadas, transacciones seguras, tecnología blockchain y mercados globales.",

    exploreMarketplace:
      "Explorar mercado",

    exploreEcosystem:
      "Explorar ecosistema",

    secure:
      "Seguro",

    secureText:
      "Diseñado pensando en la seguridad",

    kyc:
      "KYC",

    kycText:
      "Participantes verificados",

    web3:
      "Web3",

    web3Text:
      "Ecosistema preparado para Blockchain",

    ecosystemEyebrow:
      "EL ECOSISTEMA MX-PS",

    ecosystemTitle:
      "Una plataforma. Múltiples posibilidades.",

    ecosystemDescription:
      "Una base segura diseñada para conectar el comercio real de oro y piedras preciosas con la infraestructura Web3 moderna.",

    goldMarketplace:
      "Mercado del oro",

    goldMarketplaceText:
      "Descubre, publica y comercia con oro verificado mediante un mercado digital estructurado.",

    exploreGold:
      "Explorar oro →",

    preciousStones:
      "Piedras preciosas",

    preciousStonesText:
      "Un entorno confiable para descubrir y comerciar piedras preciosas con información detallada.",

    exploreStones:
      "Explorar piedras →",

    trustKyc:
      "KYC y confianza",

    trustKycText:
      "Usuarios verificados, vendedores confiables y acceso controlado para un mercado global.",

    learnTrust:
      "Conocer la confianza →",

    blockchainReady:
      "Preparado para Blockchain",

    blockchainReadyText:
      "Diseñado para trazabilidad blockchain, activos digitales y transacciones seguras.",

    exploreBlockchain:
      "Explorar Blockchain →",

    marketplaceEyebrow:
      "MERCADO GLOBAL",

    marketplaceTitle:
      "Comercia con mayor confianza.",

    marketplaceDescription:
      "Un mercado moderno que conecta compradores, vendedores, mineros y comerciantes verificados.",

    verifiedAsset:
      "ACTIVO VERIFICADO",

    gold:
      "Oro",

    goldText:
      "Activos de oro verificados con información estructurada y registros de transacciones.",

    viewGold:
      "Ver oro",

    stones:
      "Piedras preciosas",

    stonesText:
      "Explora piedras preciosas verificadas con información detallada.",

    viewStones:
      "Ver piedras",

    verifiedSellers:
      "VENDEDORES VERIFICADOS",

    sellAssets:
      "Vende tus activos",

    sellAssetsText:
      "Los vendedores verificados podrán publicar activos elegibles de oro y piedras preciosas.",

    becomeSeller:
      "Ser vendedor",

    trustEyebrow:
      "CONFIANZA Y SEGURIDAD",

    trustTitle:
      "Construido alrededor de la verificación.",

    trustDescription:
      "MX-PS HUB está diseñado alrededor de la identidad, verificación, seguridad y participación responsable.",

    createAccount:
      "Crear cuenta",

    completeKyc:
      "Completar KYC",

    submitVerification:
      "Envía la información requerida para la verificación.",

    adminReview:
      "Revisión administrativa",

    adminReviewText:
      "Los administradores autorizados revisan la verificación antes del acceso completo.",

    participate:
      "Participar",

    participateText:
      "Los usuarios aprobados pueden acceder a las funciones disponibles según su rol.",

    blockchainEyebrow:
      "INFRAESTRUCTURA WEB3",

    blockchainTitle:
      "Conectando activos reales con infraestructura digital.",

    blockchainDescription:
      "MX-PS HUB está diseñado con capas de integración dedicadas para ecosistemas blockchain compatibles.",

    ecosystem:
      "ECOSISTEMA",

    piNetwork:
      "Pi Network",

    piText:
      "Arquitectura dedicada para autenticación oficial de Pi, pagos e integraciones para desarrolladores.",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "Capa de integración separada para servicios y activos compatibles de Sidra Chain.",

    mxpsEcosystem:
      "ECOSISTEMA MX-PS",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "Infraestructura dedicada para MX-PS Token y sus futuras utilidades.",

    integrationReady:
      "Capa de integración lista",

    architecturePlanned:
      "Arquitectura planificada",

    aboutEyebrow:
      "SOBRE MX-PS",

    aboutTitle:
      "Construyendo un nuevo estándar para el comercio de oro y piedras preciosas.",

    aboutText1:
      "MX-PS Katsina Gold and Precious Stones Trading Company está construyendo un ecosistema tecnológico diseñado para hacer que el comercio de oro y piedras preciosas sea más accesible, transparente, seguro y conectado globalmente.",

    aboutText2:
      "MX-PS HUB es la base digital de esta visión, reuniendo participantes confiables, infraestructura de mercado, verificación, trazabilidad de activos digitales y tecnologías Web3.",

    ourVision:
      "NUESTRA VISIÓN",

    vision:
      "Seguro. Transparente. Global.",

    visionText:
      "Donde el oro se encuentra con Blockchain.",

    joinEyebrow:
      "ÚNETE AL ECOSISTEMA",

    joinTitle:
      "Sé parte del futuro del comercio de oro digital.",

    joinText:
      "Crea tu cuenta MX-PS HUB y prepárate para participar en un ecosistema global confiable.",

    platform:
      "Plataforma",

    company:
      "Empresa",

    legal:
      "Legal",

    aboutMxps:
      "Sobre MX-PS",

    joinUs:
      "Únete",

    privacy:
      "Privacidad",

    terms:
      "Términos",

    footerDescription:
      "Un ecosistema Web3 para el comercio de oro y piedras preciosas.",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. Todos los derechos reservados.",

    footerTagline:
      "MX-PS HUB — Donde el oro se encuentra con Blockchain."

  },


  /*
  ======================================================
  CHINESE
  ======================================================
  */

  zh: {

    nav: [
      "首页",
      "市场",
      "生态系统",
      "信任与 KYC",
      "关于我们"
    ],

    signIn:
      "登录",

    getStarted:
      "立即开始",

    heroEyebrow:
      "全球 WEB3 黄金与宝石生态系统",

    heroTitle:
      "黄金连接",

    heroTitleSpan:
      "区块链。",

    heroDescription:
      "MX-PS HUB 正在建设一个值得信赖的黄金和宝石数字交易生态系统，将经过验证的用户、安全交易、区块链技术和全球市场连接起来。",

    exploreMarketplace:
      "探索市场",

    exploreEcosystem:
      "探索生态系统",

    secure:
      "安全",

    secureText:
      "以安全为核心进行建设",

    kyc:
      "KYC",

    kycText:
      "经过验证的参与者",

    web3:
      "Web3",

    web3Text:
      "区块链就绪生态系统",

    ecosystemEyebrow:
      "MX-PS 生态系统",

    ecosystemTitle:
      "一个平台。无限可能。",

    ecosystemDescription:
      "安全的基础设施，将现实世界的黄金和宝石交易与现代 Web3 基础设施连接起来。",

    goldMarketplace:
      "黄金市场",

    goldMarketplaceText:
      "通过结构化数字市场发现、发布和交易经过验证的黄金。",

    exploreGold:
      "探索黄金 →",

    preciousStones:
      "宝石",

    preciousStonesText:
      "值得信赖的宝石发现和交易环境，并提供详细资产信息。",

    exploreStones:
      "探索宝石 →",

    trustKyc:
      "KYC 与信任",

    trustKycText:
      "经过验证的用户、可信卖家以及面向全球市场的受控访问。",

    learnTrust:
      "了解信任 →",

    blockchainReady:
      "区块链就绪",

    blockchainReadyText:
      "支持区块链追踪、数字资产和安全交易。",

    exploreBlockchain:
      "探索区块链 →",

    marketplaceEyebrow:
      "全球市场",

    marketplaceTitle:
      "更安心地进行交易。",

    marketplaceDescription:
      "连接经过验证的买家、卖家、矿工和交易者的现代市场。",

    verifiedAsset:
      "已验证资产",

    gold:
      "黄金",

    goldText:
      "经过验证的黄金资产，并提供结构化信息和交易记录。",

    viewGold:
      "查看黄金",

    stones:
      "宝石",

    stonesText:
      "探索经过验证的宝石及详细资产信息。",

    viewStones:
      "查看宝石",

    verifiedSellers:
      "已验证卖家",

    sellAssets:
      "出售资产",

    sellAssetsText:
      "经过验证的卖家可以发布符合条件的黄金和宝石资产。",

    becomeSeller:
      "成为卖家",

    trustEyebrow:
      "信任与安全",

    trustTitle:
      "以验证为核心建设。",

    trustDescription:
      "MX-PS HUB 围绕身份、验证、安全和负责任的参与进行设计。",

    createAccount:
      "创建账户",

    completeKyc:
      "完成 KYC",

    submitVerification:
      "提交所需的验证信息。",

    adminReview:
      "管理员审核",

    adminReviewText:
      "授权管理员将在授予完整平台访问权限之前审核验证信息。",

    participate:
      "参与",

    participateText:
      "获批准的用户可以访问其账户角色允许的功能。",

    blockchainEyebrow:
      "WEB3 基础设施",

    blockchainTitle:
      "连接现实资产与数字基础设施。",

    blockchainDescription:
      "MX-PS HUB 为支持的区块链生态系统设计了专用集成层。",

    ecosystem:
      "生态系统",

    piNetwork:
      "Pi Network",

    piText:
      "为官方 Pi 身份验证、支付和支持的开发者集成提供专用架构。",

    sidraChain:
      "Sidra Chain",

    sidraText:
      "为支持的 Sidra Chain 服务和资产提供独立集成层。",

    mxpsEcosystem:
      "MX-PS 生态系统",

    mxpsToken:
      "MX-PS Token",

    mxpsTokenText:
      "为 MX-PS Token 及其未来生态功能提供专用基础设施。",

    integrationReady:
      "集成层已准备",

    architecturePlanned:
      "架构已规划",

    aboutEyebrow:
      "关于 MX-PS",

    aboutTitle:
      "为黄金和宝石交易建立新标准。",

    aboutText1:
      "MX-PS Katsina Gold and Precious Stones Trading Company 正在建设一个技术驱动的生态系统，让黄金和宝石交易更加便捷、透明、安全并连接全球市场。",

    aboutText2:
      "MX-PS HUB 是这一愿景的数字基础，将可信参与者、市场基础设施、验证、数字资产追踪和 Web3 技术结合起来。",

    ourVision:
      "我们的愿景",

    vision:
      "安全。透明。全球。",

    visionText:
      "黄金连接区块链。",

    joinEyebrow:
      "加入生态系统",

    joinTitle:
      "成为数字黄金交易未来的一部分。",

    joinText:
      "创建 MX-PS HUB 账户，准备参与值得信赖的全球生态系统。",

    platform:
      "平台",

    company:
      "公司",

    legal:
      "法律",

    aboutMxps:
      "关于 MX-PS",

    joinUs:
      "加入我们",

    privacy:
      "隐私",

    terms:
      "条款",

    footerDescription:
      "黄金和宝石交易的 Web3 生态系统。",

    footerCopyright:
      "© 2026 MX-PS Katsina Gold and Precious Stones Trading Company. 保留所有权利。",

    footerTagline:
      "MX-PS HUB — 黄金连接区块链。"

  }

};


/*
========================================================
APPLY LANGUAGE
========================================================
*/

function applyLanguage(language) {

  if (
    !MXPS_CONFIG.supportedLanguages
      .includes(language)
  ) {

    language =
      MXPS_CONFIG.defaultLanguage;

  }


  const translation =
    MXPS_TRANSLATIONS[language];


  if (!translation) {

    return;

  }


  MXPS_STATE.language =
    language;


  const languageInfo =
    MXPS_LANGUAGES[language];


  document.documentElement.lang =
    language;


  document.documentElement.dir =
    languageInfo.direction;


  /*
  ======================================================
  NAVIGATION
  ======================================================
  */

  setTexts(
    ".main-navigation a",
    translation.nav
  );


  /*
  ======================================================
  HEADER
  ======================================================
  */

  setText(
    ".header-actions .button:nth-of-type(1)",
    translation.signIn
  );

  setText(
    ".header-actions .button:nth-of-type(2)",
    translation.getStarted
  );


  /*
  ======================================================
  HERO
  ======================================================
  */

  setText(
    ".hero-section .eyebrow",
    translation.heroEyebrow
  );

  setTexts(
    ".hero-section h1",
    [
      `${translation.heroTitle} ${translation.heroTitleSpan}`
    ]
  );


  const heroTitle =
    getElement(".hero-section h1");

  if (heroTitle) {

    heroTitle.innerHTML =
      `${escapeHTML(translation.heroTitle)}
       <span>${escapeHTML(translation.heroTitleSpan)}</span>`;

  }


  setText(
    ".hero-description",
    translation.heroDescription
  );


  setTexts(
    ".hero-actions .button",
    [
      translation.exploreMarketplace,
      translation.exploreEcosystem
    ]
  );


  /*
  ======================================================
  HERO TRUST
  ======================================================
  */

  setTexts(
    ".hero-trust .trust-item strong",
    [
      translation.secure,
      translation.kyc,
      translation.web3
    ]
  );


  setTexts(
    ".hero-trust .trust-item span",
    [
      translation.secureText,
      translation.kycText,
      translation.web3Text
    ]
  );


  /*
  ======================================================
  ECOSYSTEM SECTION
  ======================================================
  */

  setText(
    ".ecosystem-section .eyebrow",
    translation.ecosystemEyebrow
  );

  setText(
    ".ecosystem-section h2",
    translation.ecosystemTitle
  );

  setText(
    ".ecosystem-section .section-heading p",
    translation.ecosystemDescription
  );


  setTexts(
    ".feature-card h3",
    [
      translation.goldMarketplace,
      translation.preciousStones,
      translation.trustKyc,
      translation.blockchainReady
    ]
  );


  setTexts(
    ".feature-card p",
    [
      translation.goldMarketplaceText,
      translation.preciousStonesText,
      translation.trustKycText,
      translation.blockchainReadyText
    ]
  );


  setTexts(
    ".feature-card a",
    [
      translation.exploreGold,
      translation.exploreStones,
      translation.learnTrust,
      translation.exploreBlockchain
    ]
  );


  /*
  ======================================================
  MARKETPLACE
  ======================================================
  */

  setText(
    ".marketplace-section .eyebrow",
    translation.marketplaceEyebrow
  );

  setText(
    ".marketplace-section h2",
    translation.marketplaceTitle
  );

  setText(
    ".marketplace-section .section-heading p",
    translation.marketplaceDescription
  );


  setTexts(
    ".market-card .status-badge",
    [
      translation.verifiedAsset,
      translation.verifiedAsset,
      translation.verifiedSellers
    ]
  );


  setTexts(
    ".market-card h3",
    [
      translation.gold,
      translation.stones,
      translation.sellAssets
    ]
  );


  setTexts(
    ".market-card-content p",
    [
      translation.goldText,
      translation.stonesText,
      translation.sellAssetsText
    ]
  );


  setTexts(
    ".market-card-content .button",
    [
      translation.viewGold,
      translation.viewStones,
      translation.becomeSeller
    ]
  );


  /*
  ======================================================
  TRUST
  ======================================================
  */

  setText(
    ".trust-section .eyebrow",
    translation.trustEyebrow
  );

  setText(
    ".trust-section h2",
    translation.trustTitle
  );

  setText(
    ".trust-section .section-heading p",
    translation.trustDescription
  );


  setTexts(
    ".trust-step h3",
    [
      translation.createAccount,
      translation.completeKyc,
      translation.adminReview,
      translation.participate
    ]
  );


  setTexts(
    ".trust-step p",
    [
      translation.createAccount,
      translation.submitVerification,
      translation.adminReviewText,
      translation.participateText
    ]
  );


  /*
  ======================================================
  BLOCKCHAIN
  ======================================================
  */

  setText(
    ".blockchain-section .eyebrow",
    translation.blockchainEyebrow
  );

  setText(
    ".blockchain-section h2",
    translation.blockchainTitle
  );

  setText(
    ".blockchain-section .section-heading p",
    translation.blockchainDescription
  );


  setTexts(
    ".ecosystem-card .ecosystem-label",
    [
      translation.ecosystem,
      translation.ecosystem,
      translation.mxpsEcosystem
    ]
  );


  setTexts(
    ".ecosystem-card h3",
    [
      translation.piNetwork,
      translation.sidraChain,
      translation.mxpsToken
    ]
  );


  setTexts(
    ".ecosystem-card p",
    [
      translation.piText,
      translation.sidraText,
      translation.mxpsTokenText
    ]
  );


  setTexts(
    ".ecosystem-card .integration-status",
    [
      translation.integrationReady,
      translation.integrationReady,
      translation.architecturePlanned
    ]
  );


  /*
  ======================================================
  ABOUT
  ======================================================
  */

  setText(
    ".about-section .eyebrow",
    translation.aboutEyebrow
  );

  setText(
    ".about-section h2",
    translation.aboutTitle
  );


  setTexts(
    ".about-content p",
    [
      translation.aboutText1,
      translation.aboutText2
    ]
  );


  setText(
    ".about-highlight span",
    translation.ourVision
  );

  setText(
    ".about-highlight strong",
    translation.vision
  );

  setText(
    ".about-highlight p",
    translation.visionText
  );


  /*
  ======================================================
  CTA
  ======================================================
  */

  setText(
    ".cta-section .eyebrow",
    translation.joinEyebrow
  );

  setText(
    ".cta-section h2",
    translation.joinTitle
  );

  setText(
    ".cta-section p",
    translation.joinText
  );

  setText(
    ".cta-section .button",
    translation.createAccount
  );


  /*
  ======================================================
  FOOTER
  ======================================================
  */

  setText(
    ".footer-brand p",
    translation.footerDescription
  );


  setTexts(
    ".footer-links h4",
    [
      translation.platform,
      translation.company,
      translation.legal
    ]
  );


  setTexts(
    ".footer-links a",
    [
      translation.nav[0],
      translation.nav[1],
      translation.nav[2],
      translation.nav[3],
      translation.aboutMxps,
      translation.joinUs,
      translation.privacy,
      translation.terms
    ]
  );


  const footerBottom =
    getElements(".footer-bottom p");

  if (footerBottom.length >= 2) {

    footerBottom[0].textContent =
      translation.footerCopyright;

    footerBottom[1].textContent =
      translation.footerTagline;

  }


  /*
  ======================================================
  LANGUAGE BUTTON
  ======================================================
  */

  updateLanguageButton();


  /*
  ======================================================
  SAVE LANGUAGE
  ======================================================
  */

  try {

    localStorage.setItem(
      "mxps-language",
      language
    );

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Could not save language preference."
    );

  }


  /*
  ======================================================
  RTL SUPPORT
  ======================================================
  */

  if (
    languageInfo.direction === "rtl"
  ) {

    document.body.classList.add(
      "mxps-rtl"
    );

  } else {

    document.body.classList.remove(
      "mxps-rtl"
    );

  }

}


/*
========================================================
HTML ESCAPE
========================================================
*/

function escapeHTML(value) {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/*
========================================================
LANGUAGE MENU
========================================================
*/

function createLanguageMenu() {

  const existing =
    getElement("#mxps-language-menu");

  if (existing) {

    return existing;

  }


  const button =
    getElement(".language-button");

  if (!button) {

    return null;

  }


  const menu =
    document.createElement("div");

  menu.id =
    "mxps-language-menu";

  Object.assign(
    menu.style,
    {

      position: "absolute",

      top: "calc(100% + 10px)",

      right: "0",

      minWidth: "210px",

      padding: "8px",

      borderRadius: "14px",

      background: "#101720",

      border:
        "1px solid rgba(255,255,255,.12)",

      boxShadow:
        "0 20px 50px rgba(0,0,0,.45)",

      display: "none",

      zIndex: "10000"

    }
  );


  Object.entries(
    MXPS_LANGUAGES
  ).forEach(
    ([code, info]) => {

      const item =
        document.createElement("button");

      item.type =
        "button";

      item.dataset.language =
        code;

      item.textContent =
        `${info.flag}  ${info.nativeName}`;

      Object.assign(
        item.style,
        {

          width: "100%",

          padding: "11px 12px",

          border: "0",

          borderRadius: "9px",

          background: "transparent",

          color: "#f5f7fa",

          textAlign: "left",

          cursor: "pointer",

          fontSize: "14px"

        }
      );


      item.addEventListener(
        "mouseenter",
        () => {

          item.style.background =
            "rgba(255,255,255,.08)";

        }
      );


      item.addEventListener(
        "mouseleave",
        () => {

          item.style.background =
            "transparent";

        }
      );


      item.addEventListener(
        "click",
        () => {

          applyLanguage(code);

          menu.style.display =
            "none";

          const message =
            code === "ha"
              ? "An canza harshen shafin zuwa Hausa."
              : code === "ar"
                ? "تم تغيير لغة المنصة."
                : code === "fr"
                  ? "La langue de la plateforme a été modifiée."
                  : code === "es"
                    ? "El idioma de la plataforma ha cambiado."
                    : code === "zh"
                      ? "平台语言已更改。"
                      : "Language changed successfully.";

          showNotification(
            message,
            "success"
          );

        }
      );


      menu.appendChild(item);

    }
  );


  const wrapper =
    document.createElement("div");

  wrapper.style.position =
    "relative";

  wrapper.style.display =
    "inline-block";


  button.parentNode.insertBefore(
    wrapper,
    button
  );


  wrapper.appendChild(
    button
  );

  wrapper.appendChild(
    menu
  );


  button.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();

      menu.style.display =
        menu.style.display === "none"
          ? "block"
          : "none";

    }
  );


  document.addEventListener(
    "click",
    () => {

      menu.style.display =
        "none";

    }
  );


  return menu;

}


/*
========================================================
LANGUAGE BUTTON
========================================================
*/

function updateLanguageButton() {

  const button =
    getElement(".language-button");

  if (!button) {

    return;

  }


  const info =
    MXPS_LANGUAGES[
      MXPS_STATE.language
    ];


  if (!info) {

    return;

  }


  button.textContent =
    `${info.flag} ${MXPS_STATE.language.toUpperCase()}`;


  button.setAttribute(
    "aria-label",
    `Language: ${info.name}`
  );

}


/*
========================================================
INITIALIZE LANGUAGE
========================================================
*/

function initializeLanguage() {

  createLanguageMenu();


  let savedLanguage =
    MXPS_CONFIG.defaultLanguage;


  try {

    const stored =
      localStorage.getItem(
        "mxps-language"
      );


    if (
      stored &&
      MXPS_CONFIG.supportedLanguages
        .includes(stored)
    ) {

      savedLanguage =
        stored;

    }

  } catch (error) {

    console.warn(
      "[MX-PS HUB] Language preference unavailable."
    );

  }


  applyLanguage(
    savedLanguage
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
            getElement(targetId);


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
    getElement(".site-header");


  if (!header) {

    return;

  }


  function updateHeader() {

    if (
      window.scrollY > 20
    ) {

      header.style.background =
        "rgba(7,10,15,.96)";

      header.style.backdropFilter =
        "blur(16px)";

    } else {

      header.style.background =
        "rgba(7,10,15,.88)";

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
      ".main-navigation a[href^='#']"
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
    !("IntersectionObserver" in window)
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


                if (active) {

                  link.classList.add(
                    "active"
                  );

                  link.style.color =
                    "var(--gold-light)";

                } else {

                  link.classList.remove(
                    "active"
                  );

                  link.style.color =
                    "";

                }

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
MARKETPLACE
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

          if (
            index === 0
          ) {

            showNotification(
              getMarketplaceMessage(
                "gold"
              ),
              "warning"
            );

            return;

          }


          if (
            index === 1
          ) {

            showNotification(
              getMarketplaceMessage(
                "stones"
              ),
              "warning"
            );

            return;

          }


          if (
            index === 2
          ) {

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
                    "smooth"
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
MARKETPLACE MESSAGES
========================================================
*/

function getMarketplaceMessage(type) {

  const language =
    MXPS_STATE.language;


  const messages = {

    en: {

      gold:
        "Gold Marketplace is being prepared. Asset verification and trading APIs will be connected in the next development stage.",

      stones:
        "Precious Stones Marketplace is being prepared. Verified asset services will be connected later."

    },

    ha: {

      gold:
        "Ana shirya Kasuwar Zinare. Za a haɗa asset verification da trading APIs a mataki na gaba.",

      stones:
        "Ana shirya Kasuwar Duwatsu Masu Daraja. Za a haɗa ayyukan tantance kadarori a mataki na gaba."

    },

    fr: {

      gold:
        "Le marché de l'or est en préparation. Les API de vérification et de trading seront connectées lors de la prochaine étape.",

      stones:
        "Le marché des pierres précieuses est en préparation."

    },

    ar: {

      gold:
        "يتم تجهيز سوق الذهب. سيتم ربط واجهات التحقق والتداول في المرحلة القادمة.",

      stones:
        "يتم تجهيز سوق الأحجار الكريمة."

    },

    es: {

      gold:
        "El mercado del oro está en preparación. Las API de verificación y comercio se conectarán en la próxima etapa.",

      stones:
        "El mercado de piedras preciosas está en preparación."

    },

    zh: {

      gold:
        "黄金市场正在准备中。资产验证和交易 API 将在下一开发阶段接入。",

      stones:
        "宝石市场正在准备中。验证资产服务将在后续阶段接入。"

    }

  };


  return (
    messages[language] ||
    messages.en
  )[type];

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

          event.preventDefault();


          const messages = {

            en:
              "The MX-PS authentication system will connect to /api/auth in the next authentication stage.",

            ha:
              "Tsarin shiga MX-PS zai haɗu da /api/auth a matakin authentication na gaba.",

            fr:
              "Le système d'authentification MX-PS sera connecté à /api/auth lors de la prochaine étape.",

            ar:
              "سيتم ربط نظام تسجيل الدخول MX-PS مع /api/auth في المرحلة القادمة.",

            es:
              "El sistema de autenticación MX-PS se conectará a /api/auth en la próxima etapa.",

            zh:
              "MX-PS 身份验证系统将在下一阶段连接到 /api/auth。"

          };


          showNotification(
            messages[
              MXPS_STATE.language
            ] || messages.en,
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
            getElement(
              "#register"
            );


          if (
            !registerSection
          ) {

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


  let data =
    null;


  try {

    data =
      await response.json();

  } catch (error) {

    data =
      null;

  }


  if (
    !response.ok
  ) {

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
API CONNECTION
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
      "[MX-PS HUB] API unavailable:",
      error.message
    );

  }


  return false;

}


/*
========================================================
DATABASE CONNECTION
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
VISIBILITY
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
EXTERNAL LINKS
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
ACCESSIBILITY
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
        "[MX-PS HUB] Unhandled promise:",
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
    "MX-PS HUB — GLOBAL FRONTEND"
  );

  console.log(
    "MX-PS Katsina Gold & Precious Stones Trading Company"
  );

  console.log(
    "Where Gold Meets Blockchain."
  );

  console.log(
    "Supported Languages:",
    MXPS_CONFIG.supportedLanguages
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


  initializeMarketplace();


  initializeAuthenticationLinks();


  initializeVisibilityHandling();


  initializeExternalLinks();


  initializeButtonAccessibility();


  initializeErrorMonitoring();


  MXPS_STATE.initialized =
    true;


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

  languages:
    MXPS_LANGUAGES,

  translations:
    MXPS_TRANSLATIONS,

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
END OF MX-PS HUB GLOBAL SCRIPT
========================================================
*/
