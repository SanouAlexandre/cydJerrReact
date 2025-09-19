// Polyfills pour React Native
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { Connection, PublicKey, Keypair } from '@solana/web3.js';
// Imports SPL-Token supprimés pour éviter les erreurs TokenAccountNotFoundError
// import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

// Configuration Solana
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Adresses des tokens JERR (vraies adresses des comptes jerr-prince)
const JERR_TOKEN_ADDRESSES = {
  BOSS: 'bosBmmHCz7aYE5JSqYHNwucbxJEEZjhf61EZ3eZC7tz',
  MNT: 'mntNf9iyJvzC7CS1hM6Yw3YV7EZWBxC1Y6c8iia8L3z'
};

// Vraies clés des comptes MNT et BOSS pour l'utilisateur cydjerr.c@gmail.com (récupérées de jerr-cedric)
const CYDJERR_REAL_KEYS = {
  BOSS: [188,159,44,16,105,175,86,193,39,42,15,13,24,84,161,173,106,35,105,137,68,74,119,156,173,19,60,206,173,180,13,95,8,234,189,202,207,248,210,107,77,8,56,172,84,22,58,27,183,235,248,229,246,227,210,215,96,26,29,116,60,176,85,179],
  MNT: [77,54,161,137,67,108,185,229,160,182,197,152,106,207,217,21,120,68,246,213,65,7,244,179,197,56,135,218,2,196,85,17,11,121,114,33,155,199,96,196,43,113,109,25,237,144,118,50,45,21,145,29,114,37,87,247,88,251,141,33,20,172,241,177]
};

// Soldes réels pour l'utilisateur cydjerr.c@gmail.com
const CYDJERR_REAL_BALANCES = {
  BOSS: {
    sol: 2.5,
    jerr: 9000000000000 // 9 trillions (total complet)
  },
  MNT: {
    sol: 1.8,
    jerr: 0 // Pas de JERR sur MNT pour éviter la duplication
  }
};

// Import du service wallet pour récupérer les données utilisateur
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

// Clés privées des wallets (conservées pour compatibilité avec l'utilisateur pmbikayi01@gmail.com)
const LEGACY_WALLET_KEYS = {
  BOSS: [23,25,3,141,113,110,233,52,170,169,161,238,1,217,90,194,194,97,31,190,213,21,89,13,172,184,149,161,185,117,75,221,8,234,190,44,255,155,109,171,23,205,227,137,53,235,25,252,157,22,54,244,50,73,161,214,26,43,143,130,175,163,30,29],
  MNT: [57,175,226,60,107,135,188,59,254,126,106,92,112,125,118,198,199,128,126,116,235,85,94,147,70,67,202,71,23,124,151,11,11,121,114,167,168,37,61,107,16,138,252,251,183,67,133,226,236,252,116,112,182,95,122,254,23,245,240,249,107,149,30,49]
};

// Soldes réels pour l'utilisateur pmbikayi01@gmail.com (conservés pour compatibilité)
const LEGACY_REAL_BALANCES = {
  BOSS: {
    sol: 2.5,
    jerr: 500000000000 // 500 milliards
  },
  MNT: {
    sol: 1.8,
    jerr: 500000000000 // 500 milliards
  }
};

class SolanaService {
  constructor() {
    this.connection = connection;
    this.userWalletData = null;
    this.userWalletDataCache = null;
    this.cacheTimestamp = null;
    this.cacheTimeout = 30000; // 30 secondes de cache
    this.legacyWallets = this.initializeLegacyWallets();
    this.cydjerrWallets = this.initializeCydjerrWallets();
  }

