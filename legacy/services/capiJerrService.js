import walletService from './walletService';
import solanaService from './solanaService';
import investmentService from './investmentService';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';

// Configuration de l'API
const WALLET_ENDPOINT = `${API_BASE_URL}/wallet`;
const STARS_ENDPOINT = `${API_BASE_URL}/stars`;

/**
 * Service pour la vérification de balance CapiJerr
 * Utilisé pour l'intégration inter-univers avec StarJerr
 */
class CapiJerrService {
  /**
   * Vérifie si l'utilisateur a au moins le montant requis en Jerr
   * @param {number} requiredAmount - Montant requis en Jerr
   * @returns {Promise<{hasBalance: boolean, currentBalance: number, error?: string}>}
   */
  async checkBalance(requiredAmount = 100000000) { // 100M Jerr par défaut
    try {
      // Obtenir les soldes consolidés depuis CapiJerr
      const consolidatedBalances = await walletService.getConsolidatedBalances();
      
      const currentBalance = Number(consolidatedBalances.totalJerrBalance) || 0;
      const hasBalance = currentBalance >= requiredAmount;
      
      return {
        hasBalance,
        currentBalance,
        requiredAmount,
        difference: hasBalance ? 0 : requiredAmount - currentBalance
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de balance CapiJerr:', error);
      return {
        hasBalance: false,
        currentBalance: 0,
        requiredAmount,
        error: error.message || 'Erreur de vérification de balance'
      };
    }
  }

  /**
   * Obtient les informations détaillées du wallet CapiJerr
   * @returns {Promise<Object>}
   */
  async getWalletInfo() {
    try {
      const localWallet = walletService.getLocalWalletInfo();
      const consolidatedBalances = await walletService.getConsolidatedBalances();
      
      return {
        ...localWallet,
        balance: consolidatedBalances.totalJerrBalance,
        solBalance: consolidatedBalances.totalSolBalance,
        balanceUsd: consolidatedBalances.totalValueEUR,
        totalJerr: consolidatedBalances.totalJerrBalance,
        totalSol: consolidatedBalances.totalSolBalance,
        totalValueEUR: consolidatedBalances.totalValueEUR
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des informations wallet:', error);
      return null;
    }
  }

  /**
   * Formate le montant en Jerr avec les unités appropriées
   * @param {number} amount - Montant en Jerr
   * @returns {string}
   */
  formatJerrAmount(amount) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B Jerr`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M Jerr`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K Jerr`;
    } else {
      return `${amount.toFixed(2)} Jerr`;
    }
  }

  /**
   * Vérifier si l'utilisateur peut créer un StarToken
   * @param {string} userId - ID de l'utilisateur
   * @param {number} requiredAmount - Montant requis (défaut: 100M Jerr)
   * @returns {Promise<Object>}
   */
  async canCreateStarToken(userId = null, requiredAmount = 100000000) {
    try {
      // Utiliser directement les soldes consolidés de CapiJerr
      const consolidatedBalances = await walletService.getConsolidatedBalances();
      
      const currentBalance = Number(consolidatedBalances.totalJerrBalance) || 0;
      const hasRequiredBalance = currentBalance >= requiredAmount;
      
      return {
        canCreate: hasRequiredBalance,
        currentBalance,
        requiredAmount,
        hasRequiredBalance,
        formattedBalance: `${(currentBalance / 1000000).toFixed(1)}M Jerr`
      };
    } catch (error) {
      console.error('Erreur canCreateStarToken:', error);
      
      // En cas d'erreur, essayer l'API backend comme fallback
      try {
        const targetUserId = userId || await this.getCurrentUserId();
        
        const response = await fetch(`${STARS_ENDPOINT}/check-balance/${targetUserId}?requiredAmount=${requiredAmount}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await this.getAuthToken()}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          return {
            canCreate: data.data.canCreateToken,
            currentBalance: data.data.currentBalance,
            requiredAmount: data.data.requiredAmount,
            hasRequiredBalance: data.data.hasRequiredBalance,
            formattedBalance: `${(data.data.currentBalance / 1000000).toFixed(1)}M Jerr`
          };
        }
      } catch (apiError) {
        console.error('Erreur API fallback:', apiError);
      }
      
      // Retourner des données par défaut en cas d'échec total
      return {
        canCreate: false,
        currentBalance: 0,
        requiredAmount,
        hasRequiredBalance: false,
        formattedBalance: '0.0M Jerr',
        error: 'Impossible de vérifier la balance'
      };
    }
  }

  /**
   * Obtenir l'ID de l'utilisateur connecté
   * @returns {Promise<string>}
   */
  async getCurrentUserId() {
    try {
      const state = store.getState();
      const user = state.user.user;
      return user?.id || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      return null;
    }
  }

  /**
   * Obtenir le token d'authentification
   * @returns {Promise<string>}
   */
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('@cydjerr_access_token');
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
      return null;
    }
  }

  /**
   * Synchronise le solde avec Solana
   * @returns {Promise<boolean>}
   */
  async syncBalance() {
    try {
      await walletService.syncSolanaBalance();
      return true;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      return false;
    }
  }

  /**
   * Obtient les statistiques globales de CapiJerr
   * @returns {Promise<Object>}
   */
  async getGlobalStats() {
    try {
      const globalStats = await investmentService.getGlobalStats();
      const solanaData = await solanaService.getAllWalletsBalances();
      
      return {
        totalInvested: globalStats?.totalInvested || 0,
        totalReturn: globalStats?.totalReturn || 0,
        averageReturn: globalStats?.averageReturn || 0,
        activePlans: globalStats?.activePlans || 0,
        totalJerrInCirculation: solanaData?.totals?.jerr || 0,
        totalSolInCirculation: solanaData?.totals?.sol || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalInvested: 0,
        totalReturn: 0,
        averageReturn: 0,
        activePlans: 0,
        totalJerrInCirculation: 0,
        totalSolInCirculation: 0
      };
    }
  }
}

export default new CapiJerrService();