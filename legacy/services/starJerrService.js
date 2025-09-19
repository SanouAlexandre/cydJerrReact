import capiJerrService from './capiJerrService';
import api from './api';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:4000/api/v1';
const STARS_ENDPOINT = `${API_BASE_URL}/stars`;

/**
 * Service pour les fonctionnalités StarJerr
 */
class StarJerrService {
  /**
   * Obtient toutes les célébrités
   * @param {Object} params - Paramètres de recherche
   * @returns {Promise<Array>}
   */
  async getStars(params = {}) {
    try {
      const response = await api.get('/stars', params);
      return response.data?.stars || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des stars:', error);
      throw error;
    }
  }

  /**
   * Recherche des célébrités
   * @param {string} query - Terme de recherche
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<Array>}
   */
  async searchStars(query, filters = {}) {
    try {
      const response = await api.get('/stars/search', { q: query, ...filters });
      return response.data?.stars || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de stars:', error);
      throw error;
    }
  }

  /**
   * Obtient les célébrités par catégorie
   * @param {string} category - Catégorie
   * @param {Object} params - Paramètres additionnels
   * @returns {Promise<Array>}
   */
  async getStarsByCategory(category, params = {}) {
    try {
      console.log('🔍 Loading stars for category:', category);
      const response = await api.get(`/stars/popular/${encodeURIComponent(category)}`, params);
      console.log('📦 Full API response keys:', Object.keys(response));
      console.log('📊 Response data keys:', Object.keys(response.data || {}));
      console.log('🔍 Response.data.success:', response.data?.success);
      console.log('🔍 Response.data.data:', response.data?.data);
      console.log('🔍 Response.data.stars:', response.data?.stars);
      console.log('⭐ Stars data:', response.data?.data?.stars || response.data?.stars);
      
      // Vérifier la structure de la réponse
      if (response.data?.data?.stars) {
        console.log('✅ Utilisation de response.data.data.stars');
        return response.data.data.stars;
      } else if (response.data?.stars) {
        console.log('✅ Utilisation de response.data.stars');
        return response.data.stars;
      } else if (Array.isArray(response.data)) {
        console.log('✅ Utilisation de response.data (array)');
        return response.data;
      }
      
      console.warn('Structure de réponse inattendue:', response.data);
      return [];
    } catch (error) {
      console.error('Erreur lors du chargement des stars par catégorie:', error);
      throw error;
    }
  }

  /**
   * Obtient les célébrités populaires par catégorie
   * @param {string} category - Catégorie
   * @param {number} limit - Nombre de résultats
   * @returns {Promise<Array>}
   */
  async getPopularByCategory(category, limit = 10) {
    try {
      const response = await api.get(`/stars/popular/${category}`, { limit });
      return response.data?.stars || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des stars populaires:', error);
      throw error;
    }
  }

  /**
   * Obtient les célébrités tendance
   * @param {number} limit - Nombre de résultats
   * @returns {Promise<Array>}
   */
  async getTrendingStars(limit = 10) {
    try {
      const response = await api.get('/stars/trending', { limit });
      return response.data?.stars || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des stars tendance:', error);
      throw error;
    }
  }

  /**
   * Obtient les détails d'une célébrité
   * @param {string} starId - ID de la célébrité
   * @returns {Promise<Object>}
   */
  async getStarDetails(starId) {
    try {
      const response = await api.get(`/stars/${starId}`);
      return response.data || null;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la star:', error);
      throw error;
    }
  }

  /**
   * Obtient les catégories de célébrités
   * @returns {Promise<Array>}
   */
  async getCategories() {
    try {
      const response = await api.get('/stars/categories');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      // Retourner des données mockées en cas d'erreur
      return this.getMockCategories();
    }
  }

