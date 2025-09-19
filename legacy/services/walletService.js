import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import tokenUtils from '../utils/tokenUtils';
import * as Clipboard from 'expo-clipboard';
import solanaService from './solanaService';

class WalletService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Obtenir le token d'authentification
  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('@cydjerr_access_token');
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  // Headers par défaut avec authentification
  async getHeaders() {
    const token = await this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Gérer les erreurs de réponse
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Erreur de connexion au serveur'
      }));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    return response.json();
  }

  // Obtenir le portefeuille de l'utilisateur
  async getWallet() {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du portefeuille:', error);
      throw error;
    }
  }

  // Obtenir les informations du portefeuille local depuis les tokens
  getLocalWalletInfo() {
    try {
      const mainWallet = tokenUtils.getMainWalletInfo();
      const allWallets = tokenUtils.getAllWallets();
      
      if (!mainWallet) {
        console.warn('Aucun portefeuille principal trouvé');
        return null;
      }

      return {
        main: mainWallet,
        all: allWallets,
        solana: {
          publicKey: mainWallet.address,
          balance: 0, // À récupérer depuis l'API
        },
        jerr: {
          balance: 0, // À récupérer depuis l'API
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du portefeuille local:', error);
      return null;
    }
  }

  // Obtenir les soldes consolidés de tous les portefeuilles (BOSS + MNT)
  async getConsolidatedBalances() {
    try {
      const solanaBalances = await solanaService.getAllWalletsBalances();
      
      if (!solanaBalances || !solanaBalances.totals) {
        return {
          totalSolBalance: 0,
          totalJerrBalance: 0,
          totalValueEUR: 0,
          totalSol: 0,
          totalJerr: 0,
          totalEurValue: 0,
          wallets: []
        };
      }

      const { totals, wallets } = solanaBalances;
      
      // Conversion 1 JERR = 0,01 EUR
      const JERR_EUR_RATE = 0.01;
      const SOL_EUR_RATE = 100; // Prix estimé SOL en EUR
      
      // S'assurer que les valeurs sont des nombres
      const safeJerr = Number(totals.jerr) || 0;
      const safeSol = Number(totals.sol) || 0;
      
      const jerrEurValue = safeJerr * JERR_EUR_RATE;
      const solEurValue = safeSol * SOL_EUR_RATE;
      const totalEurValue = jerrEurValue + solEurValue;

      return {
        totalSolBalance: safeSol,
        totalJerrBalance: safeJerr,
        totalValueEUR: totalEurValue,
        totalSol: safeSol,
        totalJerr: safeJerr,
        totalEurValue,
        jerrEurValue,
        solEurValue,
        wallets: wallets.map(wallet => ({
          ...wallet,
          eurValue: ((Number(wallet.jerr) || 0) * JERR_EUR_RATE) + ((Number(wallet.sol) || 0) * SOL_EUR_RATE)
        }))
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des soldes consolidés:', error);
      return {
        totalSolBalance: 0,
        totalJerrBalance: 0,
        totalValueEUR: 0,
        totalSol: 0,
        totalJerr: 0,
        totalEurValue: 0,
        wallets: []
      };
    }
  }

  // Obtenir les données complètes du portefeuille
  async getWalletData(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des données du portefeuille:', error);
      throw error;
    }
  }

  // Obtenir le solde du portefeuille
  async getBalance(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${ENDPOINTS.WALLET.BALANCE}`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);
      throw error;
    }
  }

  // Obtenir les statistiques du portefeuille
  async getWalletStats() {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/stats`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Alias pour getWalletStats avec userId
  async getStats(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/stats`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Créer un nouveau plan d'investissement
  async createInvestmentPlan(planData) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/plans`, {
        method: 'POST',
        headers,
        body: JSON.stringify(planData),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  }

  // Obtenir les plans d'investissement
  async getInvestmentPlans(userId) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/plans`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des plans:', error);
      throw error;
    }
  }

  // Obtenir l'historique des transactions
  async getTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les paramètres de requête
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      if (params.category) queryParams.append('category', params.category);
      
      const url = `${this.baseURL}/wallet/transactions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  }

  // Mettre à jour les paramètres du portefeuille
  async updateWalletSettings(settings) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(settings),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      throw error;
    }
  }

  // Simuler une mise à jour des performances (pour les tests)
  async simulatePerformanceUpdate() {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/simulate`, {
        method: 'POST',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la simulation:', error);
      throw error;
    }
  }

  // Transférer des JERR vers un autre utilisateur
  async transferJerr(transferData) {
    try {
      // Utiliser recipientPublicKey en priorité, puis recipientAccount seulement s'il n'est pas vide
      const recipientKey = transferData.recipientPublicKey || (transferData.recipientAccount && transferData.recipientAccount.trim() !== '' ? transferData.recipientAccount : '');
      
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}${ENDPOINTS.WALLET.TRANSFER}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          recipientPublicKey: recipientKey,
          amount: parseFloat(transferData.amount),
          message: transferData.message || ''
        })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      throw error;
    }
  }

  // Rechercher des utilisateurs pour transfert
  async searchUsers(query, limit = 10) {
    try {
      const headers = await this.getHeaders();
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString()
      });
      const response = await fetch(`${this.baseURL}${ENDPOINTS.WALLET.USERS_SEARCH}?${params}`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }

  // Obtenir les frais de transaction estimés
  async getTransactionFees(params = {}) {
    try {
      const headers = await this.getHeaders();
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseURL}/wallet/fees?${queryParams}`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des frais:', error);
      throw error;
    }
  }

  // Générer un QR Code pour l'adresse du portefeuille
  async generateWalletQR() {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/qr`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la génération du QR code:', error);
      throw error;
    }
  }

  // Obtenir l'historique des prix JERR
  async getJerrPriceHistory(period = '7d') {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/price-history?period=${period}`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique des prix:', error);
      throw error;
    }
  }

  // Obtenir les informations de sécurité du portefeuille
  async getWalletSecurity() {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/security`, {
        method: 'GET',
        headers,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de sécurité:', error);
      throw error;
    }
  }

  // Mettre à jour les paramètres de sécurité
  async updateWalletSecurity(securityData) {
    try {
      const headers = await this.getHeaders();
      const response = await fetch(`${this.baseURL}/wallet/security`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(securityData),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de sécurité:', error);
      throw error;
    }
  }

  // Synchroniser le solde avec le réseau Solana
  async syncSolanaBalance() {
    try {
      // Synchroniser avec les données Solana en temps réel
      const consolidatedBalances = await this.getConsolidatedBalances();
      
      // Optionnel: synchroniser avec le backend
      try {
        const headers = await this.getHeaders();
        const response = await fetch(`${this.baseURL}/wallet/sync`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            solanaBalances: consolidatedBalances
          })
        });
        await this.handleResponse(response);
      } catch (backendError) {
        console.warn('Synchronisation backend échouée, utilisation des données Solana:', backendError);
      }
      
      return consolidatedBalances;
    } catch (error) {
      console.error('Erreur lors de la synchronisation du solde:', error);
      throw error;
    }
  }

  // Copier l'adresse dans le presse-papiers
  async copyAddressToClipboard(address) {
    try {
      await Clipboard.setStringAsync(address);
      return true;
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      return false;
    }
  }

  // Méthodes utilitaires pour les données locales
  
  // Formater le montant en devise
  formatCurrency(amount, currency = 'JERR') {
    if (typeof amount !== 'number') return '0.00 JERR';
    
    const formatted = amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${formatted} ${currency}`;
  }

  // Formater le montant en euros (1 JERR = 0,01 EUR)
  formatJerrToEur(jerrAmount) {
    if (typeof jerrAmount !== 'number') return '0,00 €';
    
    const eurAmount = jerrAmount * 0.01;
    const formatted = eurAmount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `${formatted} €`;
  }

  // Obtenir la valeur EUR estimée
  getEstimatedEURValue(jerrAmount, solAmount) {
    const JERR_EUR_RATE = 0.01; // 1 JERR = 0,01 EUR
    const SOL_EUR_RATE = 100; // Prix estimé SOL en EUR

    const jerrValue = jerrAmount * JERR_EUR_RATE;
    const solValue = solAmount * SOL_EUR_RATE;

    return {
      jerr: jerrValue,
      sol: solValue,
      total: jerrValue + solValue
    };
  }

  // Calculer le pourcentage de changement
  calculatePercentageChange(current, previous) {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Déterminer la tendance
  getTrend(current, previous) {
    if (!previous || current === previous) return 'flat';
    return current > previous ? 'up' : 'down';
  }

  // Formater la date
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  // Valider les données de plan d'investissement
  validatePlanData(planData) {
    const errors = [];
    
    if (!planData.name || planData.name.trim().length === 0) {
      errors.push('Le nom du plan est requis');
    }
    
    if (!['conservative', 'balanced', 'dynamic'].includes(planData.type)) {
      errors.push('Type de plan invalide');
    }
    
    if (!planData.allocation || 
        typeof planData.allocation.stocks !== 'number' ||
        typeof planData.allocation.bonds !== 'number' ||
        planData.allocation.stocks + planData.allocation.bonds !== 100) {
      errors.push('Allocation invalide (doit totaliser 100%)');
    }
    
    if (!planData.initialInvestment || planData.initialInvestment <= 0) {
      errors.push('Investissement initial invalide');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Obtenir les types de plans prédéfinis
  getPlanTypes() {
    return [
      {
        id: 'conservative',
        name: 'Plan Conservateur',
        description: 'Faible risque, rendement stable',
        allocation: { stocks: 20, bonds: 80 },
        expectedYield: '6-8%',
        riskLevel: 'Faible'
      },
      {
        id: 'balanced',
        name: 'Plan Équilibré',
        description: 'Risque modéré, bon équilibre',
        allocation: { stocks: 50, bonds: 50 },
        expectedYield: '8-12%',
        riskLevel: 'Modéré'
      },
      {
        id: 'dynamic',
        name: 'Plan Dynamique',
        description: 'Risque élevé, fort potentiel',
        allocation: { stocks: 80, bonds: 20 },
        expectedYield: '12-18%',
        riskLevel: 'Élevé'
      }
    ];
  }
}

// Instance singleton
const walletService = new WalletService();
export default walletService;

// Export des types pour TypeScript (si utilisé)
export const PLAN_TYPES = {
  CONSERVATIVE: 'conservative',
  BALANCED: 'balanced',
  DYNAMIC: 'dynamic'
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  INVESTMENT: 'investment',
  DIVIDEND: 'dividend',
  FEE: 'fee',
  TRANSFER: 'transfer',
  REWARD: 'reward',
  PURCHASE: 'purchase',
  SALE: 'sale'
};

export const TRANSACTION_CATEGORIES = {
  INVESTMENT: 'investment',
  TRADING: 'trading',
  REWARDS: 'rewards',
  FEES: 'fees',
  TRANSFER: 'transfer',
  OTHER: 'other'
};