import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

// Service utilisateur
class UserService {
  // Récupérer le profil utilisateur
  async getProfile() {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.PROFILE);
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du profil'
      };
    }
  }
  
  // Mettre à jour le profil utilisateur
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.UPDATE_PROFILE, {
        firstName: profileData.firstName?.trim(),
        lastName: profileData.lastName?.trim(),
        email: profileData.email?.toLowerCase().trim(),
        phone: profileData.phone?.trim(),
        bio: profileData.bio?.trim(),
        location: profileData.location?.trim(),
        website: profileData.website?.trim(),
        dateOfBirth: profileData.dateOfBirth,
        preferences: profileData.preferences
      });
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du profil'
      };
    }
  }
  
  // Upload d'avatar
  async uploadAvatar(imageUri) {
    try {
      const formData = new FormData();
      
      // Pour React Native/Expo, il faut utiliser cette structure
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg'
      });
      
      const response = await apiClient.post(ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 secondes pour l'upload de fichiers
        transformRequest: (data, headers) => {
          // Laisser axios gérer la transformation pour FormData
          return data;
        }
      });
      
      return {
        success: true,
        avatar: response.data.data.avatar
      };
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      throw new Error(error.message || 'Erreur lors de l\'upload de l\'avatar');
    }
  }

  // Mettre à jour l'avatar
  async updateAvatar(imageUri) {
    try {
      const formData = new FormData();
      
      // Pour React Native/Expo, il faut utiliser cette structure
      formData.append('avatar', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg'
      });
      
      const response = await apiClient.put(ENDPOINTS.USERS.UPDATE_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 secondes pour l'upload de fichiers
        transformRequest: (data, headers) => {
          // Laisser axios gérer la transformation pour FormData
          return data;
        }
      });
      
      return {
        success: true,
        avatar: response.data.data.avatar
      };
    } catch (error) {
      throw new Error(error.message || 'Erreur lors de la mise à jour de l\'avatar');
    }
  }

  // Supprimer l'avatar
  async deleteAvatar() {
    try {
      const response = await apiClient.delete(ENDPOINTS.USERS.DELETE_AVATAR);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression de l\'avatar'
      };
    }
  }

  // Changer l'email
  async changeEmail(newEmail, password) {
    try {
      if (!newEmail) {
        return {
          success: false,
          error: 'Nouvelle adresse email requise'
        };
      }
      
      const response = await apiClient.put(ENDPOINTS.USERS.CHANGE_EMAIL, {
        newEmail: newEmail.toLowerCase().trim(),
        password
      });
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du changement d\'email'
      };
    }
  }

  // Désactiver le compte
  async deactivateAccount() {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.DEACTIVATE_ACCOUNT);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la désactivation du compte'
      };
    }
  }

  // Réactiver le compte
  async reactivateAccount() {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.REACTIVATE_ACCOUNT);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la réactivation du compte'
      };
    }
  }

  // Récupérer les statistiques d'apprentissage
  async getLearningStats() {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.LEARNING_STATS);
      
      return {
        success: true,
        stats: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des statistiques'
      };
    }
  }

  // Récupérer l'historique d'activité
  async getActivityHistory(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.ACTIVITY_HISTORY, { params });
      
      return {
        success: true,
        activities: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de l\'historique'
      };
    }
  }

  // Fonctions admin - Récupérer tous les utilisateurs
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.LIST, { params });
      
      return {
        success: true,
        users: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des utilisateurs'
      };
    }
  }

  // Récupérer un utilisateur par ID (admin)
  async getUserById(userId) {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.GET_BY_ID.replace(':id', userId));
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de l\'utilisateur'
      };
    }
  }

  // Mettre à jour un utilisateur (admin)
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.UPDATE_USER.replace(':id', userId), userData);
      
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour de l\'utilisateur'
      };
    }
  }

  // Supprimer un utilisateur (admin)
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(ENDPOINTS.USERS.DELETE_USER.replace(':id', userId));
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression de l\'utilisateur'
      };
    }
  }
  
  // Récupérer les centres d'intérêt
  async getInterests() {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.GET_INTERESTS);
      return {
        success: true,
        interests: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des centres d\'intérêt'
      };
    }
  }
  
  // Mettre à jour les centres d'intérêt
  async updateInterests(interests) {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.UPDATE_INTERESTS, {
        interests
      });
      
      return {
        success: true,
        interests: response.data.interests
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour des centres d\'intérêt'
      };
    }
  }
  
  // Changer le mot de passe
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put('/users/change-password', {
        currentPassword,
        newPassword
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
  
  // Supprimer le compte
  async deleteAccount(password) {
    try {
      const response = await apiClient.delete('/users/account', {
        data: { password }
      });
      
      return {
        success: true,
        message: response.data.message || 'Compte supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du compte'
      };
    }
  }
  
  // Mettre à jour les préférences de notification
  async updateNotificationPreferences(preferences) {
    try {
      const response = await apiClient.put('/users/notification-preferences', {
        preferences
      });
      
      return {
        success: true,
        preferences: response.data.preferences
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour des préférences'
      };
    }
  }
  
  // Mettre à jour les paramètres de confidentialité
  async updatePrivacySettings(settings) {
    try {
      const response = await apiClient.put('/users/privacy-settings', {
        settings
      });
      
      return {
        success: true,
        settings: response.data.settings
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour des paramètres'
      };
    }
  }
}

// Validation des données de profil
export const validateProfileData = (profileData) => {
  const errors = {};
  
  // Validation prénom
  if (!profileData.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  } else if (profileData.firstName.trim().length < 2) {
    errors.firstName = 'Le prénom doit contenir au moins 2 caractères';
  }
  
  // Validation nom
  if (!profileData.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  } else if (profileData.lastName.trim().length < 2) {
    errors.lastName = 'Le nom doit contenir au moins 2 caractères';
  }
  
  // Validation email
  if (!profileData.email) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    errors.email = 'Format d\'email invalide';
  }
  
  // Validation téléphone (optionnel)
  if (profileData.phone && !/^[+]?[0-9\s\-\(\)]{10,}$/.test(profileData.phone)) {
    errors.phone = 'Format de téléphone invalide';
  }
  
  // Validation site web (optionnel)
  if (profileData.website && !/^https?:\/\/.+/.test(profileData.website)) {
    errors.website = 'L\'URL doit commencer par http:// ou https://';
  }
  
  // Validation bio (optionnel)
  if (profileData.bio && profileData.bio.length > 500) {
    errors.bio = 'La bio ne peut pas dépasser 500 caractères';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation du changement de mot de passe
export const validatePasswordChange = (currentPassword, newPassword, confirmPassword) => {
  const errors = {};
  
  // Validation mot de passe actuel
  if (!currentPassword) {
    errors.currentPassword = 'Le mot de passe actuel est requis';
  }
  
  // Validation nouveau mot de passe
  if (!newPassword) {
    errors.newPassword = 'Le nouveau mot de passe est requis';
  } else if (newPassword.length < 8) {
    errors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
    errors.newPassword = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
  }
  
  // Validation confirmation
  if (!confirmPassword) {
    errors.confirmPassword = 'La confirmation du mot de passe est requise';
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  // Vérifier que le nouveau mot de passe est différent de l'ancien
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = 'Le nouveau mot de passe doit être différent de l\'ancien';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Instance unique du service
const userService = new UserService();
export default userService;