import apiClient from './apiClient';
import { ENDPOINTS } from '../../config/api';

// Service des cours (TeachJerr)
class CoursesService {
  // Récupérer la liste des cours
  async getCourses(params = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.COURSES.LIST, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          category: params.category,
          level: params.level,
          price: params.price,
          rating: params.rating,
          sortBy: params.sortBy || 'popularity'
        }
      });
      
      return {
        success: true,
        courses: response.data.courses,
        pagination: response.data.pagination,
        total: response.data.total
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des cours'
      };
    }
  }
  
  // Récupérer les détails d'un cours
  async getCourseDetails(courseId) {
    try {
      const url = ENDPOINTS.COURSES.DETAILS.replace(':id', courseId);
      const response = await apiClient.get(url);
      
      return {
        success: true,
        course: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du cours'
      };
    }
  }
  
  // Récupérer les cours best-sellers
  async getBestSellers() {
    try {
      const response = await apiClient.get(ENDPOINTS.COURSES.BESTSELLERS);
      
      return {
        success: true,
        courses: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des best-sellers'
      };
    }
  }
  
  // Récupérer les nouveaux cours
  async getNewCourses() {
    try {
      const response = await apiClient.get(ENDPOINTS.COURSES.NEW);
      
      return {
        success: true,
        courses: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des nouveaux cours'
      };
    }
  }
  
  // Récupérer les cours recommandés
  async getRecommendedCourses() {
    try {
      const response = await apiClient.get(ENDPOINTS.COURSES.RECOMMENDED);
      
      return {
        success: true,
        courses: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des cours recommandés'
      };
    }
  }
  
  // Rechercher des cours
  async searchCourses(query, filters = {}) {
    try {
      const response = await apiClient.get(ENDPOINTS.COURSES.SEARCH, {
        params: {
          q: query,
          category: filters.category,
          level: filters.level,
          price: filters.price,
          rating: filters.rating,
          duration: filters.duration,
          language: filters.language,
          page: filters.page || 1,
          limit: filters.limit || 20
        }
      });
      
      return {
        success: true,
        courses: response.data.courses,
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
  
  // S'inscrire à un cours
  async enrollCourse(courseId) {
    try {
      const url = ENDPOINTS.COURSES.ENROLL.replace(':id', courseId);
      const response = await apiClient.post(url);
      
      return {
        success: true,
        enrollment: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription au cours'
      };
    }
  }
  
  // Récupérer les cours de l'utilisateur
  async getMyCourses() {
    try {
      const response = await apiClient.get('/courses/my-courses');
      
      return {
        success: true,
        courses: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de vos cours'
      };
    }
  }
  
  // Marquer une leçon comme terminée
  async markLessonComplete(courseId, lessonId) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      
      return {
        success: true,
        progress: response.data.progress
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la validation de la leçon'
      };
    }
  }
  
  // Ajouter une note/avis sur un cours
  async rateCourse(courseId, rating, review) {
    try {
      const response = await apiClient.post(`/courses/${courseId}/rating`, {
        rating,
        review
      });
      
      return {
        success: true,
        rating: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout de la note'
      };
    }
  }
  
  // Récupérer les catégories de cours
  async getCategories() {
    try {
      const response = await apiClient.get('/courses/categories');
      
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
  
  // Récupérer les instructeurs populaires
  async getPopularInstructors() {
    try {
      const response = await apiClient.get('/courses/instructors/popular');
      
      return {
        success: true,
        instructors: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des instructeurs'
      };
    }
  }

  // Créer un nouveau cours
  async createCourse(courseData) {
    try {
      const response = await apiClient.post(ENDPOINTS.COURSES.CREATE, courseData);
      
      return {
        success: true,
        course: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du cours'
      };
    }
  }

  // Mettre à jour un cours
  async updateCourse(courseId, courseData) {
    try {
      const url = ENDPOINTS.COURSES.UPDATE.replace(':id', courseId);
      const response = await apiClient.put(url, courseData);
      
      return {
        success: true,
        course: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du cours'
      };
    }
  }

  // Supprimer un cours
  async deleteCourse(courseId) {
    try {
      const url = ENDPOINTS.COURSES.DELETE.replace(':id', courseId);
      const response = await apiClient.delete(url);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du cours'
      };
    }
  }

  // Télécharger une vignette de cours
  async uploadThumbnail(courseId, imageUri) {
    try {
      const formData = new FormData();
      formData.append('thumbnail', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'thumbnail.jpg'
      });
      
      const url = ENDPOINTS.COURSES.UPLOAD_THUMBNAIL.replace(':id', courseId);
      const response = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        thumbnailUrl: response.data.thumbnailUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du téléchargement de la vignette'
      };
    }
  }

  // Mettre à jour une vignette de cours
  async updateThumbnail(courseId, imageUri) {
    try {
      const formData = new FormData();
      formData.append('thumbnail', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'thumbnail.jpg'
      });
      
      const url = ENDPOINTS.COURSES.UPDATE_THUMBNAIL.replace(':id', courseId);
      const response = await apiClient.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        thumbnailUrl: response.data.thumbnailUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour de la vignette'
      };
    }
  }

  // Se désinscrire d'un cours
  async unenrollCourse(courseId) {
    try {
      const url = ENDPOINTS.COURSES.UNENROLL.replace(':id', courseId);
      const response = await apiClient.delete(url);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la désinscription du cours'
      };
    }
  }

  // Récupérer les cours de l'instructeur
  async getInstructorCourses(instructorId, params = {}) {
    try {
      const url = ENDPOINTS.COURSES.INSTRUCTOR_COURSES.replace(':instructorId', instructorId);
      const response = await apiClient.get(url, { params });
      
      return {
        success: true,
        courses: response.data.courses,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des cours de l\'instructeur'
      };
    }
  }

  // Publier un cours
  async publishCourse(courseId) {
    try {
      const url = ENDPOINTS.COURSES.PUBLISH.replace(':id', courseId);
      const response = await apiClient.put(url);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la publication du cours'
      };
    }
  }

  // Dépublier un cours
  async unpublishCourse(courseId) {
    try {
      const url = ENDPOINTS.COURSES.UNPUBLISH.replace(':id', courseId);
      const response = await apiClient.put(url);
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la dépublication du cours'
      };
    }
  }
}

