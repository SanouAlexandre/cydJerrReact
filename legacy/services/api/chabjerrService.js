import apiClient from './apiClient';
import { ENDPOINTS, API_CONFIG } from '../../config/api';

/**
 * Service pour la gestion des contenus ChabJerr (vidéos, posts)
 */
class ChabJerrService {
  /**
   * Récupérer le flux de vidéos/posts ChabJerr
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Liste des posts/vidéos
   */
  async getFeed(params = {}) {
    try {
      const { page = 1, limit = 10, category, trending, shorts } = params;
      
      let queryParams = `page=${page}&limit=${limit}`;
      
      // Filtrer par catégorie si spécifiée
      if (category && category !== 'Tous') {
        queryParams += `&category=${encodeURIComponent(category)}`;
      }
      
      // Filtrer les contenus tendances
      if (trending) {
        queryParams += '&type=trending';
      }
      
      // Filtrer les shorts (vidéos courtes)
      if (shorts) {
        queryParams += '&type=video&duration=short';
      }
      
      const response = await apiClient.get(`${ENDPOINTS.POSTS.LIST}?${queryParams}`);
      
      return {
        success: true,
        posts: response.data.posts || response.data,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du flux'
      };
    }
  }

  /**
   * Récupérer les posts tendances
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Posts tendances
   */
  async getTrendingPosts(params = {}) {
    return this.getFeed({ ...params, trending: true });
  }

  /**
   * Récupérer les shorts (vidéos courtes)
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Shorts
   */
  async getShorts(params = {}) {
    return this.getFeed({ ...params, shorts: true });
  }

  /**
   * Récupérer les posts d'un utilisateur spécifique
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} params - Paramètres de pagination
   * @returns {Promise} Posts de l'utilisateur
   */
  async getUserPosts(userId, params = {}) {
    try {
      const { page = 1, limit = 10 } = params;
      const response = await apiClient.get(`${ENDPOINTS.POSTS.USER_POSTS.replace(':userId', userId)}?page=${page}&limit=${limit}`);
      
      return {
        success: true,
        posts: response.data.posts || response.data,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des posts utilisateur'
      };
    }
  }

  /**
   * Récupérer un post spécifique
   * @param {string} postId - ID du post
   * @returns {Promise} Détails du post
   */
  async getPost(postId) {
    try {
      const response = await apiClient.get(ENDPOINTS.POSTS.DETAILS.replace(':id', postId));
      
      return {
        success: true,
        post: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du post'
      };
    }
  }

  /**
   * Créer un nouveau post/vidéo
   * @param {Object} postData - Données du post
   * @returns {Promise} Post créé
   */
  async createPost(postData) {
    try {
      const formData = new FormData();
      
      // Ajouter le contenu textuel
      if (postData.content && postData.content.trim()) {
        formData.append('content', postData.content.trim());
      }
      
      // Ajouter la catégorie
      if (postData.category) {
        formData.append('category', postData.category);
      }
      
      // Ajouter les hashtags
      if (postData.hashtags && postData.hashtags.length > 0) {
        formData.append('hashtags', JSON.stringify(postData.hashtags));
      }
      
      // Ajouter la localisation
      if (postData.location) {
        formData.append('location', JSON.stringify(postData.location));
      }
      
      // Ajouter les mentions
      if (postData.mentions && postData.mentions.length > 0) {
        formData.append('mentions', JSON.stringify(postData.mentions));
      }
      
      // Ajouter les médias (vidéos, images)
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((media, index) => {
          // Format correct pour React Native FormData
          const mediaFile = {
            uri: media.uri,
            type: media.type || 'video/mp4', // Type par défaut
            name: media.name || `media_${index}.${(media.type || 'video/mp4').split('/')[1]}`,
          };
          
          // Vérifier que l'URI est valide
          if (media.uri && media.uri.trim()) {
            formData.append('media', mediaFile);
          }
        });
      }
      
      const response = await apiClient.post(ENDPOINTS.POSTS.CREATE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: API_CONFIG.UPLOAD_TIMEOUT, // 2 minutes pour l'upload de vidéos
        maxContentLength: API_CONFIG.MAX_FILE_SIZE,
        maxBodyLength: API_CONFIG.MAX_FILE_SIZE
      });
      
