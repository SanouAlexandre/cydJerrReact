import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import {launchImageLibrary, MediaType, ImagePickerResponse} from 'react-native-image-picker';
import { starJerrTokens } from '../utils/starJerrTokens';
import capiJerrService from '../services/capiJerrService';
import starService from '../services/starService';

// Mock data pour les tokens existants de l'utilisateur
const mockUserTokens = [
  {
    id: 1,
    name: 'BEYONCE',
    symbol: 'BEY',
    totalSupply: '1000000',
    currentPrice: '2500J',
    marketCap: '125MJ',
    holders: 1250,
    volume24h: '15.2MJ',
    change24h: '+5.2%',
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=B',
    createdAt: '2024-01-15',
    status: 'active',
  },
];

const StarTokensScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Sélecteurs Redux pour l'authentification
  const { isAuthenticated, user } = useSelector(state => state.user);
  
  // Obtenir les dimensions de l'écran et la hauteur de la status bar
  const { height: screenHeight } = Dimensions.get('window');
  const statusBarHeight = getStatusBarHeight();
  
  // Calculer le padding top responsive
  const getResponsivePaddingTop = () => {
    if (Platform.OS === 'ios') {
      // Pour iOS, gérer les différents modèles
      if (screenHeight >= 812) {
        // iPhone X et plus récents (avec notch)
        return statusBarHeight + 10;
      } else {
        // iPhone 8 et plus anciens
        return statusBarHeight + 5;
      }
    } else {
      // Pour Android, gérer les différents appareils
      if (screenHeight >= 800) {
        // Appareils Android grands écrans (Samsung S20, etc.)
        return statusBarHeight + 15;
      } else {
        // Appareils Android standards
        return statusBarHeight + 10;
      }
    }
  };
  
  // États pour la création de token
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tokenForm, setTokenForm] = useState({
    name: '',
    symbol: '',
    description: '',
    totalSupply: '',
    initialPrice: '',
    image: null,
  });
  const [userTokens, setUserTokens] = useState(mockUserTokens);
  const [loading, setLoading] = useState(false);
  const [balanceCheck, setBalanceCheck] = useState(null);
  const [checkingBalance, setCheckingBalance] = useState(false);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Vérifier la balance CapiJerr seulement si l'utilisateur est connecté
    if (isAuthenticated && user) {
      checkCapiJerrBalance();
    } else {
      // Si l'utilisateur n'est pas connecté, définir un état par défaut
      setBalanceCheck({
        canCreate: false,
        balance: 0,
        message: 'Vous devez être connecté pour créer un token'
      });
    }
  }, [isAuthenticated, user]);
  
  const checkCapiJerrBalance = async () => {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!isAuthenticated || !user) {
      setBalanceCheck({
        canCreate: false,
        balance: 0,
        message: 'Vous devez être connecté pour créer un token'
      });
      return;
    }

    setCheckingBalance(true);
    try {
      const result = await capiJerrService.canCreateStarToken();
      setBalanceCheck(result);
    } catch (error) {
      console.error('Erreur lors de la vérification de balance:', error);
      setBalanceCheck({
        canCreate: false,
        balance: 0,
        message: 'Erreur de connexion à CapiJerr'
      });
    } finally {
      setCheckingBalance(false);
    }
  };

  // Fonctions de trading
  const handleBuyToken = (token) => {
    Alert.alert(
      'Acheter des StarTokens',
      `Voulez-vous acheter des tokens ${token.name} (${token.symbol}) ?\n\nPrix actuel: ${token.currentPrice}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Acheter', 
          onPress: () => {
            // TODO: Implémenter l'achat de tokens
            Alert.alert('Succès', `Achat de tokens ${token.name} en cours...`);
          }
        }
      ]
    );
  };

  const handleSellToken = (token) => {
    Alert.alert(
      'Vendre des StarTokens',
      `Voulez-vous vendre vos tokens ${token.name} (${token.symbol}) ?\n\nPrix actuel: ${token.currentPrice}`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Vendre', 
          onPress: () => {
            // TODO: Implémenter la vente de tokens
            Alert.alert('Succès', `Vente de tokens ${token.name} en cours...`);
          }
        }
      ]
    );
  };

  const handleTradeToken = (token) => {
    Alert.alert(
      'Échanger des StarTokens',
      `Voulez-vous échanger vos tokens ${token.name} (${token.symbol}) contre d'autres StarTokens ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Échanger', 
          onPress: () => {
            // TODO: Implémenter l'échange de tokens
            Alert.alert('Succès', `Échange de tokens ${token.name} en cours...`);
          }
        }
      ]
    );
  };
  
  const handleCreateToken = () => {
    // Vérifier d'abord si l'utilisateur est connecté
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour créer un StarToken.',
        [
          {
            text: 'Se connecter',
            onPress: () => navigation.navigate('Login')
          },
          { text: 'Annuler', style: 'cancel' }
        ]
      );
      return;
    }

    if (!balanceCheck?.canCreate) {
      Alert.alert(
        'Balance insuffisante',
        balanceCheck?.message || 'Vous devez avoir au moins 100M Jerr dans votre wallet CapiJerr pour créer un StarToken.',
        [
          {
            text: 'Aller à CapiJerr',
            onPress: () => navigation.navigate('CapiJerr')
          },
          {
            text: 'Actualiser',
            onPress: checkCapiJerrBalance
          },
          { text: 'Annuler', style: 'cancel' }
        ]
      );
      return;
    }
    
    setShowCreateModal(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  
  const closeCreateModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowCreateModal(false);
      setTokenForm({
        name: '',
        symbol: '',
        description: '',
        totalSupply: '',
        initialPrice: '',
        image: null,
      });
    });
  };
  
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return;
      }
      
      if (response.errorMessage) {
        console.error('Erreur lors de la sélection de l\'image:', response.errorMessage);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        setTokenForm({ ...tokenForm, image: response.assets[0].uri });
      }
    });
  };
  
  const validateForm = () => {
    if (!tokenForm.name.trim()) {
      Alert.alert('Erreur', 'Le nom du token est requis');
      return false;
    }
    if (!tokenForm.symbol.trim()) {
      Alert.alert('Erreur', 'Le symbole du token est requis');
      return false;
    }
    if (!tokenForm.description.trim()) {
      Alert.alert('Erreur', 'La description du token est requise');
      return false;
    }
    if (!tokenForm.totalSupply || parseInt(tokenForm.totalSupply) <= 0) {
      Alert.alert('Erreur', 'Le nombre total de tokens doit être supérieur à 0');
      return false;
    }
    if (!tokenForm.initialPrice || parseFloat(tokenForm.initialPrice) <= 0) {
      Alert.alert('Erreur', 'Le prix initial doit être supérieur à 0');
      return false;
    }
    return true;
  };
  
  const submitTokenCreation = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Créer la star avec token via l'API backend
      const starData = {
        name: tokenForm.name,
        symbol: tokenForm.symbol,
        description: tokenForm.description,
        totalSupply: tokenForm.totalSupply,
        initialPrice: tokenForm.initialPrice
      };
      
      const result = await starService.createStarToken(starData, tokenForm.image);
      
      if (result.success) {
        const newToken = {
          id: result.data._id,
          name: tokenForm.name.toUpperCase(),
          symbol: tokenForm.symbol.toUpperCase(),
          totalSupply: tokenForm.totalSupply,
          currentPrice: `${tokenForm.initialPrice}J`,
          marketCap: `${(parseInt(tokenForm.totalSupply) * parseFloat(tokenForm.initialPrice) / 1000000).toFixed(1)}MJ`,
          holders: 1,
          volume24h: '0J',
          change24h: '0%',
          image: result.data.profileImage || tokenForm.image || 'https://via.placeholder.com/150x150/FFD700/000000?text=' + tokenForm.symbol[0],
          createdAt: new Date().toISOString().split('T')[0],
          status: 'active',
        };
        
        setUserTokens([...userTokens, newToken]);
        
        Alert.alert(
          'Token créé avec succès!',
          `Votre token ${newToken.name} (${newToken.symbol}) a été créé et est maintenant disponible sur StarJerr.`,
          [{ text: 'OK' }]
        );
        
        closeCreateModal();
      } else {
        throw new Error(result.message || 'Erreur lors de la création du token');
      }
    } catch (error) {
      console.error('Erreur création token:', error);
      Alert.alert(
        'Erreur', 
        error.message || 'Une erreur est survenue lors de la création du token. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const renderTokenCard = (token) => {
    const isPositiveChange = token.change24h.startsWith('+');
    
    return (
      <View key={token.id} style={styles.tokenCard}>
        <LinearGradient
          colors={[starJerrTokens.colors.glassBg, 'rgba(15,28,63,0.02)']}
          style={styles.tokenGradient}
        >
          <View style={styles.tokenHeader}>
            <View style={styles.tokenLeft}>
              <Image source={{ uri: token.image }} style={styles.tokenImage} />
              <View style={styles.tokenInfo}>
                <Text style={styles.tokenName}>{token.name}</Text>
                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                <Text style={styles.tokenStatus}>Actif depuis {token.createdAt}</Text>
              </View>
            </View>
            
            <View style={styles.tokenRight}>
              <Text style={styles.tokenPrice}>{token.currentPrice}</Text>
              <Text style={[styles.tokenChange, { color: isPositiveChange ? '#4ECDC4' : '#FF6B6B' }]}>
                {token.change24h}
              </Text>
            </View>
          </View>
          
          <View style={styles.tokenStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>{token.marketCap}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Holders</Text>
              <Text style={styles.statValue}>{token.holders}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Volume 24h</Text>
              <Text style={styles.statValue}>{token.volume24h}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Supply</Text>
              <Text style={styles.statValue}>{parseInt(token.totalSupply).toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.tokenActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleBuyToken(token)}
            >
              <Feather name="plus" size={14} color={starJerrTokens.colors.gold} />
              <Text style={styles.actionButtonText}>Acheter</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSellToken(token)}
            >
              <Feather name="minus" size={14} color={starJerrTokens.colors.gold} />
              <Text style={styles.actionButtonText}>Vendre</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleTradeToken(token)}
            >
              <Feather name="repeat" size={14} color={starJerrTokens.colors.gold} />
              <Text style={styles.actionButtonText}>Échanger</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };
  
  return (
    <LinearGradient
      colors={[starJerrTokens.colors.bgStart, starJerrTokens.colors.bgEnd]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.contentWithPadding,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
              paddingTop: getResponsivePaddingTop(),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={{ color: starJerrTokens.colors.textWhite, fontSize: 20, fontWeight: 'bold' }}>‹</Text>
              </TouchableOpacity>
              
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Mes StarTokens</Text>
              </View>
              
              <View style={styles.headerSpacer} />
            </View>
            
            <Text style={styles.headerSubtitle}>
              Gérez vos tokens de célébrité
            </Text>
          </View>
          
          {/* Balance CapiJerr */}
          <View style={styles.balanceCard}>
            <LinearGradient
              colors={[starJerrTokens.colors.glassBg, 'rgba(15,28,63,0.02)']}
              style={styles.balanceGradient}
            >
              <View style={styles.balanceHeader}>
                <MaterialCommunityIcons name="wallet" size={24} color={starJerrTokens.colors.gold} />
                <Text style={styles.balanceTitle}>Solde CapiJerr</Text>
              </View>
              {checkingBalance ? (
                <View style={styles.balanceLoading}>
                  <ActivityIndicator size="small" color={starJerrTokens.colors.gold} />
                  <Text style={styles.balanceAmount}>Vérification...</Text>
                </View>
              ) : balanceCheck ? (
                <>
                  <Text style={styles.balanceAmount}>
                    {balanceCheck.formattedBalance || `${(balanceCheck.currentBalance / 1000000).toFixed(1)}M Jerr`}
                  </Text>
                  <Text style={styles.balanceRequirement}>
                    {balanceCheck.canCreate ? '✅ Éligible pour créer un token' : '❌ Minimum 100M Jerr requis'}
                  </Text>
                  {balanceCheck.error && (
                    <Text style={styles.balanceError}>{balanceCheck.error}</Text>
                  )}
                </>
              ) : (
                <Text style={styles.balanceAmount}>Erreur de connexion</Text>
              )}
            </LinearGradient>
          </View>
          
          {/* Create Token Button */}
          <TouchableOpacity
            style={[styles.createButton, (!balanceCheck?.canCreate && !checkingBalance) && styles.createButtonDisabled]}
            onPress={handleCreateToken}
            disabled={checkingBalance || !balanceCheck?.canCreate}
          >
            <LinearGradient
              colors={balanceCheck?.canCreate ? [starJerrTokens.colors.gold, '#FFB347'] : ['#666', '#444']}
              style={styles.createButtonGradient}
            >
              {checkingBalance ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <MaterialCommunityIcons 
                  name="plus-circle" 
                  size={20} 
                  color={balanceCheck?.canCreate ? '#000' : '#999'} 
                />
              )}
              <Text style={[styles.createButtonText, (!balanceCheck?.canCreate && !checkingBalance) && styles.createButtonTextDisabled]}>
                {checkingBalance ? 'Vérification...' : 'Créer mon Token'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          {/* User Tokens */}
          <ScrollView 
            style={styles.tokensContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.tokensContent}
          >
            {userTokens.length > 0 ? (
              userTokens.map(renderTokenCard)
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="star-off" size={64} color={starJerrTokens.colors.textGray} />
                <Text style={styles.emptyText}>Aucun token créé</Text>
                <Text style={styles.emptySubtext}>Créez votre premier StarToken pour commencer</Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
        
        {/* Create Token Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="none"
          onRequestClose={closeCreateModal}
        >
          <Animated.View 
            style={[
              styles.modalOverlay,
              {
                opacity: modalAnim,
              },
            ]}
          >
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <Animated.View 
                style={[
                  styles.modalContent,
                  {
                    transform: [{
                      scale: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[starJerrTokens.colors.glassBg, 'rgba(15,28,63,0.1)']}
                  style={styles.modalGradient}
                >
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Créer un StarToken</Text>
                    <TouchableOpacity onPress={closeCreateModal}>
                      <Ionicons name="close" size={24} color={starJerrTokens.colors.textWhite} />
                    </TouchableOpacity>
                  </View>
                  
                  <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                    {/* Image */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Image du token</Text>
                      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        {tokenForm.image ? (
                          <Image source={{ uri: tokenForm.image }} style={styles.selectedImage} />
                        ) : (
                          <View style={styles.imagePlaceholder}>
                            <MaterialCommunityIcons name="camera-plus" size={32} color={starJerrTokens.colors.textGray} />
                            <Text style={styles.imagePlaceholderText}>Ajouter une image</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                    
                    {/* Name */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Nom du token *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Ex: BEYONCE"
                        placeholderTextColor={starJerrTokens.colors.textGray}
                        value={tokenForm.name}
                        onChangeText={(text) => setTokenForm({ ...tokenForm, name: text })}
                      />
                    </View>
                    
                    {/* Symbol */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Symbole *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Ex: BEY"
                        placeholderTextColor={starJerrTokens.colors.textGray}
                        value={tokenForm.symbol}
                        onChangeText={(text) => setTokenForm({ ...tokenForm, symbol: text.toUpperCase() })}
                        maxLength={6}
                      />
                    </View>
                    
                    {/* Description */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Description *</Text>
                      <TextInput
                        style={[styles.formInput, styles.formTextArea]}
                        placeholder="Décrivez votre token..."
                        placeholderTextColor={starJerrTokens.colors.textGray}
                        value={tokenForm.description}
                        onChangeText={(text) => setTokenForm({ ...tokenForm, description: text })}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                    
                    {/* Total Supply */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Nombre total de tokens *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Ex: 1000000"
                        placeholderTextColor={starJerrTokens.colors.textGray}
                        value={tokenForm.totalSupply}
                        onChangeText={(text) => setTokenForm({ ...tokenForm, totalSupply: text.replace(/[^0-9]/g, '') })}
                        keyboardType="numeric"
                      />
                    </View>
                    
                    {/* Initial Price */}
                    <View style={styles.formGroup}>
                      <Text style={styles.formLabel}>Prix initial (en Jerr) *</Text>
                      <TextInput
                        style={styles.formInput}
                        placeholder="Ex: 2500"
                        placeholderTextColor={starJerrTokens.colors.textGray}
                        value={tokenForm.initialPrice}
                        onChangeText={(text) => setTokenForm({ ...tokenForm, initialPrice: text.replace(/[^0-9.]/g, '') })}
                        keyboardType="decimal-pad"
                      />
                    </View>
                    
                    {/* Submit Button */}
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={submitTokenCreation}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={[starJerrTokens.colors.gold, '#FFB347']}
                        style={styles.submitButtonGradient}
                      >
                        {loading ? (
                          <Text style={styles.submitButtonText}>Création en cours...</Text>
                        ) : (
                          <Text style={styles.submitButtonText}>Créer le Token</Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </ScrollView>
                </LinearGradient>
              </Animated.View>
            </KeyboardAvoidingView>
          </Animated.View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: starJerrTokens.spacing.s16,
  },
  contentWithPadding: {
    flex: 1,
    paddingHorizontal: starJerrTokens.spacing.s16,
  },
  
  // Header
  header: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    padding: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s16,
    ...starJerrTokens.shadows.shadowSoft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
  },
  headerSpacer: {
    width: 44,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
  },
  
  // Balance Card
  balanceCard: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  balanceGradient: {
    padding: starJerrTokens.spacing.s16,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    ...starJerrTokens.shadows.shadowSoft,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s8,
  },
  balanceTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginLeft: starJerrTokens.spacing.s8,
  },
  balanceAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.gold,
    marginBottom: starJerrTokens.spacing.s4,
  },
  balanceLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s4,
  },
  balanceRequirement: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  balanceError: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#ff4444',
    marginTop: 4,
  },
  
  // Create Button
  createButton: {
    marginBottom: starJerrTokens.spacing.s16,
    borderRadius: starJerrTokens.radius.r12,
    overflow: 'hidden',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: starJerrTokens.spacing.s16,
    paddingHorizontal: starJerrTokens.spacing.s24,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
    marginLeft: starJerrTokens.spacing.s8,
  },
  createButtonTextDisabled: {
    color: '#999',
  },
  
  // Tokens
  tokensContainer: {
    flex: 1,
  },
  tokensContent: {
    paddingBottom: 100,
  },
  tokenCard: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  tokenGradient: {
    padding: starJerrTokens.spacing.s16,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    ...starJerrTokens.shadows.shadowSoft,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s16,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tokenImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: starJerrTokens.colors.gold,
    marginRight: starJerrTokens.spacing.s12,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  tokenSymbol: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.gold,
  },
  tokenStatus: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  tokenChange: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  tokenStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  tokenActions: {
    flexDirection: 'row',
    gap: starJerrTokens.spacing.s8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r8,
    paddingVertical: starJerrTokens.spacing.s8,
    paddingHorizontal: starJerrTokens.spacing.s12,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.gold,
    marginLeft: 4,
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginTop: starJerrTokens.spacing.s16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: starJerrTokens.spacing.s8,
    textAlign: 'center',
  },
  
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
  },
  modalContent: {
    borderRadius: starJerrTokens.radius.r16,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: starJerrTokens.spacing.s20,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
  },
  modalForm: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s8,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r8,
    paddingVertical: 12,
    paddingHorizontal: starJerrTokens.spacing.s12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textWhite,
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    height: 100,
    borderWidth: 2,
    borderColor: starJerrTokens.colors.borderGlass,
    borderStyle: 'dashed',
    borderRadius: starJerrTokens.radius.r8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: starJerrTokens.radius.r8,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: starJerrTokens.spacing.s8,
  },
  submitButton: {
    marginTop: starJerrTokens.spacing.s16,
    borderRadius: starJerrTokens.radius.r8,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    paddingVertical: starJerrTokens.spacing.s16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
};

export default StarTokensScreen;