// Validation des filtres de recherche
export const validateSearchFilters = (filters) => {
  const validatedFilters = {};
  
  // Validation catégorie
  if (filters.category && typeof filters.category === 'string') {
    validatedFilters.category = filters.category;
  }
  
  // Validation niveau
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  if (filters.level && validLevels.includes(filters.level)) {
    validatedFilters.level = filters.level;
  }
  
  // Validation prix
  const validPrices = ['free', 'paid', 'premium'];
  if (filters.price && validPrices.includes(filters.price)) {
    validatedFilters.price = filters.price;
  }
  
  // Validation note
  if (filters.rating && typeof filters.rating === 'number' && filters.rating >= 1 && filters.rating <= 5) {
    validatedFilters.rating = filters.rating;
  }
  
  // Validation durée
  const validDurations = ['short', 'medium', 'long']; // < 2h, 2-10h, > 10h
  if (filters.duration && validDurations.includes(filters.duration)) {
    validatedFilters.duration = filters.duration;
  }
  
  // Validation langue
  const validLanguages = ['fr', 'en', 'es', 'de'];
  if (filters.language && validLanguages.includes(filters.language)) {
    validatedFilters.language = filters.language;
  }
  
  // Validation pagination
  if (filters.page && typeof filters.page === 'number' && filters.page > 0) {
    validatedFilters.page = filters.page;
  }
  
  if (filters.limit && typeof filters.limit === 'number' && filters.limit > 0 && filters.limit <= 100) {
    validatedFilters.limit = filters.limit;
  }
  
  return validatedFilters;
};

// Validation de la note
export const validateRating = (rating, review) => {
  const errors = [];
  
  if (!rating || rating < 1 || rating > 5) {
    errors.push('La note doit être comprise entre 1 et 5');
  }
  
  if (review && review.length > 500) {
    errors.push('Le commentaire ne peut pas dépasser 500 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des données de cours
export const validateCourseData = (courseData) => {
  const errors = [];
  
  if (!courseData.title || courseData.title.trim().length < 3) {
    errors.push('Le titre doit contenir au moins 3 caractères');
  }
  
  if (!courseData.description || courseData.description.trim().length < 10) {
    errors.push('La description doit contenir au moins 10 caractères');
  }
  
  if (!courseData.category) {
    errors.push('La catégorie est obligatoire');
  }
  
  if (!courseData.level || !['beginner', 'intermediate', 'advanced'].includes(courseData.level)) {
    errors.push('Le niveau doit être débutant, intermédiaire ou avancé');
  }
  
  if (courseData.price && (courseData.price < 0 || courseData.price > 10000)) {
    errors.push('Le prix doit être entre 0 et 10000');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des paramètres d'instructeur
export const validateInstructorParams = (params) => {
  const errors = [];
  
  if (params.page && (params.page < 1 || !Number.isInteger(params.page))) {
    errors.push('Le numéro de page doit être un entier positif');
  }
  
  if (params.limit && (params.limit < 1 || params.limit > 100)) {
    errors.push('La limite doit être entre 1 et 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Instance unique du service
const coursesService = new CoursesService();
export default coursesService;