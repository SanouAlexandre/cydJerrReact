// Configuration API pour CydJerr Nation

// URLs de base pour les différents environnements
const API_ENDPOINTS = {
  development: "http://192.168.1.67:4000/api/v1", // Serveur local pour développement
  staging: "https://staging-api.cydjerr.com/api/v1",
  production: "https://backend-cydjerr-8320e335909f.herokuapp.com/api/v1",
};

// Environnement actuel (à modifier selon le contexte)
// Forcer l'utilisation de l'environnement de production pour utiliser le backend Heroku
const ENVIRONMENT = "production";

// Configuration alternative pour développement local si nécessaire
// const ENVIRONMENT =
//   (typeof __DEV__ !== "undefined" && __DEV__) ||
//   process.env.NODE_ENV === "development" ||
//   (typeof window !== "undefined" &&
//     window.location &&
//     window.location.hostname === "localhost")
//     ? "development"
//     : "production";

// URL de base de l'API
export const API_BASE_URL =
  API_ENDPOINTS[ENVIRONMENT] || API_ENDPOINTS.development;

// Log de débogage pour vérifier la configuration (en développement uniquement)
if (typeof __DEV__ !== "undefined" && __DEV__) {
  console.log("🔧 Configuration API:");
  console.log("  - Environment détecté:", ENVIRONMENT);
  console.log("  - API_BASE_URL:", API_BASE_URL);
  console.log("  - Backend Heroku connecté:", API_BASE_URL.includes("heroku"));
}

// Vérification de sécurité
if (!API_BASE_URL) {
  console.error("❌ API_BASE_URL is undefined. Environment:", ENVIRONMENT);
  throw new Error("API_BASE_URL configuration error");
}

