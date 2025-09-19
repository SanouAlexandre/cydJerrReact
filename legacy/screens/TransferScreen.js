import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import walletService from '../services/walletService';
import solanaService from '../services/solanaService';
import userService from '../services/api/userService';

const TransferScreen = ({ navigation }) => {
  const [recipientAccount, setRecipientAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [lastLoadTime, setLastLoadTime] = useState(null);
  const CACHE_DURATION = 60000; // 1 minute de cache

  useEffect(() => {
    // Charger le profil utilisateur et le solde au montage du composant
    loadUserData();
  }, []);

  const loadUserData = async (forceRefresh = false) => {
    // Vérifier le cache avant de faire des appels API
    const now = Date.now();
    if (!forceRefresh && lastLoadTime && (now - lastLoadTime < CACHE_DURATION) && isDataLoaded) {
      console.log('Utilisation du cache TransferScreen');
      return;
    }

    // Éviter les appels multiples
    if (loadingProfile && !forceRefresh) {
      return;
    }

    try {
      setLoadingProfile(true);
      
      // Utiliser le cache de solanaService d'abord
      let solanaData = null;
      try {
        // Essayer d'utiliser les données en cache
        solanaData = await solanaService.getAllWalletsBalances();
      } catch (error) {
        console.warn('Erreur lors de la récupération du solde Solana:', error);
        // En cas d'erreur, utiliser une valeur par défaut
        solanaData = { totals: { jerr: 0 } };
      }
      
      // Charger le profil utilisateur seulement si nécessaire
      let profileResult = null;
      if (!userProfile || forceRefresh) {
        try {
          profileResult = await userService.getProfile();
          if (profileResult.success) {
            setUserProfile(profileResult.user);
          }
        } catch (error) {
          console.warn('Erreur lors de la récupération du profil:', error);
        }
      }
      
      // Traiter le solde JERR
      const totalJerrBalance = solanaData?.totals?.jerr || 0;
      setBalance(totalJerrBalance);
      
      setIsDataLoaded(true);
      setLastLoadTime(now);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Ne pas afficher d'alerte pour éviter de spammer l'utilisateur
      // Alert.alert('Erreur', 'Impossible de charger les données utilisateur');
    } finally {
      setLoadingProfile(false);
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await walletService.searchUsers(query, 5);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      Alert.alert('Erreur', 'Erreur lors de la recherche d\'utilisateurs');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    // Utiliser la clé publique Solana au lieu de l'email
    setRecipientAccount(user.wallet?.solana?.publicKey || user.accountNumber);
    setShowUserSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const validateForm = () => {
    if (!recipientAccount.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir la clé publique du destinataire');
      return false;
    }

    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return false;
    }

    if (parseFloat(amount) > balance) {
      Alert.alert('Erreur', 'Solde insuffisant');
      return false;
    }

    return true;
  };

  const showUserProfile = () => {
    if (!userProfile) {
      Alert.alert('Information', 'Profil utilisateur non disponible');
      return;
    }

    const accountNumber = userProfile.wallet?.solana?.publicKey || 'Non disponible';
    const displayAccount = accountNumber.length > 20 
      ? `${accountNumber.substring(0, 10)}...${accountNumber.substring(accountNumber.length - 10)}`
      : accountNumber;

    Alert.alert(
      'Profil Utilisateur',
      `Nom: ${userProfile.firstName} ${userProfile.lastName}\n` +
      `Email: ${userProfile.email}\n` +
      `Numéro de compte: ${displayAccount}\n` +
      `Solde JERR: ${balance.toFixed(2)} JERR`,
      [{ text: 'OK' }]
    );
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    Alert.alert(
      'Confirmer le transfert',
      `Êtes-vous sûr de vouloir transférer ${amount} JERR à la clé publique ${recipientAccount} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await walletService.transferJerr({
                recipientAccount: recipientAccount.trim(),
                amount: parseFloat(amount),
                message: message.trim()
              });

              Alert.alert(
                'Transfert réussi',
                `${amount} JERR ont été transférés avec succès`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Vider le cache et recharger les données
                      solanaService.clearCache();
                      setIsDataLoaded(false);
                      setLastLoadTime(null);
                      // Réinitialiser le formulaire
                      setRecipientAccount('');
                      setAmount('');
                      setMessage('');
                      // Recharger les données immédiatement
                      loadUserData(true);
                    }
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Erreur', error.message || 'Erreur lors du transfert');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item)}
    >
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={styles.backgroundGradient}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transférer JERR</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => loadUserData(true)}
            disabled={loadingProfile}
          >
            <Ionicons 
              name="refresh" 
              size={20} 
              color={loadingProfile ? "#666" : "#00f4b0"} 
            />
          </TouchableOpacity>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceContainer}>
          <BlurView blurAmount={15} blurType="light" style={styles.balanceCardBlur}>
            <LinearGradient
              colors={['rgba(215, 219, 58, 0.1)', 'rgba(0, 244, 176, 0.1)']}
              style={styles.balanceGradient}
            >
              <Text style={styles.balanceLabel}>Solde disponible</Text>
              {loadingProfile && !isDataLoaded ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#00f4b0" />
                  <Text style={styles.loadingText}>Chargement...</Text>
                </View>
              ) : (
                <Text style={styles.balanceAmount}>{balance.toFixed(2)} JERR</Text>
              )}
              {userProfile && (
                <Text style={styles.userInfo}>
                  {userProfile.firstName} {userProfile.lastName}
                </Text>
              )}
              {lastLoadTime && (
                <Text style={styles.lastUpdateText}>
                  Mis à jour: {new Date(lastLoadTime).toLocaleTimeString()}
                </Text>
              )}
            </LinearGradient>
          </BlurView>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Recipient */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Clé publique du destinataire</Text>
            <View style={styles.recipientContainer}>
              <TextInput
                style={styles.input}
                placeholder="Clé publique du destinataire"
                value={recipientAccount}
                onChangeText={setRecipientAccount}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setShowUserSearch(true)}
              >
                <Ionicons name="search" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Montant</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
              <Text style={styles.currency}>JERR</Text>
            </View>
            <View style={styles.quickAmounts}>
              {[10, 50, 100, balance].map((quickAmount, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={styles.quickAmountText}>
                    {index === 3 ? 'Max' : quickAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Message */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message (optionnel)</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Ajouter un message..."
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={200}
            />
            <Text style={styles.characterCount}>{message.length}/200</Text>
          </View>
        </View>

        {/* Transfer Button */}
        <TouchableOpacity
          style={[styles.transferButtonContainer, loading && styles.transferButtonDisabled]}
          onPress={handleTransfer}
          disabled={loading}
        >
          <LinearGradient
            colors={['#d7db3a', '#00f4b0']}
            style={styles.transferButton}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.transferButtonText}>Transférer</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* User Search Modal */}
      <Modal
        visible={showUserSearch}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowUserSearch(false);
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              <Text style={styles.modalCloseText}>Fermer</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Rechercher un utilisateur</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Nom ou clé publique..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                searchUsers(text);
              }}
              autoFocus
            />
          </View>

          {searchLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              style={styles.userList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                searchQuery.length >= 2 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Tapez au moins 2 caractères pour rechercher</Text>
                  </View>
                )
              }
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  userIconButton: {
    padding: 4,
  },
  userIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  balanceContainer: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  balanceCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  balanceGradient: {
    padding: 24,
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    textAlign: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00f4b0',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
  },
  lastUpdateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: 'white',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00f4b0',
  },
  quickAmounts: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  quickAmountButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickAmountText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'right',
    marginTop: 5,
  },
  transferButtonContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  transferButton: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferButtonDisabled: {
    opacity: 0.6,
  },
  transferButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#00f4b0',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00f4b0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userAvatarText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default TransferScreen;