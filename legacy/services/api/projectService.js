import apiClient from './apiClient';
import { formatUrlParams } from '../../config/api';

/**
 * Service pour la gestion des projets de financement participatif
 */
class ProjectService {
  /**
   * Récupérer la liste des projets
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Liste des projets
   */
  async getProjects(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/projects', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer un projet par son slug
   * @param {string} slug - Slug du projet
   * @returns {Promise} Détails du projet
   */
  async getProjectBySlug(slug) {
    try {
      const response = await apiClient.get(`/projects/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Créer un nouveau projet
   * @param {Object} projectData - Données du projet
   * @returns {Promise} Projet créé
   */
  async createProject(projectData) {
    try {
      const response = await apiClient.post('/projects', projectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mettre à jour un projet
   * @param {string} projectId - ID du projet
   * @param {Object} projectData - Nouvelles données
   * @returns {Promise} Projet mis à jour
   */
  async updateProject(projectId, projectData) {
    try {
      const response = await apiClient.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Supprimer un projet
   * @param {string} projectId - ID du projet
   * @returns {Promise} Confirmation de suppression
   */
  async deleteProject(projectId) {
    try {
      const response = await apiClient.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Uploader des images pour un projet
   * @param {string} projectId - ID du projet
   * @param {FormData} imageData - Données des images
   * @returns {Promise} Images uploadées
   */
  async uploadProjectImages(projectId, imageData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/images`, imageData, {
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
   * Contribuer à un projet
   * @param {string} projectId - ID du projet
   * @param {Object} contributionData - Données de contribution
   * @returns {Promise} Contribution créée
   */
  async contributeToProject(projectId, contributionData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/contribute`, contributionData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les contributions d'un projet (admin)
   * @param {string} projectId - ID du projet
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des contributions
   */
  async getProjectContributions(projectId, params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get(`/projects/${projectId}/contributions`, { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Ajouter une mise à jour au projet
   * @param {string} projectId - ID du projet
   * @param {Object} updateData - Données de la mise à jour
   * @returns {Promise} Mise à jour ajoutée
   */
  async addProjectUpdate(projectId, updateData) {
    try {
      const response = await apiClient.post(`/projects/${projectId}/updates`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lancer un projet (le rendre public)
   * @param {string} projectId - ID du projet
   * @returns {Promise} Projet lancé
   */
  async launchProject(projectId) {
    try {
      const response = await apiClient.put(`/projects/${projectId}/launch`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les projets de l'utilisateur connecté
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des projets de l'utilisateur
   */
  async getMyProjects(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/projects/user/my-projects', { params: filteredParams });
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
 * Validation des données de projet
 * @param {Object} projectData - Données du projet
 * @returns {Object} Résultat de validation
 */
export const validateProjectData = (projectData) => {
  const errors = {};

  if (!projectData.title?.trim()) {
    errors.title = 'Le titre est requis';
  }

  if (!projectData.description?.trim()) {
    errors.description = 'La description est requise';
  }

  if (!projectData.goalAmount || projectData.goalAmount <= 0) {
    errors.goalAmount = 'Le montant objectif doit être supérieur à 0';
  }

  if (!projectData.category?.trim()) {
    errors.category = 'La catégorie est requise';
  }

  if (!projectData.endDate) {
    errors.endDate = 'La date de fin est requise';
  } else {
    const endDate = new Date(projectData.endDate);
    const now = new Date();
    if (endDate <= now) {
      errors.endDate = 'La date de fin doit être dans le futur';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données de contribution
 * @param {Object} contributionData - Données de contribution
 * @returns {Object} Résultat de validation
 */
export const validateContribution = (contributionData) => {
  const errors = {};
  const validPaymentMethods = ['stripe', 'paypal'];

  if (!contributionData.amount || contributionData.amount <= 0) {
    errors.amount = 'Le montant doit être supérieur à 0';
  }

  if (!contributionData.paymentMethod) {
    errors.paymentMethod = 'La méthode de paiement est requise';
  } else if (!validPaymentMethods.includes(contributionData.paymentMethod)) {
    errors.paymentMethod = 'Méthode de paiement invalide';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données de mise à jour
 * @param {Object} updateData - Données de mise à jour
 * @returns {Object} Résultat de validation
 */
export const validateProjectUpdate = (updateData) => {
  const errors = {};

  if (!updateData.title?.trim()) {
    errors.title = 'Le titre de la mise à jour est requis';
  }

  if (!updateData.content?.trim()) {
    errors.content = 'Le contenu de la mise à jour est requis';
  }

  if (updateData.content && updateData.content.length > 5000) {
    errors.content = 'Le contenu ne peut pas dépasser 5000 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default new ProjectService();