// Endpoints par domaine
export const ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    GET_ME: "/auth/me",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // Utilisateurs
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    UPLOAD_AVATAR: "/users/avatar",
    UPDATE_AVATAR: "/users/avatar",
    DELETE_AVATAR: "/users/avatar",
    CHANGE_EMAIL: "/users/email",
    DEACTIVATE_ACCOUNT: "/users/deactivate",
    REACTIVATE_ACCOUNT: "/users/reactivate",
    DELETE_ACCOUNT: "/users/account",
    LEARNING_STATS: "/users/learning-stats",
    ACTIVITY_HISTORY: "/users/activity-history",
    // Admin routes
    LIST: "/users",
    GET_BY_ID: "/users/:id",
    UPDATE_USER: "/users/:id",
    DELETE_USER: "/users/:id",
  },

  // Cours (TeachJerr)
  COURSES: {
    LIST: "/courses",
    DETAILS: "/courses/:slug",
    CREATE: "/courses",
    UPDATE: "/courses/:id",
    DELETE: "/courses/:id",
    UPLOAD_THUMBNAIL: "/courses/:id/thumbnail",
    UPDATE_THUMBNAIL: "/courses/:id/thumbnail",
    ENROLL: "/courses/:id/enroll",
    UNENROLL: "/courses/:id/enroll",
    MARK_LESSON_COMPLETE: "/courses/:id/lesson-complete",
    ADD_RATING: "/courses/:id/rating",
    INSTRUCTOR_COURSES: "/courses/instructor/my-courses",
    PUBLISH: "/courses/:id/publish",
    UNPUBLISH: "/courses/:id/unpublish",
  },

  // Financement (FundingJerr) - Projets
  PROJECTS: {
    LIST: "/projects",
    DETAILS: "/projects/:slug",
    CREATE: "/projects",
    UPDATE: "/projects/:id",
    DELETE: "/projects/:id",
    UPLOAD_IMAGES: "/projects/:id/images",
    CONTRIBUTE: "/projects/:id/contribute",
    CONTRIBUTIONS: "/projects/:id/contributions",
    ADD_UPDATE: "/projects/:id/updates",
    LAUNCH: "/projects/:id/launch",
    MY_PROJECTS: "/projects/user/my-projects",
  },

  // Emploi (JobJerr)
  JOBS: {
    LIST: "/jobs",
    DETAILS: "/jobs/:slug",
    CREATE: "/jobs",
    UPDATE: "/jobs/:id",
    DELETE: "/jobs/:id",
    APPLY: "/jobs/:id/apply",
    SAVE: "/jobs/:id/save",
    UNSAVE: "/jobs/:id/save",
    MY_SAVED_JOBS: "/jobs/user/saved",
    EMPLOYER_JOBS: "/jobs/employer/my-jobs",
    PUBLISH: "/jobs/:id/publish",
    UNPUBLISH: "/jobs/:id/unpublish",
    MARK_FILLED: "/jobs/:id/mark-filled",
  },

  // Applications/Candidatures
  APPLICATIONS: {
    LIST: "/applications",
    DETAILS: "/applications/:id",
    UPDATE_STATUS: "/applications/:id/status",
    SCHEDULE_INTERVIEW: "/applications/:id/interview",
    ADD_NOTE: "/applications/:id/notes",
    EVALUATE: "/applications/:id/evaluation",
    WITHDRAW: "/applications/:id/withdraw",
    MY_APPLICATIONS: "/applications/my-applications",
    STATS: "/applications/stats",
    DELETE: "/applications/:id",
  },

  // Célébrités (StarJerr)
  STARS: {
    LIST: "/stars",
    TRENDING: "/stars/trending",
    POPULAR_BY_CATEGORY: "/stars/popular/:category",
    SEARCH: "/stars/search",
    DETAILS: "/stars/:slug",
    CREATE: "/stars",
    UPDATE: "/stars/:id",
    DELETE: "/stars/:id",
    UPLOAD_IMAGE: "/stars/:id/upload-image",
    SOCIAL_STATS: "/stars/:id/social-stats",
    NOTABLE_WORKS: "/stars/:id/notable-works",
    NEWS: "/stars/:id/news",
    VERIFY: "/stars/:id/verify",
    FEATURE: "/stars/:id/feature",
  },

  // Posts et contenu social
  POSTS: {
    LIST: "/posts",
    DETAILS: "/posts/:id",
    CREATE: "/posts",
    UPDATE: "/posts/:id",
    DELETE: "/posts/:id",
    LIKE: "/posts/:id/like",
    SHARE: "/posts/:id/share",
    USER_POSTS: "/posts/user/:userId",
    SEARCH: "/posts/search",
  },

  // Commentaires
  COMMENTS: {
    LIST: "/posts/:postId/comments",
    CREATE: "/posts/:postId/comments",
    UPDATE: "/comments/:id",
    DELETE: "/comments/:id",
    LIKE: "/comments/:id/like",
    REPLY: "/comments/:id/reply",
  },

  // Groupes
  GROUPS: {
    LIST: "/groups",
    MY_GROUPS: "/groups/my",
    TRENDING: "/groups/trending",
    DETAILS: "/groups/:id",
    CREATE: "/groups",
    UPDATE: "/groups/:id",
    DELETE: "/groups/:id",
    JOIN: "/groups/:id/join",
    LEAVE: "/groups/:id/leave",
    POSTS: "/groups/:id/posts",
    SEARCH: "/groups/search",
  },

  // Messages
  MESSAGES: {
    CONVERSATIONS: "/messages/conversations",
    CONVERSATION_MESSAGES: "/messages/conversations/:id",
    DIRECT_MESSAGES: "/messages/direct/:userId",
    GROUP_MESSAGES: "/messages/groups/:groupId",
    SEND: "/messages",
    UPDATE: "/messages/:id",
    DELETE: "/messages/:id",
    REACT: "/messages/:id/react",
    MARK_READ: "/messages/:id/read",
    UNREAD_COUNT: "/messages/unread-count",
    SEARCH: "/messages/search",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: "/notifications/:id",
    CLEAR_ALL: "/notifications/clear-all",
    STATS: "/notifications/stats",
  },

  // Portefeuille (Wallet)
  WALLET: {
    BALANCE: "/wallet/balance",
    TRANSACTIONS: "/wallet/transactions",
    TRANSFER: "/wallet/transfer",
    STATS: "/wallet/stats",
    PLANS: "/wallet/plans",
    SETTINGS: "/wallet/settings",
    USERS_SEARCH: "/wallet/users/search",
    SIMULATE_PERFORMANCE: "/wallet/simulate-performance",
  },

  // Recherche
  SEARCH: {
    GLOBAL: "/search",
    SUGGESTIONS: "/search/suggestions",
    USERS: "/search/users",
    COURSES: "/search/courses",
    JOBS: "/search/jobs",
    PROJECTS: "/search/projects",
    STARS: "/search/stars",
  },

  // Upload de fichiers
  UPLOAD: {
    IMAGE: "/upload/image",
    DOCUMENT: "/upload/document",
  },

  // Stockage Cloud
  CLOUD: {
    STATS: "/cloud/stats",
    FILES: "/cloud/files",
    UPLOAD: "/cloud/upload",
    FILE_DETAILS: "/cloud/files/:id",
    UPDATE_FILE: "/cloud/files/:id",
    DELETE_FILE: "/cloud/files/:id",
    SHARE_FILE: "/cloud/files/:id/share",
    DOWNLOAD_FILE: "/cloud/files/:id/download",
    FOLDERS: "/cloud/folders",
    SHARED_FILES: "/cloud/shared",
    RECENT_FILES: "/cloud/recent",
    FAVORITES: "/cloud/favorites",
    SEARCH: "/cloud/search",
  },
};

// Configuration générale de l'API
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 secondes pour les requêtes normales
  UPLOAD_TIMEOUT: 120000, // 2 minutes pour les uploads
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 seconde
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
};

// Headers par défaut
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Codes d'erreur personnalisés
export const ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
};

// Messages d'erreur par défaut
export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: "Erreur de connexion réseau",
  [ERROR_CODES.TIMEOUT_ERROR]: "Délai d'attente dépassé",
  [ERROR_CODES.UNAUTHORIZED]: "Email ou Mot de passe incorrect",
  [ERROR_CODES.FORBIDDEN]: "Accès interdit",
  [ERROR_CODES.NOT_FOUND]: "Ressource non trouvée",
  [ERROR_CODES.SERVER_ERROR]: "Erreur serveur",
  [ERROR_CODES.VALIDATION_ERROR]: "Données invalides",
  [ERROR_CODES.ACCOUNT_LOCKED]: "Compte temporairement verrouillé",
};

// ============================================================================
// REACT QUERY HOOKS - MOVED TO hooks/useApi.js
// ============================================================================

// Note: Les hooks React Query ont été déplacés vers hooks/useApi.js
// pour éviter les cycles de dépendances
