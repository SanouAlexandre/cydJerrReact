import apiClient from './apiClient';
import { formatUrlParams } from '../../config/api';

/**
 * Service pour la gestion des célébrités (StarJerr)
 */
class StarService {
  /**
   * Récupérer la liste des célébrités
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Liste des célébrités
   */
  async getStars(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/stars', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les célébrités tendances
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des célébrités tendances
   */
  async getTrendingStars(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/stars/trending', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les célébrités populaires par catégorie
   * @param {string} category - Catégorie de célébrités
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des célébrités populaires
   */
  async getPopularByCategory(category, params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get(`/stars/popular/${category}`, { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Rechercher des célébrités
   * @param {Object} searchData - Données de recherche
   * @returns {Promise} Résultats de recherche
   */
  async searchStars(searchData) {
    try {
      const response = await apiClient.post('/stars/search', searchData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer une célébrité par son slug
   * @param {string} slug - Slug de la célébrité
   * @returns {Promise} Détails de la célébrité
   */
  async getStarBySlug(slug) {
    try {
      const response = await apiClient.get(`/stars/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Créer une nouvelle célébrité (admin/modérateur)
   * @param {Object} starData - Données de la célébrité
   * @returns {Promise} Célébrité créée
   */
  async createStar(starData) {
    try {
      const response = await apiClient.post('/stars', starData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mettre à jour une célébrité
   * @param {string} starId - ID de la célébrité
   * @param {Object} starData - Nouvelles données
   * @returns {Promise} Célébrité mise à jour
   */
  async updateStar(starId, starData) {
    try {
      const response = await apiClient.put(`/stars/${starId}`, starData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Supprimer une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Confirmation de suppression
   */
  async deleteStar(starId) {
    try {
      const response = await apiClient.delete(`/stars/${starId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Télécharger une image pour une célébrité
   * @param {string} starId - ID de la célébrité
   * @param {FormData} imageData - Données de l'image
   * @returns {Promise} Réponse du téléchargement
   */
  async uploadImage(starId, imageData) {
    try {
      const response = await apiClient.post(`/stars/${starId}/upload-image`, imageData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les statistiques sociales d'une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Statistiques sociales
   */
  async getSocialStats(starId) {
    try {
      const response = await apiClient.get(`/stars/${starId}/social-stats`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les œuvres notables d'une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Œuvres notables
   */
  async getNotableWorks(starId) {
    try {
      const response = await apiClient.get(`/stars/${starId}/notable-works`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les actualités d'une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Actualités
   */
  async getNews(starId) {
    try {
      const response = await apiClient.get(`/stars/${starId}/news`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Vérifier une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Statut mis à jour
   */
  async verifyStar(starId) {
    try {
      const response = await apiClient.put(`/stars/${starId}/verify`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mettre en avant une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise} Statut mis à jour
   */
  async featureStar(starId) {
    try {
      const response = await apiClient.put(`/stars/${starId}/feature`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gestion des erreurs
   * @param {Error} error - Erreur à traiter
   * @returns {Error} Erreur formatée
   */
  handleError(error) {
    if (error.response) {
      // Erreur de réponse du serveur
      return {
        status: error.response.status,
        message: error.response.data?.message || 'Erreur serveur',
        data: error.response.data
      };
    } else if (error.request) {
      // Erreur de réseau
      return {
        status: 0,
        message: 'Erreur de connexion réseau',
        data: null
      };
    } else {
      // Autre erreur
      return {
        status: 0,
        message: error.message || 'Erreur inconnue',
        data: null
      };
    }
  }
}

/**
 * Validation des données de célébrité
 * @param {Object} starData - Données de la célébrité
 * @returns {Object} Résultat de validation
 */
export const validateStarData = (starData) => {
  const errors = {};
  const validCategories = ['actor', 'musician', 'athlete', 'influencer', 'politician', 'business', 'other'];

  if (!starData.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  }

  if (!starData.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  }

  if (!starData.category) {
    errors.category = 'La catégorie est requise';
  } else if (!validCategories.includes(starData.category)) {
    errors.category = 'Catégorie invalide';
  }

  if (!starData.nationality?.trim()) {
    errors.nationality = 'La nationalité est requise';
  }

  if (!starData.dateOfBirth) {
    errors.dateOfBirth = 'La date de naissance est requise';
  } else {
    const birthDate = new Date(starData.dateOfBirth);
    const now = new Date();
    if (birthDate >= now) {
      errors.dateOfBirth = 'La date de naissance doit être dans le passé';
    }
  }

  if (starData.biography && starData.biography.length > 2000) {
    errors.biography = 'La biographie ne peut pas dépasser 2000 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données de recherche
 * @param {Object} searchData - Données de recherche
 * @returns {Object} Résultat de validation
 */
export const validateSearchData = (searchData) => {
  const errors = {};

  if (!searchData.query?.trim()) {
    errors.query = 'La requête de recherche est requise';
  }

  if (searchData.page && searchData.page < 1) {
    errors.page = 'Le numéro de page doit être supérieur à 0';
  }

  if (searchData.limit && (searchData.limit < 1 || searchData.limit > 100)) {
    errors.limit = 'La limite doit être entre 1 et 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données d'actualité
 * @param {Object} newsData - Données de l'actualité
 * @returns {Object} Résultat de validation
 */
export const validateNewsData = (newsData) => {
  const errors = {};
  const validTypes = ['general', 'career', 'personal', 'achievement', 'controversy'];

  if (!newsData.title?.trim()) {
    errors.title = 'Le titre de l\'actualité est requis';
  }

  if (!newsData.content?.trim()) {
    errors.content = 'Le contenu de l\'actualité est requis';
  }

  if (newsData.type && !validTypes.includes(newsData.type)) {
    errors.type = 'Type d\'actualité invalide';
  }

  if (newsData.source && !/^https?:\/\/.+/.test(newsData.source)) {
    errors.source = 'URL de source invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default new StarService();