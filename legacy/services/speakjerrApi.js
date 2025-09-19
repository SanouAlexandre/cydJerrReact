import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de l'instance Axios pour SpeakJerr
const speakjerrApi = axios.create({
  baseURL: `${API_BASE_URL}/speakjerr`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
speakjerrApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@cydjerr_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
speakjerrApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      AsyncStorage.removeItem('@cydjerr_access_token');
      // Rediriger vers l'écran de connexion si nécessaire
    }
    return Promise.reject(error);
  }
);

// ===== MESSAGES API =====
export const messagesApi = {
  // Envoyer un message
  sendMessage: async (messageData) => {
    const formData = new FormData();
    
    // Ajouter les données du message
    if (messageData.content) {
      formData.append('content', messageData.content);
    }
    formData.append('conversationType', messageData.conversationType);
    
    if (messageData.recipient) {
      formData.append('recipient', messageData.recipient);
    }
    if (messageData.group) {
      formData.append('group', messageData.group);
    }
    if (messageData.messageType) {
      formData.append('messageType', messageData.messageType);
    }
    if (messageData.replyTo) {
      formData.append('replyTo', messageData.replyTo);
    }
    if (messageData.forwardedFrom) {
      formData.append('forwardedFrom', messageData.forwardedFrom);
    }
    
    // Gérer les fichiers média
    if (messageData.media && messageData.media.length > 0) {
      messageData.media.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.name || `media_${index}.${file.type.split('/')[1]}`,
        });
      });
    }

    const response = await speakjerrApi.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Récupérer les conversations
  getConversations: async (page = 1, limit = 20, type = null) => {
    const params = { page, limit };
    if (type) params.type = type;
    
    const response = await speakjerrApi.get('/messages/conversations', { params });
    return response.data;
  },

  // Récupérer les messages d'une conversation
  getMessages: async (conversationId, page = 1, limit = 50, before = null) => {
    const params = { page, limit };
    if (before) params.before = before;
    
    const response = await speakjerrApi.get(`/messages/conversation/${conversationId}`, { params });
    return response.data;
  },

  // Récupérer les messages directs avec un utilisateur
  getDirectMessages: async (userId, page = 1, limit = 50) => {
    const response = await speakjerrApi.get(`/messages/direct/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Récupérer les messages d'un groupe
  getGroupMessages: async (groupId, page = 1, limit = 50) => {
    const response = await speakjerrApi.get(`/messages/group/${groupId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Récupérer un message spécifique
  getMessage: async (messageId) => {
    const response = await speakjerrApi.get(`/messages/${messageId}`);
    return response.data;
  },

  // Modifier un message
  updateMessage: async (messageId, content) => {
    const response = await speakjerrApi.put(`/messages/${messageId}`, { content });
    return response.data;
  },

  // Supprimer un message
  deleteMessage: async (messageId, deleteForEveryone = false) => {
    const response = await speakjerrApi.delete(`/messages/${messageId}`, {
      data: { deleteFor: deleteForEveryone ? 'everyone' : 'me' }
    });
    return response.data;
  },

  // Réagir à un message
  reactToMessage: async (messageId, reaction) => {
    const response = await speakjerrApi.post(`/messages/${messageId}/react`, { reaction });
    return response.data;
  },

  // Supprimer une réaction
  removeReaction: async (messageId) => {
    const response = await speakjerrApi.delete(`/messages/${messageId}/react`);
    return response.data;
  },

  // Marquer un message comme lu
  markAsRead: async (messageId) => {
    const response = await speakjerrApi.post(`/messages/${messageId}/mark-read`);
    return response.data;
  },

  // Obtenir le nombre de messages non lus
  getUnreadCount: async () => {
    const response = await speakjerrApi.get('/messages/unread-count');
    return response.data;
  },

  // Rechercher des messages
  searchMessages: async (query, page = 1, limit = 20, filters = {}) => {
    const params = { q: query, page, limit, ...filters };
    const response = await speakjerrApi.get('/messages/search', { params });
    return response.data;
  },
};

// ===== STATUS API =====
export const statusApi = {
  // Créer un statut
  createStatus: async (statusData) => {
    const formData = new FormData();
    
    // Ajouter le contenu du statut
    if (statusData.content) {
      formData.append('text', statusData.content);
    }
    
    // Ajouter les paramètres de visibilité
    if (statusData.privacy) {
      formData.append('privacy', statusData.privacy);
    }
    
    if (statusData.backgroundColor) {
      formData.append('backgroundColor', statusData.backgroundColor);
    }
    
    if (statusData.textColor) {
      formData.append('textColor', statusData.textColor);
    }
    
    // Gérer le fichier média (un seul fichier)
    if (statusData.media && statusData.media.length > 0) {
      const file = statusData.media[0];
      formData.append('media', {
        uri: file.uri,
        type: file.type,
        name: file.name || `status_media.${file.type.split('/')[1]}`,
      });
    }

    const response = await speakjerrApi.post('/status', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Récupérer les statuts (feed)
  getStatuses: async (page = 1, limit = 20) => {
    const response = await speakjerrApi.get('/status', {
      params: { page, limit, type: 'feed' }
    });
    return response.data;
  },

  // Récupérer mes statuts
  getMyStatuses: async (page = 1, limit = 20) => {
    const response = await speakjerrApi.get('/status', {
      params: { page, limit, type: 'my' }
    });
    return response.data;
  },

  // Récupérer un statut spécifique
  getStatus: async (statusId) => {
    const response = await speakjerrApi.get(`/status/${statusId}`);
    return response.data;
  },

  // Réagir à un statut
  reactToStatus: async (statusId, reaction) => {
    const response = await speakjerrApi.post(`/status/${statusId}/react`, { reaction });
    return response.data;
  },

  // Supprimer une réaction de statut
  removeStatusReaction: async (statusId) => {
    const response = await speakjerrApi.delete(`/status/${statusId}/react`);
    return response.data;
  },

  // Commenter un statut
  commentOnStatus: async (statusId, content, media = null) => {
    const formData = new FormData();
    formData.append('content', content);
    
    if (media) {
      formData.append('media', {
        uri: media.uri,
        type: media.type,
        name: media.name || `comment_media.${media.type.split('/')[1]}`,
      });
    }

    const response = await speakjerrApi.post(`/status/${statusId}/comment`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Récupérer les commentaires d'un statut
  getStatusComments: async (statusId, page = 1, limit = 20) => {
    const response = await speakjerrApi.get(`/status/${statusId}/comments`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Marquer un statut comme vu
  markStatusAsViewed: async (statusId) => {
    const response = await speakjerrApi.post(`/status/${statusId}/view`);
    return response.data;
  },

  // Supprimer un statut
  deleteStatus: async (statusId) => {
    const response = await speakjerrApi.delete(`/status/${statusId}`);
    return response.data;
  },
};

// ===== CALLS API =====
export const callsApi = {
  // Initier un appel
  initiateCall: async (callData) => {
    const response = await speakjerrApi.post('/calls/initiate', {
      recipient: callData.recipient,
      callType: callData.callType, // 'audio' ou 'video'
      isGroupCall: callData.isGroupCall || false,
      groupId: callData.groupId || null
    });
    return response.data;
  },

  // Répondre à un appel
  answerCall: async (callId, mediaSettings = {}) => {
    const response = await speakjerrApi.post(`/calls/${callId}/answer`, {
      audioEnabled: mediaSettings.audioEnabled !== false,
      videoEnabled: mediaSettings.videoEnabled !== false
    });
    return response.data;
  },

  // Décliner un appel
  declineCall: async (callId, reason = null) => {
    const response = await speakjerrApi.post(`/calls/${callId}/decline`, { reason });
    return response.data;
  },

  // Terminer un appel
  endCall: async (callId) => {
    const response = await speakjerrApi.post(`/calls/${callId}/end`);
    return response.data;
  },

  // Rejoindre un appel de groupe
  joinGroupCall: async (callId, mediaSettings = {}) => {
    const response = await speakjerrApi.post(`/calls/${callId}/join`, {
      audioEnabled: mediaSettings.audioEnabled !== false,
      videoEnabled: mediaSettings.videoEnabled !== false
    });
    return response.data;
  },

  // Quitter un appel de groupe
  leaveGroupCall: async (callId) => {
    const response = await speakjerrApi.post(`/calls/${callId}/leave`);
    return response.data;
  },

  // Mettre à jour les paramètres média
  updateMediaStatus: async (callId, mediaStatus) => {
    const response = await speakjerrApi.patch(`/calls/${callId}/media-status`, {
      audioEnabled: mediaStatus.audioEnabled,
      videoEnabled: mediaStatus.videoEnabled,
      screenSharing: mediaStatus.screenSharing || false
    });
    return response.data;
  },

  // Récupérer l'historique des appels
  getCallHistory: async (page = 1, limit = 20, callType = null) => {
    const params = { page, limit };
    if (callType) params.callType = callType;
    const response = await speakjerrApi.get('/call/history', { params });
    return response.data;
  },

  // Soumettre un feedback d'appel
  submitCallFeedback: async (callId, feedback) => {
    const response = await speakjerrApi.post(`/calls/${callId}/feedback`, {
      rating: feedback.rating,
      comment: feedback.comment || '',
      issues: feedback.issues || []
    });
    return response.data;
  },

  // Obtenir les détails d'un appel
  getCallDetails: async (callId) => {
    const response = await speakjerrApi.get(`/calls/${callId}`);
    return response.data;
  },

  // Obtenir les appels actifs
  getActiveCalls: async () => {
    const response = await speakjerrApi.get('/calls/active');
    return response.data;
  },
};

// ===== GROUPS API =====
export const groupsApi = {
  // Créer un groupe
  createGroup: async (groupData) => {
    const formData = new FormData();
    
    // Ajouter les données obligatoires
    formData.append('name', groupData.name);
    formData.append('description', groupData.description || '');
    formData.append('type', groupData.type || 'public'); // 'public', 'private', 'secret'
    formData.append('category', groupData.category || 'general');
    
    // Ajouter les données optionnelles
    if (groupData.maxMembers) {
      formData.append('maxMembers', groupData.maxMembers.toString());
    }
    
    if (groupData.rules) {
      formData.append('rules', groupData.rules);
    }
    
    if (groupData.tags && groupData.tags.length > 0) {
      formData.append('tags', JSON.stringify(groupData.tags));
    }
    
    // Gérer l'avatar du groupe
    if (groupData.avatar) {
      formData.append('avatar', {
        uri: groupData.avatar.uri,
        type: groupData.avatar.type,
        name: groupData.avatar.name || `group_avatar.${groupData.avatar.type.split('/')[1]}`,
      });
    }
    
    // Gérer l'image de couverture
    if (groupData.coverImage) {
      formData.append('coverImage', {
        uri: groupData.coverImage.uri,
        type: groupData.coverImage.type,
        name: groupData.coverImage.name || `group_cover.${groupData.coverImage.type.split('/')[1]}`,
      });
    }

    const response = await speakjerrApi.post('/groups', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Récupérer tous les groupes
  getGroups: async (page = 1, limit = 20, type = null, category = null) => {
    const params = { page, limit };
    if (type) params.type = type;
    if (category) params.category = category;
    
    const response = await speakjerrApi.get('/groups', { params });
    return response.data;
  },

  // Récupérer mes groupes
  getMyGroups: async (page = 1, limit = 20) => {
    const response = await speakjerrApi.get('/groups/my', {
      params: { page, limit }
    });
    return response.data;
  },

  // Récupérer les groupes tendances
  getTrendingGroups: async (page = 1, limit = 20) => {
    const response = await speakjerrApi.get('/groups/trending', {
      params: { page, limit }
    });
    return response.data;
  },

  // Récupérer un groupe par ID
  getGroup: async (groupId) => {
    const response = await speakjerrApi.get(`/groups/${groupId}`);
    return response.data;
  },

  // Mettre à jour un groupe
  updateGroup: async (groupId, updateData) => {
    const formData = new FormData();
    
    // Ajouter les champs texte
    if (updateData.name) formData.append('name', updateData.name);
    if (updateData.description !== undefined) formData.append('description', updateData.description);
    if (updateData.type) formData.append('type', updateData.type);
    if (updateData.category) formData.append('category', updateData.category);
    if (updateData.maxMembers) formData.append('maxMembers', updateData.maxMembers.toString());
    if (updateData.rules !== undefined) formData.append('rules', updateData.rules);
    if (updateData.tags) formData.append('tags', JSON.stringify(updateData.tags));
    
    // Gérer l'avatar
    if (updateData.avatar) {
      formData.append('avatar', {
        uri: updateData.avatar.uri,
        type: updateData.avatar.type,
        name: updateData.avatar.name || `group_avatar.${updateData.avatar.type.split('/')[1]}`,
      });
    }
    
    // Gérer l'image de couverture
    if (updateData.coverImage) {
      formData.append('coverImage', {
        uri: updateData.coverImage.uri,
        type: updateData.coverImage.type,
        name: updateData.coverImage.name || `group_cover.${updateData.coverImage.type.split('/')[1]}`,
      });
    }

    const response = await speakjerrApi.put(`/groups/${groupId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Rejoindre un groupe
  joinGroup: async (groupId) => {
    const response = await speakjerrApi.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Quitter un groupe
  leaveGroup: async (groupId) => {
    const response = await speakjerrApi.post(`/groups/${groupId}/leave`);
    return response.data;
  },

  // Ajouter un membre au groupe
  addMember: async (groupId, userId, role = 'member') => {
    const response = await speakjerrApi.post(`/groups/${groupId}/members`, { 
      userId, 
      role // 'admin', 'moderator', 'member'
    });
    return response.data;
  },

  // Supprimer un membre du groupe
  removeMember: async (groupId, userId) => {
    const response = await speakjerrApi.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  // Supprimer un groupe
  deleteGroup: async (groupId) => {
    const response = await speakjerrApi.delete(`/groups/${groupId}`);
    return response.data;
  },

  // Rechercher des groupes
  searchGroups: async (query, page = 1, limit = 20, filters = {}) => {
    const params = { q: query, page, limit, ...filters };
    const response = await speakjerrApi.get('/groups/search', { params });
    return response.data;
  },

  // Récupérer les membres d'un groupe
  getGroupMembers: async (groupId, page = 1, limit = 20) => {
    const response = await speakjerrApi.get(`/groups/${groupId}/members`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Mettre à jour le rôle d'un membre
  updateMemberRole: async (groupId, userId, role) => {
    const response = await speakjerrApi.patch(`/groups/${groupId}/members/${userId}`, { role });
    return response.data;
  },
};

// Export par défaut
export default {
  messagesApi,
  statusApi,
  callsApi,
  groupsApi,
};