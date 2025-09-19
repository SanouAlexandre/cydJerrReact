import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_CONFIG, DEFAULT_HEADERS, ERROR_CODES, ERROR_MESSAGES } from '../../config/api';

// Création de l'instance axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: DEFAULT_HEADERS
});

// Clés pour le stockage local
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@cydjerr_access_token',
  REFRESH_TOKEN: '@cydjerr_refresh_token',
  USER_DATA: '@cydjerr_user_data'
};

// Intercepteur de requête - Ajouter le token d'authentification
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Log du token pour déboguer
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.log('🔑 Token found and added to request:', token.substring(0, 20) + '...');
        }
      } else {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.warn('⚠️ No token found in AsyncStorage');
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération du token:', error);
    }
    
    // Log des requêtes en développement
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        console.log('📤 Request Data:', config.data);
      }
      // Log des headers pour déboguer
      console.log('📋 Request Headers:', config.headers);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gestion des erreurs et refresh token
apiClient.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('📥 Response Data:', response.data);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log des erreurs en développement (sauf pour /auth/me qui est normal)
    // Commenté pour éviter l'affichage des erreurs sur l'écran mobile
    // if (typeof __DEV__ !== 'undefined' && __DEV__) {
    //   const url = error.config?.url || 'Unknown URL';
    //   // Ne pas afficher l'erreur pour /auth/me car c'est normal quand l'utilisateur n'est pas connecté
    //   if (!url.includes('/auth/me')) {
    //     console.error(`❌ API Error: ${error.response?.status || 'Network Error'} ${url}`);
    //     if (error.response?.data) {
    //       console.error('Error Details:', error.response.data);
    //     }
    //   }
    // }
    
    // Gestion du token expiré (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Tentative de refresh du token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Sauvegarder les nouveaux tokens
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          if (newRefreshToken) {
            await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }
          
          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Échec du refresh - déconnecter l'utilisateur
        await clearAuthData();
        // Ici, vous pourriez dispatcher une action Redux pour déconnecter l'utilisateur
        console.error('Échec du refresh token, déconnexion nécessaire');
      }
    }
    
    // Transformation des erreurs en format standardisé
    const transformedError = transformError(error);
    return Promise.reject(transformedError);
  }
);

// Fonction pour transformer les erreurs en format standardisé
const transformError = (error) => {
  let errorCode = ERROR_CODES.SERVER_ERROR;
  let message = ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
  
  if (!error.response) {
    // Erreur réseau
    errorCode = ERROR_CODES.NETWORK_ERROR;
    message = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
  } else {
    // Erreur HTTP
    const status = error.response.status;
    
    switch (status) {
      case 400:
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        message = error.response.data?.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR];
        break;
      case 401:
        errorCode = ERROR_CODES.UNAUTHORIZED;
        message = error.response.data?.message || ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED];
        break;
      case 403:
        errorCode = ERROR_CODES.FORBIDDEN;
        message = ERROR_MESSAGES[ERROR_CODES.FORBIDDEN];
        break;
      case 404:
        errorCode = ERROR_CODES.NOT_FOUND;
        message = ERROR_MESSAGES[ERROR_CODES.NOT_FOUND];
        break;
      case 408:
        errorCode = ERROR_CODES.TIMEOUT_ERROR;
        message = ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
        break;
      case 423:
        errorCode = ERROR_CODES.ACCOUNT_LOCKED;
        message = error.response.data?.message || ERROR_MESSAGES[ERROR_CODES.ACCOUNT_LOCKED];
        break;
      default:
        if (status >= 500) {
          errorCode = ERROR_CODES.SERVER_ERROR;
          message = ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
        }
    }
  }
  
  return {
    code: errorCode,
    message,
    status: error.response?.status,
    data: error.response?.data,
    originalError: error
  };
};

// Fonctions utilitaires pour la gestion des tokens
export const saveAuthData = async (accessToken, refreshToken, userData) => {
  try {
    const dataToSave = [];
    
    if (accessToken !== undefined && accessToken !== null) {
      dataToSave.push([STORAGE_KEYS.ACCESS_TOKEN, accessToken]);
    }
    
    if (refreshToken !== undefined && refreshToken !== null) {
      dataToSave.push([STORAGE_KEYS.REFRESH_TOKEN, refreshToken]);
    }
    
    if (userData !== undefined && userData !== null) {
      dataToSave.push([STORAGE_KEYS.USER_DATA, JSON.stringify(userData)]);
    }
    
    if (dataToSave.length > 0) {
      await AsyncStorage.multiSet(dataToSave);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
  }
};

export const getAuthData = async () => {
  try {
    const [[, accessToken], [, refreshToken], [, userData]] = await AsyncStorage.multiGet([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA
    ]);
    
    return {
      accessToken,
      refreshToken,
      userData: userData ? JSON.parse(userData) : null
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des données d\'authentification:', error);
    return { accessToken: null, refreshToken: null, userData: null };
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA
    ]);
  } catch (error) {
    console.error('Erreur lors de la suppression des données d\'authentification:', error);
  }
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
};

export default apiClient;