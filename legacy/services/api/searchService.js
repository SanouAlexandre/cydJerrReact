import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

// Service de recherche globale
class SearchService {
  // Recherche globale dans toute l'application
  async globalSearch(query, filters = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH.GLOBAL, {
        params: {
          q: query,
          types: filters.types, // ['courses', 'projects', 'jobs', 'apps', 'stars']
          category: filters.category,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        results: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total,
        suggestions: response.data.suggestions
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche'
      };
    }
  }
  
  // Récupérer les suggestions de recherche
  async getSearchSuggestions(query) {
    try {
      const response = await apiClient.get(ENDPOINTS.SEARCH.SUGGESTIONS, {
        params: { q: query }
      });
      
      return {
        success: true,
        suggestions: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des suggestions'
      };
    }
  }
  
  // Recherche dans les cours
  async searchCourses(query, filters = {}) {
    try {
      const response = await apiClient.get('/search/courses', {
        params: {
          q: query,
          category: filters.category,
          level: filters.level,
          price: filters.price,
          rating: filters.rating,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        courses: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche de cours'
      };
    }
  }
  
  // Recherche dans les projets de financement
  async searchProjects(query, filters = {}) {
    try {
      const response = await apiClient.get('/search/projects', {
        params: {
          q: query,
          category: filters.category,
          status: filters.status,
          minGoal: filters.minGoal,
          maxGoal: filters.maxGoal,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        projects: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche de projets'
      };
    }
  }
  
  // Recherche dans les emplois
  async searchJobs(query, filters = {}) {
    try {
      const response = await apiClient.get('/search/jobs', {
        params: {
          q: query,
          location: filters.location,
          type: filters.type, // 'full-time', 'part-time', 'contract', 'remote'
          experience: filters.experience,
          salary: filters.salary,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        jobs: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche d\'emplois'
      };
    }
  }
  
  // Recherche dans les applications
  async searchApps(query, filters = {}) {
    try {
      const response = await apiClient.get('/search/apps', {
        params: {
          q: query,
          category: filters.category,
          platform: filters.platform, // 'ios', 'android', 'web'
          price: filters.price, // 'free', 'paid'
          rating: filters.rating,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        apps: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche d\'applications'
      };
    }
  }
  
  // Recherche dans les célébrités
  async searchStars(query, filters = {}) {
    try {
      const response = await apiClient.get('/search/stars', {
        params: {
          q: query,
          category: filters.category,
          country: filters.country,
          verified: filters.verified,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        stars: response.data.results,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche de célébrités'
      };
    }
  }
  
  // Sauvegarder une recherche récente
  async saveRecentSearch(query, type) {
    try {
      await apiClient.post('/search/recent', {
        query,
        type
      });
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la sauvegarde'
      };
    }
  }
  
  // Récupérer les recherches récentes
  async getRecentSearches() {
    try {
      const response = await apiClient.get('/search/recent');
      
      return {
        success: true,
        searches: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des recherches récentes'
      };
    }
  }
  
  // Supprimer une recherche récente
  async deleteRecentSearch(searchId) {
    try {
      await apiClient.delete(`/search/recent/${searchId}`);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression'
      };
    }
  }
  
  // Récupérer les tendances de recherche
  async getTrendingSearches() {
    try {
      const response = await apiClient.get('/search/trending');
      
      return {
        success: true,
        trending: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tendances'
      };
    }
  }
}

// Validation des paramètres de recherche
export const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return {
      isValid: false,
      error: 'La requête de recherche est requise'
    };
  }
  
  const trimmedQuery = query.trim();
  
  if (trimmedQuery.length < 2) {
    return {
      isValid: false,
      error: 'La requête doit contenir au moins 2 caractères'
    };
  }
  
  if (trimmedQuery.length > 100) {
    return {
      isValid: false,
      error: 'La requête ne peut pas dépasser 100 caractères'
    };
  }
  
  return {
    isValid: true,
    query: trimmedQuery
  };
};

// Validation des filtres de recherche
export const validateSearchFilters = (filters, searchType) => {
  const validatedFilters = {};
  
  // Validation pagination
  if (filters.page && typeof filters.page === 'number' && filters.page > 0) {
    validatedFilters.page = filters.page;
  }
  
  if (filters.limit && typeof filters.limit === 'number' && filters.limit > 0 && filters.limit <= 100) {
    validatedFilters.limit = filters.limit;
  }
  
  // Validation spécifique selon le type de recherche
  switch (searchType) {
    case 'courses':
      const validCourseLevels = ['beginner', 'intermediate', 'advanced'];
      const validCoursePrices = ['free', 'paid', 'premium'];
      
      if (filters.level && validCourseLevels.includes(filters.level)) {
        validatedFilters.level = filters.level;
      }
      
      if (filters.price && validCoursePrices.includes(filters.price)) {
        validatedFilters.price = filters.price;
      }
      
      if (filters.rating && typeof filters.rating === 'number' && filters.rating >= 1 && filters.rating <= 5) {
        validatedFilters.rating = filters.rating;
      }
      break;
      
    case 'jobs':
      const validJobTypes = ['full-time', 'part-time', 'contract', 'remote'];
      const validExperienceLevels = ['entry', 'junior', 'mid', 'senior', 'lead'];
      
      if (filters.type && validJobTypes.includes(filters.type)) {
        validatedFilters.type = filters.type;
      }
      
      if (filters.experience && validExperienceLevels.includes(filters.experience)) {
        validatedFilters.experience = filters.experience;
      }
      
      if (filters.location && typeof filters.location === 'string') {
        validatedFilters.location = filters.location;
      }
      break;
      
    case 'apps':
      const validPlatforms = ['ios', 'android', 'web'];
      const validAppPrices = ['free', 'paid'];
      
      if (filters.platform && validPlatforms.includes(filters.platform)) {
        validatedFilters.platform = filters.platform;
      }
      
      if (filters.price && validAppPrices.includes(filters.price)) {
        validatedFilters.price = filters.price;
      }
      break;
  }
  
  // Validation catégorie (commune à tous les types)
  if (filters.category && typeof filters.category === 'string') {
    validatedFilters.category = filters.category;
  }
  
  return validatedFilters;
};

// Instance unique du service
const searchService = new SearchService();
export default searchService;