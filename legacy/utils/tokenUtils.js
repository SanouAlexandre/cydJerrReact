import { Keypair } from '@solana/web3.js';
import { Platform } from 'react-native';

// Données des tokens (copiées depuis les fichiers JSON)
const TOKEN_DATA = {
  v1: {
    bose: [178,231,223,20,67,197,234,6,154,167,82,150,80,197,208,34,3,2,70,224,81,210,181,32,95,234,234,68,88,219,225,182,8,234,191,63,157,192,213,250,76,73,95,249,223,136,205,149,252,125,125,240,200,171,183,25,198,6,235,185,182,78,114,162],
    mnt: [33,74,234,175,24,6,39,244,232,159,19,40,90,153,9,198,249,244,125,51,143,10,143,66,66,51,198,13,65,253,148,164,11,121,111,35,182,231,137,171,52,49,203,140,111,167,114,36,124,74,52,246,38,219,155,11,148,250,9,225,150,83,112,180]
  },
  v2: {
    bos: [23,25,3,141,113,110,233,52,170,169,161,238,1,217,90,194,194,97,31,190,213,21,89,13,172,184,149,161,185,117,75,221,8,234,190,44,255,155,109,171,23,205,227,137,53,235,25,252,157,22,54,244,50,73,161,214,26,43,143,130,175,163,30,29],
    mnt: [57,175,226,60,107,135,188,59,254,126,106,92,112,125,118,198,199,128,126,116,235,85,94,147,70,67,202,71,23,124,151,11,11,121,114,167,168,37,61,107,16,138,252,251,183,67,133,226,236,252,116,112,182,95,122,254,23,245,240,249,107,149,30,49]
  }
};

// Utilitaires pour gérer les tokens depuis le dossier tkn
class TokenUtils {
  constructor() {
    this.tokenData = TOKEN_DATA;
  }

  // Convertir un tableau de bytes en Keypair Solana
  createKeypairFromBytes(secretKeyBytes) {
    try {
      const uint8Array = new Uint8Array(secretKeyBytes);
      return Keypair.fromSecretKey(uint8Array);
    } catch (error) {
      console.error('Erreur lors de la création du keypair:', error);
      return null;
    }
  }

  // Obtenir l'adresse publique depuis une clé privée
  getPublicKeyFromPrivateKey(secretKeyBytes) {
    try {
      const keypair = this.createKeypairFromBytes(secretKeyBytes);
      return keypair ? keypair.publicKey.toString() : null;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'adresse publique:', error);
      return null;
    }
  }

  // Obtenir toutes les adresses publiques disponibles
  getAllPublicKeys() {
    const publicKeys = {};
    
    try {
      // Version 1
      publicKeys.v1 = {
        bose: this.getPublicKeyFromPrivateKey(this.tokenData.v1.bose),
        mnt: this.getPublicKeyFromPrivateKey(this.tokenData.v1.mnt)
      };
      
      // Version 2
      publicKeys.v2 = {
        bos: this.getPublicKeyFromPrivateKey(this.tokenData.v2.bos),
        mnt: this.getPublicKeyFromPrivateKey(this.tokenData.v2.mnt)
      };
      
      return publicKeys;
    } catch (error) {
      console.error('Erreur lors de la récupération des clés publiques:', error);
      return null;
    }
  }

  // Obtenir l'adresse principale (la plus récente - v2.bos)
  getMainWalletAddress() {
    try {
      return this.getPublicKeyFromPrivateKey(this.tokenData.v2.bos);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse principale:', error);
      return null;
    }
  }

  // Obtenir les informations du wallet principal
  getMainWalletInfo() {
    try {
      const publicKey = this.getMainWalletAddress();
      if (!publicKey) return null;

      return {
        address: publicKey,
        version: 'v2',
        type: 'bos',
        name: 'Wallet Principal JERR',
        isMain: true
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos du wallet:', error);
      return null;
    }
  }

  // Obtenir tous les wallets disponibles
  getAllWallets() {
    try {
      const publicKeys = this.getAllPublicKeys();
      if (!publicKeys) return [];

      const wallets = [];
      
      // Ajouter les wallets v1
      if (publicKeys.v1.bose) {
        wallets.push({
          address: publicKeys.v1.bose,
          version: 'v1',
          type: 'bose',
          name: 'Wallet BOSE v1',
          isMain: false
        });
      }
      
      if (publicKeys.v1.mnt) {
        wallets.push({
          address: publicKeys.v1.mnt,
          version: 'v1',
          type: 'mnt',
          name: 'Wallet MNT v1',
          isMain: false
        });
      }
      
      // Ajouter les wallets v2
      if (publicKeys.v2.bos) {
        wallets.push({
          address: publicKeys.v2.bos,
          version: 'v2',
          type: 'bos',
          name: 'Wallet Principal JERR',
          isMain: true
        });
      }
      
      if (publicKeys.v2.mnt) {
        wallets.push({
          address: publicKeys.v2.mnt,
          version: 'v2',
          type: 'mnt',
          name: 'Wallet MNT v2',
          isMain: false
        });
      }
      
      return wallets;
    } catch (error) {
      console.error('Erreur lors de la récupération de tous les wallets:', error);
      return [];
    }
  }

  // Formater une adresse pour l'affichage
  formatAddress(address, length = 8) {
    if (!address) return 'Adresse non disponible';
    if (address.length <= length * 2) return address;
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`;
  }
}

const tokenUtils = new TokenUtils();
export default tokenUtils;