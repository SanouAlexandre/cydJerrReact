// Export de tous les services API

// Client API principal
export { default as apiClient, saveAuthData, getAuthData, clearAuthData, isAuthenticated } from './apiClient';

// Services par domaine
export { default as authService, validateLoginForm, validateRegisterForm, validateEmail, validatePassword } from './authService';
export { default as userService, validateProfileData, validatePasswordChange } from './userService';
export { default as coursesService, validateCourseFilters, validateRating } from './coursesService';
export { default as fundingService, validateProjectData, validateContribution } from './fundingService';
export { default as searchService, validateSearchQuery, validateSearchFilters } from './searchService';
export { default as jobService, validateJobApplication, validateJobData } from './jobService';
export { default as applicationService, validateStatusUpdate, validateInterviewData, validateEvaluationData } from './applicationService';
export { default as projectService, validateProjectUpdate } from './projectService';
export { default as starService, validateStarData, validateSearchData, validateNewsData } from './starService';


// Configuration API
export { API_BASE_URL, ENDPOINTS, API_CONFIG, ERROR_CODES, ERROR_MESSAGES } from '../../config/api';

// Validateurs combinés
export const validators = {
  auth: {
    loginForm: validateLoginForm,
    registerForm: validateRegisterForm,
    email: validateEmail,
    password: validatePassword
  },
  user: {
    profileData: validateProfileData,
    passwordChange: validatePasswordChange
  },
  courses: {
    searchFilters: validateCourseFilters,
    rating: validateRating
  },
  funding: {
    projectData: validateProjectData,
    contribution: validateContribution
  },
  search: {
    query: validateSearchQuery,
    filters: validateSearchFilters
  }
};

// Utilitaires pour la gestion des erreurs
export const handleApiError = (error) => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    console.error('API Error:', error);
  }
  
  // Retourner un message d'erreur standardisé
  return {
    code: error.code || ERROR_CODES.SERVER_ERROR,
    message: error.message || ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR],
    status: error.status
  };
};

// Utilitaire pour formater les paramètres d'URL
export const formatUrlParams = (params) => {
  const filteredParams = {};
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      filteredParams[key] = value;
    }
  });
  
  return filteredParams;
};

// Utilitaire pour construire des URLs avec paramètres
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Remplacer les paramètres dans l'URL (ex: /users/:id)
  Object.keys(params).forEach(key => {
    if (url.includes(`:${key}`)) {
      url = url.replace(`:${key}`, params[key]);
      delete params[key];
    }
  });
  
  return url;
};

// Utilitaire pour la pagination
export const createPaginationInfo = (currentPage, totalPages, totalItems, itemsPerPage) => {
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

// Utilitaire pour debounce (recherche)
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Constantes utiles
export const SEARCH_DEBOUNCE_DELAY = 300; // ms
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Types de contenu pour la recherche
export const SEARCH_TYPES = {
  ALL: 'all',
  COURSES: 'courses',
  PROJECTS: 'projects',
  JOBS: 'jobs',
  STARS: 'stars'
};

// Statuts de chargement
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};