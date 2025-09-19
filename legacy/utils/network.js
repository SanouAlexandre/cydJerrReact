// Utilitaires réseau pour la gestion des connexions et erreurs

import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { ERROR_CODES, ERROR_MESSAGES } from '../config/api';

// État de la connexion réseau
let isConnected = true;
let connectionType = 'unknown';
let isInternetReachable = true;

// Listeners pour les changements de connexion
const connectionListeners = new Set();

// Initialiser la surveillance de la connexion
export const initializeNetworkMonitoring = () => {
  const unsubscribe = NetInfo.addEventListener(state => {
    const wasConnected = isConnected;
    isConnected = state.isConnected;
    connectionType = state.type;
    isInternetReachable = state.isInternetReachable;
    
    // Notifier les listeners si l'état a changé
    if (wasConnected !== isConnected) {
      connectionListeners.forEach(listener => {
        try {
          listener({
            isConnected,
            connectionType,
            isInternetReachable,
            wasConnected
          });
        } catch (error) {
          console.error('Erreur dans le listener de connexion:', error);
        }
      });
    }
  });
  
  return unsubscribe;
};

// Ajouter un listener pour les changements de connexion
export const addConnectionListener = (listener) => {
  connectionListeners.add(listener);
  
  // Retourner une fonction pour supprimer le listener
  return () => {
    connectionListeners.delete(listener);
  };
};

// Vérifier l'état de la connexion
export const getConnectionState = () => {
  return {
    isConnected,
    connectionType,
    isInternetReachable
  };
};

// Vérifier si on est connecté
export const isNetworkConnected = () => {
  return isConnected && isInternetReachable;
};

// Vérifier le type de connexion
export const getConnectionType = () => {
  return connectionType;
};

// Vérifier si on est sur WiFi
export const isWiFiConnection = () => {
  return connectionType === 'wifi';
};

// Vérifier si on est sur données mobiles
export const isCellularConnection = () => {
  return connectionType === 'cellular';
};

// Attendre que la connexion soit rétablie
export const waitForConnection = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    if (isNetworkConnected()) {
      resolve(true);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      removeListener();
      reject(new Error('Timeout: connexion non rétablie'));
    }, timeout);
    
    const removeListener = addConnectionListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        clearTimeout(timeoutId);
        removeListener();
        resolve(true);
      }
    });
  });
};

// Retry avec backoff exponentiel
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Si c'est la dernière tentative, lancer l'erreur
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Vérifier si c'est une erreur réseau
      if (isNetworkError(error)) {
        // Attendre que la connexion soit rétablie
        try {
          await waitForConnection(5000);
        } catch (connectionError) {
          // Continuer même si la connexion n'est pas rétablie
        }
      }
      
      // Calculer le délai avec backoff exponentiel
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Vérifier si c'est une erreur réseau
export const isNetworkError = (error) => {
  if (!error) return false;
  
  // Erreurs de connexion communes
  const networkErrorCodes = [
    'NETWORK_ERROR',
    'TIMEOUT',
    'CONNECTION_FAILED',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ECONNRESET',
    'ETIMEDOUT'
  ];
  
  // Vérifier le code d'erreur
  if (error.code && networkErrorCodes.includes(error.code)) {
    return true;
  }
  
  // Vérifier le message d'erreur
  const message = error.message?.toLowerCase() || '';
  const networkMessages = [
    'network error',
    'connection failed',
    'timeout',
    'no internet',
    'offline',
    'unreachable'
  ];
  
  return networkMessages.some(msg => message.includes(msg));
};

// Vérifier si c'est une erreur de timeout
export const isTimeoutError = (error) => {
  if (!error) return false;
  
  const message = error.message?.toLowerCase() || '';
  const code = error.code?.toLowerCase() || '';
  
  return message.includes('timeout') || 
         code.includes('timeout') || 
         code === 'etimedout';
};

// Vérifier si c'est une erreur serveur
export const isServerError = (error) => {
  if (!error) return false;
  
  const status = error.status || error.response?.status;
  return status >= 500 && status < 600;
};

// Vérifier si c'est une erreur client
export const isClientError = (error) => {
  if (!error) return false;
  
  const status = error.status || error.response?.status;
  return status >= 400 && status < 500;
};