  /**
   * Obtenir les statistiques du marché StarJerr
   */
  async getMarketStats() {
    try {
      const response = await fetch(`${STARS_ENDPOINT}/market-stats`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      throw new Error(data.message || 'Erreur lors de la récupération des statistiques');
    } catch (error) {
      console.error('Erreur getMarketStats:', error);
      // Retourner des données mockées en cas d'erreur
      return {
        marketCap: '2.4BJ',
        users: '150K',
        volume24h: '45MJ'
      };
    }
  }

  /**
   * Créer un nouveau StarToken (pour les célébrités)
   */
  async createStarToken(tokenData, authToken) {
    try {
      // Vérifier d'abord la balance CapiJerr
      const balanceCheck = await capiJerrService.canCreateStarToken();
      if (!balanceCheck.canCreate) {
        throw new Error(`Balance insuffisante. ${balanceCheck.requiredAmount} Jerr requis.`);
      }

      const response = await fetch(`${STARS_ENDPOINT}/create-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(tokenData)
      });

      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      throw new Error(data.message || 'Erreur lors de la création du token');
    } catch (error) {
      console.error('Erreur createStarToken:', error);
      throw error;
    }
  }

  /**
   * Obtient les tokens de l'utilisateur
   * @returns {Promise<Array>}
   */
  async getUserTokens() {
    try {
      const response = await api.get('/stars/user-tokens');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tokens utilisateur:', error);
      throw error;
    }
  }

  /**
   * Achète un StarToken
   * @param {string} tokenId - ID du token
   * @param {number} amount - Montant à acheter
   * @returns {Promise<Object>}
   */
  async purchaseToken(tokenId, amount) {
    try {
      const response = await api.post('/stars/purchase-token', {
        tokenId,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat du token:', error);
      throw error;
    }
  }

  /**
   * Obtient l'historique des transactions de tokens
   * @returns {Promise<Array>}
   */
  async getTokenTransactions() {
    try {
      const response = await api.get('/stars/token-transactions');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  }

  /**
   * Données mockées pour les catégories
   * @returns {Array}
   */
  getMockCategories() {
    return [
      {
        id: 1,
        name: 'Acteurs',
        emoji: '🎭',
        count: 156,
        tokensAvailable: 89,
        slug: 'acteurs'
      },
      {
        id: 2,
        name: 'Musiciens',
        emoji: '🎵',
        count: 234,
        tokensAvailable: 145,
        slug: 'musiciens'
      },
      {
        id: 3,
        name: 'Sportifs',
        emoji: '⚽',
        count: 189,
        tokensAvailable: 112,
        slug: 'sportifs'
      },
      {
        id: 4,
        name: 'Influenceurs',
        emoji: '📱',
        count: 298,
        tokensAvailable: 201,
        slug: 'influenceurs'
      },
      {
        id: 5,
        name: 'Entrepreneurs',
        emoji: '💼',
        count: 87,
        tokensAvailable: 45,
        slug: 'entrepreneurs'
      },
      {
        id: 6,
        name: 'Artistes',
        emoji: '🎨',
        count: 123,
        tokensAvailable: 78,
        slug: 'artistes'
      }
    ];
  }

  /**
   * Données mockées pour les statistiques du marché
   * @returns {Object}
   */
  getMockMarketStats() {
    return {
      totalMarketCap: 2450000000, // 2.45B Jerr
      totalUsers: 45678,
      dailyVolume: 125000000, // 125M Jerr
      activeTokens: 892,
      topPerformers: [
        { name: 'Leonardo DiCaprio', change: '+15.2%' },
        { name: 'Taylor Swift', change: '+12.8%' },
        { name: 'Cristiano Ronaldo', change: '+9.4%' }
      ]
    };
  }

  /**
   * Formate les prix en Jerr
   * @param {number} amount - Montant en Jerr
   * @returns {string}
   */
  formatPrice(amount) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(2)}K`;
    } else {
      return amount.toFixed(2);
    }
  }

  /**
   * Calcule la variation de prix en pourcentage
   * @param {number} currentPrice - Prix actuel
   * @param {number} previousPrice - Prix précédent
   * @returns {number}
   */
  calculatePriceChange(currentPrice, previousPrice) {
    if (previousPrice === 0) return 0;
    return ((currentPrice - previousPrice) / previousPrice) * 100;
  }

  /**
   * Valide les données de création de token
   * @param {Object} tokenData - Données du token
   * @returns {Object} - Résultat de validation
   */
  validateTokenData(tokenData) {
    const errors = [];

    if (!tokenData.name || tokenData.name.trim().length < 3) {
      errors.push('Le nom du token doit contenir au moins 3 caractères');
    }

    if (!tokenData.description || tokenData.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (!tokenData.totalSupply || tokenData.totalSupply < 1000) {
      errors.push('Le nombre total de tokens doit être d\'au moins 1000');
    }

    if (!tokenData.initialPrice || tokenData.initialPrice < 0.01) {
      errors.push('Le prix initial doit être d\'au moins 0.01 Jerr');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new StarJerrService();