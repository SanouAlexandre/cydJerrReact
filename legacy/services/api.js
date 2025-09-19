import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('@cydjerr_access_token');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  async makeRequest(endpoint, options = {}) {
    const token = await this.getAuthToken();
    
    const defaultHeaders = {};
    
    // Ne pas définir Content-Type pour FormData
    // React Native le fera automatiquement avec la boundary correcte
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erreur API ${endpoint}:`, error);
      throw error;
    }
  }

  // HTTP Methods
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.makeRequest(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }

  // Posts API
  async getPosts(page = 1, limit = 10) {
    return this.makeRequest(`/posts?page=${page}&limit=${limit}`);
  }

  async getPost(postId) {
    return this.makeRequest(`/posts/${postId}`);
  }

  async createPost(postData) {
    try {
      const formData = new FormData();
      
      // Ajouter le contenu
      if (postData.content) {
        formData.append('content', postData.content);
      }
      
      // Ajouter la localisation
      if (postData.location) {
        formData.append('location', postData.location);
      }
      
      // Ajouter les mentions
      if (postData.mentions && postData.mentions.length > 0) {
        formData.append('mentions', JSON.stringify(postData.mentions));
      }
      
      // Ajouter les médias
      if (postData.media && postData.media.length > 0) {
        postData.media.forEach((media, index) => {
          const fileExtension = media.type === 'video' ? 'mp4' : 'jpg';
          const mimeType = media.type === 'video' ? 'video/mp4' : 'image/jpeg';
          
          formData.append('media', {
            uri: media.uri,
            type: mimeType,
            name: media.name || `media_${index}.${fileExtension}`
          });
        });
      }

      console.log('🚀 Tentative de création de post (FormData):', {
        hasContent: !!postData.content,
        hasLocation: !!postData.location,
        hasMedia: !!(postData.media && postData.media.length > 0),
        mentionsCount: postData.mentions ? postData.mentions.length : 0
      });
      
      // Utiliser fetch directement pour FormData (comme dans starService.js)
      const token = await this.getAuthToken();
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${this.baseURL}/posts`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('💥 Erreur API /posts:', error);
      throw error;
    }
  }

  async updatePost(postId, postData) {
    return this.makeRequest(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId) {
    return this.makeRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId) {
    return this.makeRequest(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async sharePost(postId, content = '') {
    return this.makeRequest(`/posts/${postId}/share`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async getUserPosts(userId, page = 1, limit = 10) {
    return this.makeRequest(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  async searchPosts(query, page = 1, limit = 10) {
    return this.makeRequest(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Comments API
  async getPostComments(postId, page = 1, limit = 10) {
    return this.makeRequest(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
  }

  async addComment(postId, content) {
    return this.makeRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updateComment(commentId, content) {
    return this.makeRequest(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId) {
    return this.makeRequest(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async likeComment(commentId) {
    return this.makeRequest(`/comments/${commentId}/like`, {
      method: 'POST',
    });
  }

  async replyToComment(commentId, content) {
    return this.makeRequest(`/comments/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Groups API
  async getGroups(page = 1, limit = 10) {
    return this.makeRequest(`/groups?page=${page}&limit=${limit}`);
  }

  async getMyGroups() {
    return this.makeRequest('/groups/my');
  }

  async getTrendingGroups() {
    return this.makeRequest('/groups/trending');
  }

  async getGroup(groupId) {
    return this.makeRequest(`/groups/${groupId}`);
  }

  async createGroup(groupData) {
    const formData = new FormData();
    
    formData.append('name', groupData.name);
    formData.append('description', groupData.description);
    formData.append('privacy', groupData.privacy || 'public');
    formData.append('category', groupData.category || 'general');
    
    if (groupData.avatar) {
      formData.append('avatar', {
        uri: groupData.avatar.uri,
        type: groupData.avatar.type,
        name: groupData.avatar.name || 'avatar.jpg',
      });
    }
    
    if (groupData.coverImage) {
      formData.append('coverImage', {
        uri: groupData.coverImage.uri,
        type: groupData.coverImage.type,
        name: groupData.coverImage.name || 'cover.jpg',
      });
    }

    return this.makeRequest('/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async joinGroup(groupId) {
    return this.makeRequest(`/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async leaveGroup(groupId) {
    return this.makeRequest(`/groups/${groupId}/leave`, {
      method: 'POST',
    });
  }

  async getGroupPosts(groupId, page = 1, limit = 10) {
    return this.makeRequest(`/groups/${groupId}/posts?page=${page}&limit=${limit}`);
  }

  async searchGroups(query, page = 1, limit = 10) {
    return this.makeRequest(`/groups/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Messages API
  async getConversations() {
    return this.makeRequest('/messages/conversations');
  }

  async getConversationMessages(conversationId, page = 1, limit = 20) {
    return this.makeRequest(`/messages/conversation/${conversationId}?page=${page}&limit=${limit}`);
  }

  async getDirectMessages(userId, page = 1, limit = 20) {
    return this.makeRequest(`/messages/direct/${userId}?page=${page}&limit=${limit}`);
  }

  async getGroupMessages(groupId, page = 1, limit = 20) {
    return this.makeRequest(`/messages/group/${groupId}?page=${page}&limit=${limit}`);
  }

  async sendMessage(messageData) {
    const formData = new FormData();
    
    formData.append('content', messageData.content);
    formData.append('type', messageData.type || 'direct');
    
    if (messageData.recipientId) {
      formData.append('recipientId', messageData.recipientId);
    }
    
    if (messageData.groupId) {
      formData.append('groupId', messageData.groupId);
    }
    
    if (messageData.media && messageData.media.length > 0) {
      messageData.media.forEach((media, index) => {
        formData.append('media', {
          uri: media.uri,
          type: media.type,
          name: media.name || `media_${index}.${media.type.split('/')[1]}`,
        });
      });
    }

    return this.makeRequest('/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  async updateMessage(messageId, content) {
    return this.makeRequest(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(messageId, deleteForEveryone = false) {
    return this.makeRequest(`/messages/${messageId}`, {
      method: 'DELETE',
      body: JSON.stringify({ deleteForEveryone }),
    });
  }

  async reactToMessage(messageId, emoji) {
    return this.makeRequest(`/messages/${messageId}/react`, {
      method: 'POST',
      body: JSON.stringify({ emoji }),
    });
  }

  async markMessageAsRead(messageId) {
    return this.makeRequest(`/messages/${messageId}/mark-read`, {
      method: 'POST',
    });
  }

  async getUnreadMessagesCount() {
    return this.makeRequest('/messages/unread-count');
  }

  async searchMessages(query, page = 1, limit = 10) {
    return this.makeRequest(`/messages/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Notifications API
  async getNotifications(page = 1, limit = 20, filters = {}) {
    const params = {
      page,
      limit,
      ...filters
    };
    return this.get('/notifications', params);
  }

  async getUnreadNotificationsCount() {
    return this.get('/notifications/unread/count');
  }

  async markNotificationAsRead(notificationId) {
    return this.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.put('/notifications/read-all');
  }

  async deleteNotification(notificationId) {
    return this.delete(`/notifications/${notificationId}`);
  }

  async clearAllNotifications() {
    return this.delete('/notifications/clear-all');
  }

  async getNotificationStats(period = '7d') {
    return this.get(`/notifications/stats?period=${period}`);
  }

  // Status/Stories API
  async getStatuses(type = 'feed', page = 1, limit = 50) {
    const params = { type, page, limit };
    return this.get('/speakjerr/status', params);
  }

  async getMyStatuses(page = 1, limit = 50) {
    return this.getStatuses('my', page, limit);
  }

  async getUserStatuses(targetUserId, page = 1, limit = 50) {
    const params = { type: 'user', targetUserId, page, limit };
    return this.get('/speakjerr/status', params);
  }

  async createStatus(statusData) {
    const formData = new FormData();
    
    if (statusData.text) {
      formData.append('text', statusData.text);
    }
    
    if (statusData.backgroundColor) {
      formData.append('backgroundColor', statusData.backgroundColor);
    }
    
    if (statusData.textColor) {
      formData.append('textColor', statusData.textColor);
    }
    
    if (statusData.privacy) {
      formData.append('privacy', statusData.privacy);
    }
    
    if (statusData.location) {
      formData.append('location', JSON.stringify(statusData.location));
    }
    
    if (statusData.mentions && statusData.mentions.length > 0) {
      formData.append('mentions', JSON.stringify(statusData.mentions));
    }
    
    if (statusData.media) {
      formData.append('media', {
        uri: statusData.media.uri,
        type: statusData.media.type,
        name: statusData.media.name || 'media'
      });
    }
    
    return this.makeRequest('/speakjerr/status', {
      method: 'POST',
      body: formData
    });
  }

  async markStatusAsViewed(statusId) {
    return this.put(`/speakjerr/status/${statusId}/view`);
  }

  // Users API
  async searchUsers(query, page = 1, limit = 10) {
    return this.get(`/search/users?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }
}

export default new ApiService();