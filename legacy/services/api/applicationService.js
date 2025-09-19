import apiClient from './apiClient';
import { formatUrlParams } from '../../config/api';

/**
 * Service pour la gestion des candidatures
 */
class ApplicationService {
  /**
   * Récupérer la liste des candidatures (employeur/admin)
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Liste des candidatures
   */
  async getApplications(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/applications', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer une candidature par son ID
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise} Détails de la candidature
   */
  async getApplicationById(applicationId) {
    try {
      const response = await apiClient.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mettre à jour le statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {Object} statusData - Nouvelles données de statut
   * @returns {Promise} Candidature mise à jour
   */
  async updateApplicationStatus(applicationId, statusData) {
    try {
      const response = await apiClient.put(`/applications/${applicationId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Programmer un entretien
   * @param {string} applicationId - ID de la candidature
   * @param {Object} interviewData - Données de l'entretien
   * @returns {Promise} Entretien programmé
   */
  async scheduleInterview(applicationId, interviewData) {
    try {
      const response = await apiClient.post(`/applications/${applicationId}/interview`, interviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Ajouter une note à une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {Object} noteData - Données de la note
   * @returns {Promise} Note ajoutée
   */
  async addNote(applicationId, noteData) {
    try {
      const response = await apiClient.post(`/applications/${applicationId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Évaluer une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {Object} evaluationData - Données d'évaluation
   * @returns {Promise} Évaluation ajoutée
   */
  async evaluateApplication(applicationId, evaluationData) {
    try {
      const response = await apiClient.put(`/applications/${applicationId}/evaluation`, evaluationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Retirer une candidature (candidat)
   * @param {string} applicationId - ID de la candidature
   * @param {Object} withdrawData - Données de retrait
   * @returns {Promise} Confirmation de retrait
   */
  async withdrawApplication(applicationId, withdrawData = {}) {
    try {
      const response = await apiClient.put(`/applications/${applicationId}/withdraw`, withdrawData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les candidatures de l'utilisateur connecté
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Liste des candidatures de l'utilisateur
   */
  async getMyApplications(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/applications/my-applications', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupérer les statistiques des candidatures
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Statistiques des candidatures
   */
  async getApplicationStats(params = {}) {
    try {
      const filteredParams = formatUrlParams(params);
      const response = await apiClient.get('/applications/stats', { params: filteredParams });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Supprimer une candidature (admin uniquement)
   * @param {string} applicationId - ID de la candidature
   * @returns {Promise} Confirmation de suppression
   */
  async deleteApplication(applicationId) {
    try {
      const response = await apiClient.delete(`/applications/${applicationId}`);
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
 * Validation des données de mise à jour de statut
 * @param {Object} statusData - Données de statut
 * @returns {Object} Résultat de validation
 */
export const validateStatusUpdate = (statusData) => {
  const errors = {};
  const validStatuses = ['pending', 'shortlisted', 'interview_scheduled', 'rejected', 'hired', 'withdrawn'];

  if (!statusData.status) {
    errors.status = 'Le statut est requis';
  } else if (!validStatuses.includes(statusData.status)) {
    errors.status = 'Statut invalide';
  }

  if (statusData.reason && statusData.reason.length > 500) {
    errors.reason = 'La raison ne peut pas dépasser 500 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données d'entretien
 * @param {Object} interviewData - Données d'entretien
 * @returns {Object} Résultat de validation
 */
export const validateInterviewData = (interviewData) => {
  const errors = {};
  const validTypes = ['phone', 'video', 'in-person'];

  if (!interviewData.type) {
    errors.type = 'Le type d\'entretien est requis';
  } else if (!validTypes.includes(interviewData.type)) {
    errors.type = 'Type d\'entretien invalide';
  }

  if (!interviewData.scheduledAt) {
    errors.scheduledAt = 'La date d\'entretien est requise';
  } else {
    const scheduledDate = new Date(interviewData.scheduledAt);
    const now = new Date();
    if (scheduledDate <= now) {
      errors.scheduledAt = 'La date d\'entretien doit être dans le futur';
    }
  }

  if (interviewData.duration && (interviewData.duration < 15 || interviewData.duration > 480)) {
    errors.duration = 'La durée doit être entre 15 et 480 minutes';
  }

  if (interviewData.type === 'video' && !interviewData.meetingLink) {
    errors.meetingLink = 'Le lien de réunion est requis pour un entretien vidéo';
  }

  if (interviewData.type === 'in-person' && !interviewData.location) {
    errors.location = 'Le lieu est requis pour un entretien en personne';
  }

  if (interviewData.notes && interviewData.notes.length > 1000) {
    errors.notes = 'Les notes ne peuvent pas dépasser 1000 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validation des données d'évaluation
 * @param {Object} evaluationData - Données d'évaluation
 * @returns {Object} Résultat de validation
 */
export const validateEvaluationData = (evaluationData) => {
  const errors = {};

  if (!evaluationData.overallScore) {
    errors.overallScore = 'Le score global est requis';
  } else if (evaluationData.overallScore < 1 || evaluationData.overallScore > 10) {
    errors.overallScore = 'Le score global doit être entre 1 et 10';
  }

  // Validation des scores optionnels
  const optionalScores = ['technicalSkills', 'softSkills', 'experience', 'motivation', 'culturalFit'];
  optionalScores.forEach(score => {
    if (evaluationData[score] && (evaluationData[score] < 1 || evaluationData[score] > 10)) {
      errors[score] = `Le score ${score} doit être entre 1 et 10`;
    }
  });

  if (evaluationData.comments && evaluationData.comments.length > 1000) {
    errors.comments = 'Les commentaires ne peuvent pas dépasser 1000 caractères';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default new ApplicationService();