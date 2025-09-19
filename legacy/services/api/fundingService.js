import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

// Service de financement (FundingJerr)
class FundingService {
  // Récupérer les données de la page d'accueil
  async getFundingHome() {
    try {
      const response = await apiClient.get('/funding/home');
      
      return {
        success: true,
        stats: response.data.stats,
        categories: response.data.categories,
        featured: response.data.featured,
        trending: response.data.trending
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des données'
      };
    }
  }
  
  // Récupérer la liste des projets
  async getProjects(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.FUNDING.PROJECTS, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          category: params.category,
          status: params.status,
          sortBy: params.sortBy || 'trending',
          minGoal: params.minGoal,
          maxGoal: params.maxGoal
        }
      });
      
      return {
        success: true,
        projects: response.data.projects,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des projets'
      };
    }
  }
  
  // Récupérer les détails d'un projet
  async getProjectDetails(projectId) {
    try {
      const url = ENDPOINTS.FUNDING.PROJECT_DETAILS.replace(':id', projectId);
      const response = await apiClient.get(url);
      
      return {
        success: true,
        project: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du projet'
      };
    }
  }
  
  // Récupérer les projets en vedette
  async getFeaturedProjects() {
    try {
      const response = await apiClient.get(ENDPOINTS.FUNDING.FEATURED);
      
      return {
        success: true,
        projects: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des projets en vedette'
      };
    }
  }
  
  // Récupérer les projets tendance
  async getTrendingProjects() {
    try {
      const response = await apiClient.get(ENDPOINTS.FUNDING.TRENDING);
      
      return {
        success: true,
        projects: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des projets tendance'
      };
    }
  }
  
  // Récupérer les catégories
  async getCategories() {
    try {
      const response = await apiClient.get(ENDPOINTS.FUNDING.CATEGORIES);
      
      return {
        success: true,
        categories: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des catégories'
      };
    }
  }
  
  // Rechercher des projets
  async searchProjects(query, filters = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.FUNDING.SEARCH, {
        params: {
          q: query,
          category: filters.category,
          status: filters.status,
          minGoal: filters.minGoal,
          maxGoal: filters.maxGoal,
          location: filters.location,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        projects: response.data.projects,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche'
      };
    }
  }
  
  // Contribuer à un projet
  async contributeToProject(projectId, amount, message = '') {
    try {
      const url = ENDPOINTS.FUNDING.CONTRIBUTE.replace(':id', projectId);
      const response = await apiClient.post(url, {
        amount,
        message
      });
      
      return {
        success: true,
        contribution: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la contribution'
      };
    }
  }
  
  // Créer un nouveau projet
  async createProject(projectData) {
    try {
      const response = await apiClient.post(ENDPOINTS.FUNDING.PROJECTS, {
        title: projectData.title.trim(),
        description: projectData.description.trim(),
        goal: projectData.goal,
        category: projectData.category,
        duration: projectData.duration,
        images: projectData.images,
        rewards: projectData.rewards,
        story: projectData.story?.trim(),
        risks: projectData.risks?.trim()
      });
      
      return {
        success: true,
        project: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du projet'
      };
    }
  }
  
  // Mettre à jour un projet
  async updateProject(projectId, projectData) {
    try {
      const response = await apiClient.put(`/funding/projects/${projectId}`, projectData);
      
      return {
        success: true,
        project: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du projet'
      };
    }
  }
  
  // Récupérer les projets de l'utilisateur
  async getMyProjects() {
    try {
      const response = await apiClient.get('/funding/my-projects');
      
      return {
        success: true,
        projects: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de vos projets'
      };
    }
  }
  
  // Récupérer les contributions de l'utilisateur
  async getMyContributions() {
    try {
      const response = await apiClient.get('/funding/my-contributions');
      
      return {
        success: true,
        contributions: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de vos contributions'
      };
    }
  }
  
  // Suivre/Ne plus suivre un projet
  async toggleFollowProject(projectId) {
    try {
      const response = await apiClient.post(`/funding/projects/${projectId}/follow`);
      
      return {
        success: true,
        isFollowing: response.data.isFollowing
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du suivi du projet'
      };
    }
  }
}

// Validation des données de projet
export const validateProjectData = (projectData) => {
  const errors = {};
  
  // Validation titre
  if (!projectData.title?.trim()) {
    errors.title = 'Le titre est requis';
  } else if (projectData.title.trim().length < 10) {
    errors.title = 'Le titre doit contenir au moins 10 caractères';
  } else if (projectData.title.trim().length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères';
  }
  
  // Validation description
  if (!projectData.description?.trim()) {
    errors.description = 'La description est requise';
  } else if (projectData.description.trim().length < 50) {
    errors.description = 'La description doit contenir au moins 50 caractères';
  } else if (projectData.description.trim().length > 500) {
    errors.description = 'La description ne peut pas dépasser 500 caractères';
  }
  
  // Validation objectif
  if (!projectData.goal || typeof projectData.goal !== 'number') {
    errors.goal = 'L\'objectif financier est requis';
  } else if (projectData.goal < 100) {
    errors.goal = 'L\'objectif minimum est de 100€';
  } else if (projectData.goal > 1000000) {
    errors.goal = 'L\'objectif maximum est de 1,000,000€';
  }
  
  // Validation catégorie
  if (!projectData.category) {
    errors.category = 'La catégorie est requise';
  }
  
  // Validation durée
  if (!projectData.duration || typeof projectData.duration !== 'number') {
    errors.duration = 'La durée est requise';
  } else if (projectData.duration < 7) {
    errors.duration = 'La durée minimum est de 7 jours';
  } else if (projectData.duration > 90) {
    errors.duration = 'La durée maximum est de 90 jours';
  }
  
  // Validation images
  if (!projectData.images || !Array.isArray(projectData.images) || projectData.images.length === 0) {
    errors.images = 'Au moins une image est requise';
  } else if (projectData.images.length > 10) {
    errors.images = 'Maximum 10 images autorisées';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation de la contribution
export const validateContribution = (amount, message = '') => {
  const errors = {};
  
  // Validation montant
  if (!amount || typeof amount !== 'number') {
    errors.amount = 'Le montant est requis';
  } else if (amount < 1) {
    errors.amount = 'Le montant minimum est de 1€';
  } else if (amount > 10000) {
    errors.amount = 'Le montant maximum est de 10,000€';
  }
  
  // Validation message (optionnel)
  if (message && typeof message === 'string' && message.length > 500) {
    errors.message = 'Le message ne peut pas dépasser 500 caractères';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Instance unique du service
const fundingService = new FundingService();
export default fundingService;