import apiClient, { saveAuthData, clearAuthData } from './apiClient';
import { ENDPOINTS } from '../../config/api';

// Service d'authentification
class AuthService {
  // Connexion utilisateur
  async login(email, password, rememberMe = false) {
    console.log('authService.login called with:', { email, password: password ? '[HIDDEN]' : undefined });
    console.log('authService.login - typeof email:', typeof email);
    console.log('authService.login - email value:', email);
    console.log('authService.login - rememberMe:', rememberMe);
    
    if (!email) {
      console.log('authService.login - Email is missing');
      throw new Error('Adresse email requise');
    }
    
    console.log('authService.login - About to call toLowerCase on:', email);
    const emailLower = email.toLowerCase();
    console.log('authService.login - Email after toLowerCase:', emailLower);
    
    const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, {
      email: emailLower.trim(),
      password,
      rememberMe,
      // Compatibilité avec API qui pourrait attendre snake_case
      remember_me: rememberMe
    });
    
    console.log('authService.login - Full response:', response.data);
    
    // La réponse a la structure: { data: { tokens: {...}, user: {...} } }
    const { tokens, user } = response.data.data;
    
    if (!tokens || !tokens.accessToken) {
      console.error('authService.login - Tokens manquants dans la réponse:', response.data);
      throw new Error('Réponse d\'authentification invalide');
    }
    
    const { accessToken, refreshToken } = tokens;
    
    // Sauvegarder les données d'authentification
    await saveAuthData(accessToken, refreshToken, user);
    
