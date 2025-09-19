import apiClient from './apiClient';
import { ENDPOINTS, formatUrlParams, buildUrl } from '../../config/api';

/**
 * Service pour la gestion des offres d'emploi (JobJerr)
 */
class JobService {
  /**
   * Récupérer la liste des offres d'emploi
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Liste des offres d'emploi
   */
  async getJobs(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/jobs', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer une offre d'emploi par son slug
   * @param {string} slug - Slug de l'offre d'emploi
   * @returns {Promise} Détails de l'offre d'emploi
   */
  async getJobBySlug(slug) {
    try {
      const response = await apiClient.get(`/jobs/${slug}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Créer une nouvelle offre d'emploi (employeur)
   * @param {Object} jobData - Données de l'offre d'emploi
   * @returns {Promise} Offre d'emploi créée
   */
  async createJob(jobData) {
    try {
      const response = await apiClient.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mettre à jour une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @param {Object} jobData - Nouvelles données
   * @returns {Promise} Offre d'emploi mise à jour
   */
  async updateJob(jobId, jobData) {
    try {
      const response = await apiClient.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Supprimer une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de suppression
   */
  async deleteJob(jobId) {
    try {
      const response = await apiClient.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Postuler à une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @param {FormData} applicationData - Données de candidature (CV, lettre de motivation, etc.)
   * @returns {Promise} Confirmation de candidature
   */
  async applyToJob(jobId, applicationData) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/apply`, applicationData, {
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
   * Sauvegarder une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de sauvegarde
   */
  async saveJob(jobId) {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Retirer une offre d'emploi des favoris
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de suppression des favoris
   */
  async unsaveJob(jobId) {
    try {
      const response = await apiClient.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les offres d'emploi sauvegardées
   * @returns {Promise} Liste des offres sauvegardées
   */
  async getSavedJobs() {
    try {
      const response = await apiClient.get('/jobs/user/saved');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les offres d'emploi de l'employeur connecté
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des offres de l'employeur
   */
  async getEmployerJobs(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/jobs/employer/my-jobs', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Publier une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de publication
   */
  async publishJob(jobId) {
    try {
      const response = await apiClient.put(`/jobs/${jobId}/publish`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Dépublier une offre d'emploi
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de dépublication
   */
  async unpublishJob(jobId) {
    try {
      const response = await apiClient.put(`/jobs/${jobId}/unpublish`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Marquer une offre d'emploi comme pourvue
   * @param {string} jobId - ID de l'offre d'emploi
   * @returns {Promise} Confirmation de mise à jour
   */
  async markJobAsFilled(jobId) {
    try {
      const response = await apiClient.put(`/jobs/${jobId}/mark-filled`);
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
 * Validation des données de candidature
 * @param {Object} applicationData - Données de candidature
 * @returns {Object} Résultat de validation
 */
export const validateJobApplication = (applicationData) => {
  const errors = {};

  if (!applicationData.firstName?.trim()) {
    errors.firstName = 'Le prénom est requis';
  }

  if (!applicationData.lastName?.trim()) {
    errors.lastName = 'Le nom est requis';
  }

  if (!applicationData.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(applicationData.email)) {
    errors.email = 'Format d\'email invalide';
  }

  if (!applicationData.phone?.trim()) {
    errors.phone = 'Le numéro de téléphone est requis';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données d'offre d'emploi
 * @param {Object} jobData - Données de l'offre d'emploi
 * @returns {Object} Résultat de validation
 */
export const validateJobData = (jobData) => {
  const errors = {};

  if (!jobData.title?.trim()) {
    errors.title = 'Le titre est requis';
  }

  if (!jobData.description?.trim()) {
    errors.description = 'La description est requise';
  }

  if (!jobData.company?.name?.trim()) {
    errors.companyName = 'Le nom de l\'entreprise est requis';
  }

  if (!jobData.location?.country?.trim()) {
    errors.country = 'Le pays est requis';
  }

  if (!jobData.type) {
    errors.type = 'Le type de contrat est requis';
  }

  if (!jobData.category) {
    errors.category = 'La catégorie est requise';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default new JobService();