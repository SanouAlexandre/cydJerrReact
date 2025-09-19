import apiClient from './api/apiClient';

class CloudService {
  constructor() {
    this.baseURL = '/cloud';
  }

  /**
   * Obtenir les statistiques de stockage de l'utilisateur
   */
  async getStorageStats() {
    try {
      const response = await apiClient.get(`${this.baseURL}/storage-stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur getStorageStats:', error);
      throw error;
    }
  }

  /**
   * Obtenir la liste des fichiers avec pagination et filtres
   */
  async getFiles(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        type,
        folder = '/',
        search,
        sortBy = 'uploadedAt',
        sortOrder = 'desc'
      } = options;

      const params = {
        page: page.toString(),
        limit: limit.toString(),
        folder,
        sortBy,
        sortOrder
      };

      if (category) params.category = category;
      if (type) params.type = type;
      if (search) params.search = search;

      const response = await apiClient.get(`${this.baseURL}/files`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur getFiles:', error);
      throw error;
    }
  }

  /**
   * Upload un fichier
   */
  async uploadFile(fileUri, options = {}) {
    try {
      const { description, folder = '/', tags, type = 'personal' } = options;

      const formData = new FormData();
      
      // Ajouter le fichier
      formData.append('file', {
        uri: fileUri,
        type: 'application/octet-stream', // Type générique, le serveur déterminera le type réel
        name: fileUri.split('/').pop() || 'file'
      });

      // Ajouter les métadonnées
      if (description) formData.append('description', description);
      if (folder) formData.append('folder', folder);
      if (tags) formData.append('tags', tags);
      if (type) formData.append('type', type);

      // Utiliser apiClient qui gère automatiquement les headers d'authentification
      const response = await apiClient.post(`${this.baseURL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erreur uploadFile:', error);
      throw error;
    }
  }

  /**
   * Obtenir un fichier par ID
   */
  async getFileById(fileId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/files/${fileId}`, {
        method: 'GET',
        headers
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du fichier');
      }

      return data.data;
    } catch (error) {
      console.error('Erreur getFileById:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un fichier
   */
  async updateFile(fileId, updates) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/files/${fileId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du fichier');
      }

      return data.data;
    } catch (error) {
      console.error('Erreur updateFile:', error);
      throw error;
    }
  }

  /**
   * Supprimer un fichier
   */
  async deleteFile(fileId) {
    try {
      const response = await apiClient.delete(`${this.baseURL}/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur deleteFile:', error);
      throw error;
    }
  }

  /**
   * Partager un fichier
   */
  async shareFile(fileId, email, permission = 'view') {
    try {
      const response = await apiClient.post(`${this.baseURL}/files/${fileId}/share`, {
        email,
        permission
      });
      return response.data;
    } catch (error) {
      console.error('Erreur shareFile:', error);
      throw error;
    }
  }

  /**
   * Obtenir l'URL de téléchargement d'un fichier
   */
  async getDownloadUrl(fileId) {
    try {
      // Utiliser apiClient pour construire l'URL avec les headers appropriés
      return `${apiClient.defaults.baseURL}${this.baseURL}/files/${fileId}/download`;
    } catch (error) {
      console.error('Erreur getDownloadUrl:', error);
      throw error;
    }
  }

  /**
   * Obtenir les dossiers de l'utilisateur
   */
  async getFolders() {
    try {
      const response = await apiClient.get(`${this.baseURL}/folders`);
      return response.data;
    } catch (error) {
      console.error('Erreur getFolders:', error);
      throw error;
    }
  }

  /**
   * Obtenir les fichiers partagés avec l'utilisateur
   */
  async getSharedFiles() {
    try {
      const response = await apiClient.get(`${this.baseURL}/files/shared`);
      return response.data;
    } catch (error) {
      console.error('Erreur getSharedFiles:', error);
      throw error;
    }
  }

  /**
   * Obtenir les fichiers récents
   */
  async getRecentFiles(limit = 10) {
    try {
      const response = await apiClient.get(`${this.baseURL}/files/recent`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur getRecentFiles:', error);
      throw error;
    }
  }

  /**
   * Obtenir les fichiers favoris
   */
  async getFavoriteFiles() {
    try {
      const response = await apiClient.get(`${this.baseURL}/files/favorites`);
      return response.data;
    } catch (error) {
      console.error('Erreur getFavoriteFiles:', error);
      throw error;
    }
  }

  /**
   * Marquer/démarquer un fichier comme favori
   */
  async toggleFavorite(fileId) {
    try {
      const response = await apiClient.post(`${this.baseURL}/files/${fileId}/favorite`);
      return response.data;
    } catch (error) {
      console.error('Erreur toggleFavorite:', error);
      throw error;
    }
  }

  /**
   * Rechercher des fichiers
   */
  async searchFiles(query, options = {}) {
    try {
      const { category, type, limit = 20 } = options;

      const params = {
        q: query,
        limit: limit.toString()
      };

      if (category) params.category = category;
      if (type) params.type = type;

      const response = await apiClient.get(`${this.baseURL}/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Erreur searchFiles:', error);
      throw error;
    }
  }

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    const safeBytes = Number(bytes) || 0;
    if (safeBytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(safeBytes) / Math.log(k));
    
    return parseFloat((safeBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtenir l'icône selon le type de fichier
   */
  getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'videocam';
    if (mimeType.startsWith('audio/')) return 'musical-notes';
    if (mimeType.includes('pdf')) return 'document-text';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'grid';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'easel';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
    return 'document';
  }

  /**
   * Obtenir la couleur de l'icône selon le type
   */
  getFileIconColor(mimeType) {
    if (mimeType.startsWith('image/')) return '#4facfe';
    if (mimeType.startsWith('video/')) return '#ff6b6b';
    if (mimeType.startsWith('audio/')) return '#4ecdc4';
    if (mimeType.includes('pdf')) return '#ff4757';
    if (mimeType.includes('word') || mimeType.includes('document')) return '#3742fa';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '#2ed573';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '#ffa502';
    return '#747d8c';
  }

  /**
   * Vider le cache utilisateur
   */
  async clearCache() {
    try {
      const response = await apiClient.delete(`${this.baseURL}/cache`);
      return response.data;
    } catch (error) {
      console.error('Erreur clearCache:', error);
      throw error;
    }
  }

  /**
   * Exporter les données utilisateur
   */
  async exportUserData() {
    try {
      const response = await apiClient.get(`${this.baseURL}/export`);
      return response.data;
    } catch (error) {
      console.error('Erreur exportUserData:', error);
      throw error;
    }
  }
}

export default new CloudService();