    return {
      success: true,
      user,
      accessToken,
      refreshToken
    };
  }
  
  // Inscription utilisateur
  async register(userData) {
    try {
      if (!userData.email) {
        return {
          success: false,
          error: 'Adresse email requise'
        };
      }
      
      // Créer FormData si une image de profil est fournie
      let requestData;
      let headers = {};
      
      if (userData.profileImage) {
        requestData = new FormData();
        requestData.append('firstName', userData.firstName.trim());
        requestData.append('lastName', userData.lastName.trim());
        requestData.append('email', userData.email.toLowerCase().trim());
        requestData.append('password', userData.password);
        requestData.append('confirmPassword', userData.confirmPassword);
        
        // Ajouter l'image de profil
        const imageUri = userData.profileImage;
        const filename = imageUri.split('/').pop();
        const match = /\.([\w\d_-]+)(\?.*)?$/i.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        requestData.append('profileImage', {
          uri: imageUri,
          type,
          name: filename || 'profile.jpg'
        });
        
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        requestData = {
          firstName: userData.firstName.trim(),
          lastName: userData.lastName.trim(),
          email: userData.email.toLowerCase().trim(),
          password: userData.password,
          confirmPassword: userData.confirmPassword
        };
      }
      
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, requestData, {
        headers
      });
      
      // Le backend renvoie: { success: true, message: "...", data: { user: {...} } }
      const { data, message } = response.data;
      const user = data?.user;
      
      // Lors de l'inscription, pas de tokens - l'utilisateur doit vérifier son email
      // Les tokens seront fournis après vérification de l'email
      
      return {
        success: true,
        user: user,
        message: message || 'Inscription réussie. Veuillez vérifier votre email.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription'
      };
    }
  }
  
  // Déconnexion utilisateur
  async logout() {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.warn('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Toujours nettoyer les données locales
      await clearAuthData();
      return { success: true };
    }
  }
  
  // Mot de passe oublié
  async forgotPassword(email) {
    try {
      if (!email) {
        return {
          success: false,
          error: 'Adresse email requise'
        };
      }
      
      const response = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: email.toLowerCase().trim()
      });
      
      return {
        success: true,
        message: response.data.message || 'Email de réinitialisation envoyé'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'email'
      };
    }
  }
  
  // Réinitialisation du mot de passe
  async resetPassword(token, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
        confirmPassword
      });
      
      return {
        success: true,
        message: response.data.message || 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la réinitialisation'
      };
    }
  }
  
  // Vérification d'email
  async verifyEmail(code, email) {
    console.log('authService.verifyEmail called with:', { code, email });
    console.log('authService.verifyEmail - typeof email:', typeof email);
    console.log('authService.verifyEmail - email value:', email);
    
    try {
      if (!email || typeof email !== 'string' || email.trim() === '') {
        console.error('authService.verifyEmail - Email validation failed:', { email, type: typeof email });
        return {
          success: false,
          error: 'Adresse email requise'
        };
      }
      
      if (!code || typeof code !== 'string' || code.trim() === '') {
        console.error('authService.verifyEmail - Code validation failed:', { code, type: typeof code });
        return {
          success: false,
          error: 'Code de vérification requis'
        };
      }
      
      console.log('authService.verifyEmail - About to call toLowerCase on:', email);
      // Vérification supplémentaire avant toLowerCase pour éviter l'erreur
      if (!email || typeof email !== 'string') {
        console.error('authService.verifyEmail - Email is not a valid string before toLowerCase:', { email, type: typeof email });
        return {
          success: false,
          error: 'Adresse email invalide'
        };
      }
      const emailLower = email.toLowerCase();
      console.log('authService.verifyEmail - Email after toLowerCase:', emailLower);
      
      const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, {
        code,
        email: emailLower.trim()
      });
      
      const { tokens, user } = response.data.data;
      
      // Sauvegarder les données d'authentification si des tokens sont fournis
      if (tokens && tokens.accessToken && tokens.refreshToken && user) {
        const { accessToken, refreshToken } = tokens;
        await saveAuthData(accessToken, refreshToken, user);
      }
      
      return {
        success: true,
        message: response.data.message || 'Email vérifié avec succès',
        user: user,
        accessToken: tokens?.accessToken,
        refreshToken: tokens?.refreshToken
      };
    } catch (error) {
      console.error('Erreur lors de la vérification email:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la vérification'
      };
    }
  }
  
  // Renvoyer l'email de vérification
  async resendVerificationEmail(email) {
    try {
      if (!email) {
        return {
          success: false,
          error: 'Adresse email requise'
        };
      }
      
      const response = await apiClient.post(ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        email: email.toLowerCase().trim()
      });
      
      return {
        success: true,
        message: response.data.message || 'Email de vérification renvoyé'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du renvoi de l\'email'
      };
    }
  }
  
  // Changement de mot de passe
  async changePassword(currentPassword, newPassword, confirmPassword) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmPassword
      });
      
      return {
        success: true,
        message: response.data.message || 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du changement de mot de passe'
      };
    }
  }
  
  // Refresh du token
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
        refreshToken
      });
      
      const { accessToken, refreshToken: newRefreshToken, user } = response.data;
      
      // Sauvegarder les nouvelles données
      await saveAuthData(accessToken, newRefreshToken, user);
      
      return {
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        user
      };
    } catch (error) {
      // En cas d'erreur, nettoyer les données locales
      await clearAuthData();
      return {
        success: false,
        error: error.message || 'Erreur lors du refresh'
      };
    }
  }
  
  // Connexion sociale (Google, Apple, Twitter)
  async socialLogin(provider, token) {
    try {
      const response = await apiClient.post(`/auth/social/${provider}`, {
        token
      });
      
      const { accessToken, refreshToken, user } = response.data;
      
      // Sauvegarder les données d'authentification
      await saveAuthData(accessToken, refreshToken, user);
      
      return {
        success: true,
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || `Erreur lors de la connexion ${provider}`
      };
    }
  }
  
  // Vérification du statut d'authentification
  // Récupérer les informations de l'utilisateur connecté
  async getMe() {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.GET_ME);
      
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        user: null,
        error: error.message || 'Erreur lors de la récupération des données utilisateur'
      };
    }
  }

  // Vérifier le statut d'authentification (alias pour getMe)
  async checkAuthStatus() {
    return await this.getMe();
  }
}

// Validation côté client
export const validateLoginForm = (email, password) => {
  const errors = {};
  
  // Validation email
  if (!email) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Format d\'email invalide';
  }
  
  // Validation mot de passe
  if (!password) {
    errors.password = 'Le mot de passe est requis';
  } else if (password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (userData) => {
  const errors = {};
  
  // Validation prénom
  if (!userData.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  } else if (userData.firstName.trim().length < 2) {
    errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
  }
  
  // Validation nom
  if (!userData.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  } else if (userData.lastName.trim().length < 2) {
    errors.lastName = 'Le nom doit contenir au moins 2 caractères';
  }
  
  // Validation email
  if (!userData.email) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    errors.email = 'Format d\'email invalide';
  }
  
  // Validation mot de passe
  if (!userData.password) {
    errors.password = 'Le mot de passe est requis';
  } else if (userData.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
    errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
  }
  
  // Validation confirmation mot de passe
  if (!userData.confirmPassword) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise';
  } else if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'L\'email est requis' };
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { isValid: false, error: 'Format d\'email invalide' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password, confirmPassword = null) => {
  const errors = {};
  
  if (!password) {
    errors.password = 'Le mot de passe est requis';
  } else if (password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
  }
  
  if (confirmPassword !== null) {
    if (!confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Instance unique du service
const authService = new AuthService();
export default authService;