// Formater une erreur réseau
export const formatNetworkError = (error) => {
  if (!error) {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
      type: 'unknown'
    };
  }
  
  // Erreur de connexion
  if (!isNetworkConnected()) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Aucune connexion internet disponible',
      type: 'connection'
    };
  }
  
  // Erreur de timeout
  if (isTimeoutError(error)) {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: 'La requête a expiré. Veuillez réessayer.',
      type: 'timeout'
    };
  }
  
  // Erreur serveur
  if (isServerError(error)) {
    return {
      code: ERROR_CODES.SERVER_ERROR,
      message: 'Erreur du serveur. Veuillez réessayer plus tard.',
      type: 'server'
    };
  }
  
  // Erreur client
  if (isClientError(error)) {
    const status = error.status || error.response?.status;
    
    switch (status) {
      case 400:
        return {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Données invalides',
          type: 'validation'
        };
      case 401:
        return {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Non autorisé. Veuillez vous reconnecter.',
          type: 'auth'
        };
      case 403:
        return {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Accès interdit',
          type: 'auth'
        };
      case 404:
        return {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Ressource non trouvée',
          type: 'notfound'
        };
      case 429:
        return {
          code: ERROR_CODES.RATE_LIMIT,
          message: 'Trop de requêtes. Veuillez patienter.',
          type: 'ratelimit'
        };
      default:
        return {
          code: ERROR_CODES.CLIENT_ERROR,
          message: error.message || 'Erreur client',
          type: 'client'
        };
    }
  }
  
  // Erreur réseau générique
  if (isNetworkError(error)) {
    return {
      code: ERROR_CODES.NETWORK_ERROR,
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      type: 'network'
    };
  }
  
  // Erreur inconnue
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: error.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    type: 'unknown'
  };
};

// Afficher une alerte d'erreur réseau
export const showNetworkErrorAlert = (error, onRetry = null) => {
  const formattedError = formatNetworkError(error);
  
  const buttons = [];
  
  if (onRetry) {
    buttons.push({
      text: 'Réessayer',
      onPress: onRetry
    });
  }
  
  buttons.push({
    text: 'OK',
    style: 'cancel'
  });
  
  Alert.alert(
    'Erreur de connexion',
    formattedError.message,
    buttons
  );
};

// Créer un wrapper pour les requêtes avec gestion d'erreur automatique
export const createNetworkRequest = (requestFn, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    showErrorAlert = false,
    onError = null
  } = options;
  
  return async (...args) => {
    try {
      // Vérifier la connexion avant de faire la requête
      if (!isNetworkConnected()) {
        throw new Error('Aucune connexion internet');
      }
      
      return await retryWithBackoff(
        () => requestFn(...args),
        maxRetries,
        baseDelay
      );
    } catch (error) {
      const formattedError = formatNetworkError(error);
      
      if (onError) {
        onError(formattedError);
      }
      
      if (showErrorAlert) {
        showNetworkErrorAlert(error);
      }
      
      throw formattedError;
    }
  };
};

// Utilitaire pour télécharger un fichier avec gestion d'erreur
export const downloadWithRetry = async (url, options = {}) => {
  const {
    maxRetries = 3,
    onProgress = null,
    timeout = 30000
  } = options;
  
  return retryWithBackoff(async () => {
    if (!isNetworkConnected()) {
      throw new Error('Aucune connexion internet');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;
      
      const reader = response.body.getReader();
      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress && total > 0) {
          onProgress({
            loaded,
            total,
            percentage: Math.round((loaded / total) * 100)
          });
        }
      }
      
      clearTimeout(timeoutId);
      
      // Combiner tous les chunks
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, maxRetries);
};

// Utilitaire pour upload avec gestion d'erreur
export const uploadWithRetry = async (url, data, options = {}) => {
  const {
    maxRetries = 3,
    onProgress = null,
    timeout = 60000,
    headers = {}
  } = options;
  
  return retryWithBackoff(async () => {
    if (!isNetworkConnected()) {
      throw new Error('Aucune connexion internet');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }, maxRetries);
};

// Constantes utiles
export const CONNECTION_TYPES = {
  WIFI: 'wifi',
  CELLULAR: 'cellular',
  BLUETOOTH: 'bluetooth',
  ETHERNET: 'ethernet',
  WIMAX: 'wimax',
  VPN: 'vpn',
  NONE: 'none',
  UNKNOWN: 'unknown'
};

export const NETWORK_STATES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  UNKNOWN: 'unknown'
};