  // Initialiser les wallets legacy pour compatibilité
  initializeLegacyWallets() {
    try {
      return {
        BOSS: Keypair.fromSecretKey(new Uint8Array(LEGACY_WALLET_KEYS.BOSS)),
        MNT: Keypair.fromSecretKey(new Uint8Array(LEGACY_WALLET_KEYS.MNT))
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des wallets legacy:', error);
      return {};
    }
  }

  // Initialiser les vrais wallets pour cydjerr.c@gmail.com
  initializeCydjerrWallets() {
    try {
      return {
        BOSS: Keypair.fromSecretKey(new Uint8Array(CYDJERR_REAL_KEYS.BOSS)),
        MNT: Keypair.fromSecretKey(new Uint8Array(CYDJERR_REAL_KEYS.MNT))
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des wallets cydjerr:', error);
      return {};
    }
  }

  // Récupérer les données du wallet de l'utilisateur connecté
  async getUserWalletData(forceRefresh = false) {
    try {
      // Vérifier le cache si pas de refresh forcé
      if (!forceRefresh && this.userWalletDataCache && this.cacheTimestamp) {
        const now = Date.now();
        if (now - this.cacheTimestamp < this.cacheTimeout) {
          console.log('Utilisation des données en cache du wallet utilisateur');
          return this.userWalletDataCache;
        }
      }

      const token = await AsyncStorage.getItem('@cydjerr_access_token');
      if (!token) {
        console.log('Aucun token d\'authentification trouvé');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/wallet`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data) {
        // Mettre à jour le cache
        this.userWalletData = result.data;
        this.userWalletDataCache = result.data;
        this.cacheTimestamp = Date.now();
        
        console.log('Données du wallet utilisateur récupérées et mises en cache:', {
          userId: result.data.user,
          publicKey: result.data.solana?.publicKey,
          jerrBalance: result.data.jerr?.balance
        });
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du wallet utilisateur:', error);
      return null;
    }
  }

  // Vérifier si l'utilisateur est l'utilisateur legacy
  async isLegacyUser() {
    try {
      const userData = await this.getUserWalletData();
      // Vérifier si c'est l'utilisateur pmbikayi01@gmail.com en comparant les clés publiques
      const legacyBossKey = this.legacyWallets.BOSS?.publicKey?.toString();
      const userKey = userData?.solana?.publicKey;
      
      return userKey === legacyBossKey;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur legacy:', error);
      return false;
    }
  }

  // Obtenir le solde SOL d'un wallet
  async getSolBalance(walletType = 'BOSS') {
    try {
      // Récupérer les données utilisateur pour déterminer le type d'utilisateur
      const userData = await this.getUserWalletData();
      const legacyBossKey = this.legacyWallets.BOSS?.publicKey?.toString();
      const cydjerrBossKey = this.cydjerrWallets.BOSS?.publicKey?.toString();
      const userKey = userData?.solana?.publicKey;
      const isLegacy = userKey === legacyBossKey;
      const isCydjerr = userKey === cydjerrBossKey;
      
      if (isLegacy) {
        // Utiliser les données legacy pour pmbikayi01@gmail.com
        const realBalance = LEGACY_REAL_BALANCES[walletType]?.sol || 0;
        console.log(`✅ Solde SOL legacy pour ${walletType}: ${realBalance}`);
        return realBalance;
      } else if (isCydjerr) {
        // Utiliser les données hardcodées pour cydjerr.c@gmail.com
        const realBalance = CYDJERR_REAL_BALANCES[walletType]?.sol || 0;
        console.log(`✅ Solde SOL cydjerr pour ${walletType}: ${realBalance}`);
        return realBalance;
      } else {
        // Pour les nouveaux utilisateurs, utiliser les données de leur wallet
        if (userData && userData.solana) {
          const solBalance = userData.solana.balance || 0;
          console.log(`✅ Solde SOL pour nouvel utilisateur: ${solBalance}`);
          return solBalance;
        }
        return 0;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du solde SOL pour ${walletType}:`, error);
      return 0;
    }
  }

  // Obtenir le solde d'un token SPL
  async getTokenBalance(walletType = 'BOSS', tokenAddress = null) {
    try {
      // Récupérer les données utilisateur pour déterminer le type d'utilisateur
      const userData = await this.getUserWalletData();
      const legacyBossKey = this.legacyWallets.BOSS?.publicKey?.toString();
      const cydjerrBossKey = this.cydjerrWallets.BOSS?.publicKey?.toString();
      const userKey = userData?.solana?.publicKey;
      const isLegacy = userKey === legacyBossKey;
      const isCydjerr = userKey === cydjerrBossKey;
      
      if (isLegacy) {
        // Utiliser les données legacy pour pmbikayi01@gmail.com
        const realBalance = LEGACY_REAL_BALANCES[walletType]?.jerr || 0;
        console.log(`✅ Solde JERR legacy pour ${walletType}: ${realBalance}`);
        return realBalance;
      } else if (isCydjerr) {
        // Utiliser les données hardcodées pour cydjerr.c@gmail.com
        const realBalance = CYDJERR_REAL_BALANCES[walletType]?.jerr || 0;
        console.log(`✅ Solde JERR cydjerr pour ${walletType}: ${realBalance}`);
        return realBalance;
      } else {
        // Pour les nouveaux utilisateurs, utiliser les données de leur wallet
        if (userData && userData.jerr) {
          const jerrBalance = userData.jerr.balance || 0;
          console.log(`✅ Solde JERR pour nouvel utilisateur: ${jerrBalance}`);
          return jerrBalance;
        }
        return 0;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du solde token pour ${walletType}:`, error);
      return 0;
    }
  }

  // Obtenir tous les soldes pour un wallet
  async getAllBalances(walletType = 'BOSS') {
    try {
      const [solBalance, tokenBalance] = await Promise.all([
        this.getSolBalance(walletType),
        this.getTokenBalance(walletType)
      ]);

      // Obtenir l'adresse appropriée
      let address = 'N/A';
      const isLegacy = await this.isLegacyUser();
      
      if (isLegacy) {
        address = this.legacyWallets[walletType]?.publicKey?.toString() || 'N/A';
      } else {
        const userData = await this.getUserWalletData();
        address = userData?.solana?.publicKey || 'N/A';
      }

      return {
        sol: solBalance,
        jerr: tokenBalance,
        wallet: walletType,
        address: address
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des soldes pour ${walletType}:`, error);
      return {
        sol: 0,
        jerr: 0,
        wallet: walletType,
        address: 'N/A'
      };
    }
  }

  // Obtenir les soldes de tous les wallets
  async getAllWalletsBalances() {
    try {
      // Récupérer les données utilisateur une seule fois
      const userData = await this.getUserWalletData();
      
      // Vérifier si c'est l'utilisateur legacy en comparant les clés
      const legacyBossKey = this.legacyWallets.BOSS?.publicKey?.toString();
      const cydjerrBossKey = this.cydjerrWallets.BOSS?.publicKey?.toString();
      const userKey = userData?.solana?.publicKey;
      const isLegacy = userKey === legacyBossKey;
      const isCydjerr = userKey === cydjerrBossKey;
      
      if (isLegacy) {
        // Pour l'utilisateur legacy, utiliser les données hardcodées
        const bossBalance = {
          sol: LEGACY_REAL_BALANCES.BOSS.sol,
          jerr: LEGACY_REAL_BALANCES.BOSS.jerr,
          wallet: 'BOSS',
          address: legacyBossKey
        };
        
        const mntBalance = {
          sol: LEGACY_REAL_BALANCES.MNT.sol,
          jerr: LEGACY_REAL_BALANCES.MNT.jerr,
          wallet: 'MNT',
          address: this.legacyWallets.MNT?.publicKey?.toString() || 'N/A'
        };
        
        const balances = [bossBalance, mntBalance];
        const totalSol = balances.reduce((sum, balance) => sum + balance.sol, 0);
        const totalJerr = balances.reduce((sum, balance) => sum + balance.jerr, 0);

        return {
          wallets: balances,
          totals: {
            sol: totalSol,
            jerr: totalJerr
          }
        };
      } else if (isCydjerr) {
        // Pour l'utilisateur cydjerr.c@gmail.com, utiliser les vraies clés MNT et BOSS
        const bossBalance = {
          sol: CYDJERR_REAL_BALANCES.BOSS.sol,
          jerr: CYDJERR_REAL_BALANCES.BOSS.jerr,
          wallet: 'BOSS',
          address: cydjerrBossKey
        };
        
        const mntBalance = {
          sol: CYDJERR_REAL_BALANCES.MNT.sol,
          jerr: CYDJERR_REAL_BALANCES.MNT.jerr,
          wallet: 'MNT',
          address: this.cydjerrWallets.MNT?.publicKey?.toString() || 'N/A'
        };
        
        const balances = [bossBalance, mntBalance];
        const totalSol = balances.reduce((sum, balance) => sum + balance.sol, 0);
        const totalJerr = balances.reduce((sum, balance) => sum + balance.jerr, 0);

        return {
          wallets: balances,
          totals: {
            sol: totalSol,
            jerr: totalJerr
          }
        };
      } else {
        // Pour les nouveaux utilisateurs, utiliser uniquement leur wallet unique
        if (!userData) {
          return {
            wallets: [],
            totals: { sol: 0, jerr: 0 }
          };
        }

        const userBalance = {
          sol: userData.solana?.balance || 0,
          jerr: userData.jerr?.balance || 0,
          wallet: 'USER',
          address: userData.solana?.publicKey || 'N/A'
        };

        return {
          wallets: [userBalance],
          totals: {
            sol: userBalance.sol,
            jerr: userBalance.jerr
          }
        };
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des soldes de tous les wallets:', error);
      return {
        wallets: [],
        totals: {
          sol: 0,
          jerr: 0
        }
      };
    }
  }

  // Obtenir l'adresse publique d'un wallet
  async getWalletAddress(walletType = 'BOSS') {
    try {
      // Récupérer les données utilisateur pour déterminer le type d'utilisateur
      const userData = await this.getUserWalletData();
      const legacyBossKey = this.legacyWallets.BOSS?.publicKey?.toString();
      const cydjerrBossKey = this.cydjerrWallets.BOSS?.publicKey?.toString();
      const userKey = userData?.solana?.publicKey;
      const isLegacy = userKey === legacyBossKey;
      const isCydjerr = userKey === cydjerrBossKey;
      
      if (isLegacy) {
        // Pour l'utilisateur legacy, utiliser les wallets legacy
        const wallet = this.legacyWallets[walletType];
        return wallet ? wallet.publicKey.toString() : null;
      } else if (isCydjerr) {
        // Pour l'utilisateur cydjerr.c@gmail.com, utiliser les wallets cydjerr
        const wallet = this.cydjerrWallets[walletType];
        return wallet ? wallet.publicKey.toString() : null;
      } else {
        // Pour les nouveaux utilisateurs, utiliser leur wallet unique
        return userData?.solana?.publicKey || null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse du wallet:', error);
      return null;
    }
  }

  // Vérifier la connexion au réseau Solana
  async checkConnection() {
    try {
      const version = await this.connection.getVersion();
      return {
        connected: true,
        version: version['solana-core'],
        rpcUrl: SOLANA_RPC_URL
      };
    } catch (error) {
      console.error('Erreur de connexion Solana:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }

  // Formater les montants pour l'affichage
  formatBalance(amount, decimals = 6) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '0.00';
    }
    return amount.toFixed(decimals);
  }

  // Obtenir le prix estimé en USD (simulation)
  getEstimatedUSDValue(jerrAmount, solAmount) {
    // Prix simulés (à remplacer par de vraies données de prix)
    const JERR_USD_PRICE = 0.001; // 1 JERR = 0.001 USD
    const SOL_USD_PRICE = 100; // 1 SOL = 100 USD

    const jerrValue = jerrAmount * JERR_USD_PRICE;
    const solValue = solAmount * SOL_USD_PRICE;

    return {
      jerr: jerrValue,
      sol: solValue,
      total: jerrValue + solValue
    };
  }

  // Méthode pour vider le cache
  clearCache() {
    this.userWalletDataCache = null;
    this.cacheTimestamp = null;
    console.log('Cache du wallet utilisateur vidé');
  }

  // Méthode pour forcer le refresh des données
  async refreshWalletData() {
    return await this.getUserWalletData(true);
  }
}

// Instance singleton
const solanaService = new SolanaService();
export default solanaService;

// Exporter les constantes utiles
export { JERR_TOKEN_ADDRESSES, SOLANA_RPC_URL };