      return {
        success: true,
        post: response.data
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      
      let errorMessage = 'Erreur lors de la création du post';
      
      if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Erreur de connexion réseau. Vérifiez votre connexion internet.';
      } else if (error.code === 'TIMEOUT_ERROR') {
        errorMessage = 'Délai d\'attente dépassé. Le fichier est peut-être trop volumineux.';
      } else if (error.status === 413) {
        errorMessage = 'Le fichier est trop volumineux. Taille maximale: 100MB.';
      } else if (error.status === 415) {
        errorMessage = 'Format de fichier non supporté. Utilisez des images ou vidéos.';
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        details: error
      };
    }
  }

  /**
   * Mettre à jour un post
   * @param {string} postId - ID du post
   * @param {Object} postData - Nouvelles données
   * @returns {Promise} Post mis à jour
   */
  async updatePost(postId, postData) {
    try {
      const response = await apiClient.put(ENDPOINTS.POSTS.UPDATE.replace(':id', postId), {
        content: postData.content?.trim(),
        category: postData.category,
        hashtags: postData.hashtags,
        location: postData.location
      });
      
      return {
        success: true,
        post: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du post'
      };
    }
  }

  /**
   * Supprimer un post
   * @param {string} postId - ID du post
   * @returns {Promise} Confirmation de suppression
   */
  async deletePost(postId) {
    try {
      await apiClient.delete(ENDPOINTS.POSTS.DELETE.replace(':id', postId));
      
      return {
        success: true,
        message: 'Post supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du post'
      };
    }
  }

  /**
   * Liker/Unliker un post
   * @param {string} postId - ID du post
   * @returns {Promise} Statut du like
   */
  async toggleLike(postId) {
    try {
      const response = await apiClient.post(ENDPOINTS.POSTS.LIKE.replace(':id', postId));
      
      // L'API retourne { data: { action: "liked" | "unliked", likesCount: number } }
      const apiData = response.data.data || response.data;
      const liked = apiData.action === 'liked';
      const likesCount = apiData.likesCount || 0;
      
      return {
        success: true,
        liked,
        likesCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du like'
      };
    }
  }

  /**
   * Partager un post
   * @param {string} postId - ID du post
   * @param {string} content - Contenu du partage (optionnel)
   * @returns {Promise} Confirmation de partage
   */
  async sharePost(postId, content = '') {
    try {
      const response = await apiClient.post(ENDPOINTS.POSTS.SHARE.replace(':id', postId), {
        content: content.trim()
      });
      
      return {
        success: true,
        share: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du partage'
      };
    }
  }

  /**
   * Rechercher des posts/vidéos
   * @param {string} query - Terme de recherche
   * @param {Object} params - Paramètres de filtrage
   * @returns {Promise} Résultats de recherche
   */
  async searchPosts(query, params = {}) {
    try {
      const { page = 1, limit = 10, category, type } = params;
      
      let queryParams = `q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      
      if (category && category !== 'Tous') {
        queryParams += `&category=${encodeURIComponent(category)}`;
      }
      
      if (type) {
        queryParams += `&type=${type}`;
      }
      
      const response = await apiClient.get(`${ENDPOINTS.POSTS.SEARCH}?${queryParams}`);
      
      return {
        success: true,
        posts: response.data.posts || response.data,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche'
      };
    }
  }

  /**
   * Récupérer les commentaires d'un post
   * @param {string} postId - ID du post
   * @param {Object} params - Paramètres de pagination
   * @returns {Promise} Commentaires
   */
  async getComments(postId, params = {}) {
    try {
      const { page = 1, limit = 20 } = params;
      const response = await apiClient.get(`${ENDPOINTS.COMMENTS.LIST.replace(':postId', postId)}?page=${page}&limit=${limit}`);
      
      return {
        success: true,
        comments: response.data.comments || response.data,
        pagination: response.data.pagination || {}
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des commentaires'
      };
    }
  }

  /**
   * Ajouter un commentaire
   * @param {string} postId - ID du post
   * @param {string} content - Contenu du commentaire
   * @returns {Promise} Commentaire créé
   */
  async addComment(postId, content) {
    try {
      const response = await apiClient.post(ENDPOINTS.COMMENTS.CREATE.replace(':postId', postId), {
        content: content.trim()
      });
      
      return {
        success: true,
        comment: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout du commentaire'
      };
    }
  }

  /**
   * Supprimer un commentaire
   * @param {string} commentId - ID du commentaire
   * @returns {Promise} Confirmation de suppression
   */
  async deleteComment(commentId) {
    try {
      await apiClient.delete(ENDPOINTS.COMMENTS.DELETE.replace(':id', commentId));
      
      return {
        success: true,
        message: 'Commentaire supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du commentaire'
      };
    }
  }

  /**
   * Liker un commentaire
   * @param {string} commentId - ID du commentaire
   * @returns {Promise} Statut du like
   */
  async likeComment(commentId) {
    try {
      const response = await apiClient.post(ENDPOINTS.COMMENTS.LIKE.replace(':id', commentId));
      
      return {
        success: true,
        liked: response.data.liked,
        likesCount: response.data.likesCount
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du like du commentaire'
      };
    }
  }

  /**
   * Gérer les erreurs API
   * @param {Error} error - Erreur à traiter
   * @returns {Error} Erreur formatée
   */
  handleError(error) {
    console.error('ChabJerr Service Error:', error);
    
    if (error.response) {
      // Erreur de réponse du serveur
      const message = error.response.data?.message || error.response.data?.error || 'Erreur serveur';
      return new Error(message);
    } else if (error.request) {
      // Erreur de réseau
      return new Error('Erreur de connexion réseau');
    } else {
      // Autre erreur
      return new Error(error.message || 'Erreur inconnue');
    }
  }
}

// Validation des données de post
export const validatePostData = (postData) => {
  const errors = [];
  
  // Vérifier qu'il y a du contenu ou des médias
  if (!postData.content?.trim() && (!postData.media || postData.media.length === 0)) {
    errors.push('Le post doit contenir du texte ou des médias');
  }
  
  // Vérifier la longueur du contenu
  if (postData.content && postData.content.length > 2000) {
    errors.push('Le contenu ne peut pas dépasser 2000 caractères');
  }
  
  // Vérifier le nombre de médias
  if (postData.media && postData.media.length > 10) {
    errors.push('Vous ne pouvez pas ajouter plus de 10 médias');
  }
  
  // Vérifier les hashtags
  if (postData.hashtags && postData.hashtags.length > 30) {
    errors.push('Vous ne pouvez pas ajouter plus de 30 hashtags');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des paramètres de recherche
export const validateSearchParams = (query, params = {}) => {
  const errors = [];
  
  // Vérifier la longueur de la requête
  if (!query || query.trim().length < 2) {
    errors.push('La recherche doit contenir au moins 2 caractères');
  }
  
  if (query && query.length > 100) {
    errors.push('La recherche ne peut pas dépasser 100 caractères');
  }
  
  // Vérifier les paramètres de pagination
  if (params.page && (params.page < 1 || params.page > 1000)) {
    errors.push('Le numéro de page doit être entre 1 et 1000');
  }
  
  if (params.limit && (params.limit < 1 || params.limit > 50)) {
    errors.push('La limite doit être entre 1 et 50');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const chabjerrService = new ChabJerrService();
export default chabjerrService;