import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import walletService from '../services/walletService';
import solanaService from '../services/solanaService';
import investmentService from '../services/investmentService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const CapiJerrProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  // Hooks
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [stats, setStats] = useState(null);
  
  const glowAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Récupérer le vrai numéro de compte Solana
  const getSolanaAccountNumber = useCallback(async () => {
    try {
      // Récupérer l'adresse du wallet BOSS comme numéro de compte principal
      const bossAddress = await solanaService.getWalletAddress('BOSS');
      if (bossAddress && typeof bossAddress === 'string' && bossAddress.length > 16) {
        // Formater l'adresse pour l'affichage (premiers 8 et derniers 8 caractères)
        return `${bossAddress.substring(0, 8)}...${bossAddress.substring(bossAddress.length - 8)}`;
      }
      return 'Non disponible';
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse Solana:', error);
      return 'Non disponible';
    }
  }, []);

  const loadProfileData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Charger les données du profil CapiJerr
      const [globalStats, userPlans, walletInfo, transactionHistory, accountNumber, fullAccountNumber] = await Promise.all([
        investmentService.getGlobalStats().catch(() => ({})),
        investmentService.getAllPlans().catch(() => []),
        solanaService.getAllWalletsBalances().catch(() => null),
        investmentService.getTransactionHistory().catch(() => []),
        getSolanaAccountNumber(),
        solanaService.getWalletAddress('BOSS').catch(() => 'Non disponible')
      ]);

      // Calculer les statistiques du compte
      const totalInvested = userPlans.reduce((sum, plan) => sum + (plan.balance || 0), 0);
      const totalReturn = userPlans.reduce((sum, plan) => sum + (plan.performance || 0), 0) / userPlans.length || 0;
      const activePlans = userPlans.length;
      
      setAccountData({
        accountNumber,
        fullAccountNumber, // Adresse complète pour la copie
        totalInvested,
        totalReturn,
        activePlans,
        memberSince: user?.createdAt || new Date().toISOString(),
        status: 'Actif',
        tier: totalInvested > 10000 ? 'Premium' : totalInvested > 5000 ? 'Gold' : 'Standard'
      });

      setStats(globalStats);
      setWalletData(walletInfo);
      setInvestmentHistory(transactionHistory.slice(0, 10)); // Dernières 10 transactions
      
    } catch (error) {
      console.error('Erreur lors du chargement des données du profil:', error);
      // Données par défaut en cas d'erreur
      try {
        const [accountNumber, fullAccountNumber] = await Promise.all([
          getSolanaAccountNumber(),
          solanaService.getWalletAddress('BOSS').catch(() => 'Non disponible')
        ]);
        
        setAccountData({
          accountNumber,
          fullAccountNumber,
          totalInvested: 0,
          totalReturn: 0,
          activePlans: 0,
          memberSince: user?.createdAt || new Date().toISOString(),
          status: 'Actif',
          tier: 'Standard'
        });
      } catch (fallbackError) {
        console.error('Erreur lors de la récupération des données de fallback:', fallbackError);
        setAccountData({
          accountNumber: 'Non disponible',
          fullAccountNumber: 'Non disponible',
          totalInvested: 0,
          totalReturn: 0,
          activePlans: 0,
          memberSince: user?.createdAt || new Date().toISOString(),
          status: 'Actif',
          tier: 'Standard'
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, getSolanaAccountNumber]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfileData();
  }, [loadProfileData]);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user, loadProfileData]);

  useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, [glowAnim]);

  const copyAccountNumber = () => {
    if (accountData?.fullAccountNumber) {
      Clipboard.setString(accountData.fullAccountNumber);
      Alert.alert('Copié', 'Adresse Solana complète copiée dans le presse-papiers');
    }
  };

  const handleViewFullHistory = () => {
    navigation.navigate('InvestmentHistory', { 
      transactions: investmentHistory, 
      investmentService 
    });
  };

  const handleManageInvestments = () => {
    navigation.goBack(); // Retour à l'écran CapiJerr principal
  };



  const handleSupport = () => {
    Alert.alert(
      'Support CapiJerr',
      'Pour toute assistance, contactez notre équipe support à support@capijerr.com',
      [{ text: 'OK' }]
    );
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Premium': return '#d7db3a';
      case 'Gold': return '#FFD700';
      default: return '#00f4b0';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Premium': return 'star';
      case 'Gold': return 'award';
      default: return 'user';
    }
  };

  const renderAccountCard = () => (
    <View style={styles.accountCard}>
      <BlurView blurAmount={15} blurType="light" style={styles.accountCardBlur}>
        <View style={styles.accountCardContent}>
          <View style={styles.accountHeader}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </Text>
                <View style={styles.tierContainer}>
                  <Feather 
                    name={getTierIcon(accountData?.tier)} 
                    size={14} 
                    color={getTierColor(accountData?.tier)} 
                  />
                  <Text style={[styles.tierText, { color: getTierColor(accountData?.tier) }]}>
                    {accountData?.tier}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{accountData?.status}</Text>
            </View>
          </View>
          
          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountNumberLabel}>Numéro de Compte CapiJerr</Text>
            <TouchableOpacity 
              style={styles.accountNumberRow}
              onPress={copyAccountNumber}
              activeOpacity={0.7}
            >
              <Text style={styles.accountNumber}>{accountData?.accountNumber}</Text>
              <Feather name="copy" size={18} color="#d7db3a" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.memberSinceContainer}>
            <Text style={styles.memberSinceLabel}>Membre depuis</Text>
            <Text style={styles.memberSinceValue}>
              {new Date(accountData?.memberSince).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long'
              })}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );

  const renderStatsGrid = () => {
    // Calculer la valeur totale en euros (1 JERR = 0.01 EUR)
    const totalJerrValue = (walletData?.totals?.jerr || 0) * 0.01;
    
    return (
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Aperçu du Portefeuille</Text>
        <View style={styles.statsGrid}>
          {/* Valeur Totale en Euros */}
          <View style={styles.statCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.statCardContent}>
              <Feather name="circle" size={20} color="#00f4b0" />
              <Text style={styles.statValue}>
                {totalJerrValue.toFixed(2)} €
              </Text>
              <Text style={styles.statLabel}>Valeur Portefeuille</Text>
            </BlurView>
          </View>
          
          {/* JERR Disponibles */}
          <View style={styles.statCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.statCardContent}>
              <Feather name="circle" size={20} color="#d7db3a" />
              <Text style={styles.statValue}>
                {walletData?.totals?.jerr?.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) || '0'}
              </Text>
              <Text style={styles.statLabel}>JERR Disponibles</Text>
            </BlurView>
          </View>
          
          {/* SOL Disponibles */}
          <View style={styles.statCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.statCardContent}>
              <Feather name="sun" size={20} color="#ff9500" />
              <Text style={styles.statValue}>
                {walletData?.totals?.sol?.toFixed(4) || '0.0000'}
              </Text>
              <Text style={styles.statLabel}>SOL Disponibles</Text>
            </BlurView>
          </View>
          
          {/* Plans Actifs */}
          <View style={styles.statCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.statCardContent}>
              <Feather name="briefcase" size={20} color="#d7db3a" />
              <Text style={styles.statValue}>{accountData?.activePlans || 0}</Text>
              <Text style={styles.statLabel}>Plans Actifs</Text>
            </BlurView>
          </View>
        </View>
      </View>
    );
  };

  const renderRecentActivity = () => (
    <View style={styles.activitySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Activité Récente</Text>
        <TouchableOpacity onPress={handleViewFullHistory}>
          <Text style={styles.viewAllText}>Voir tout</Text>
        </TouchableOpacity>
      </View>
      
      {investmentHistory.length > 0 ? (
        investmentHistory.slice(0, 5).map((transaction, index) => (
          <View key={index} style={styles.activityItem}>
            <BlurView blurAmount={10} blurType="light" style={styles.activityItemBlur}>
              <View style={styles.activityIcon}>
                <Feather 
                  name={transaction.type === 'investment' ? 'arrow-up-right' : 'arrow-down-left'} 
                  size={16} 
                  color={transaction.type === 'investment' ? '#00f4b0' : '#ff6b6b'} 
                />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>
                  {transaction.type === 'investment' ? 'Investissement' : 'Retrait'}
                </Text>
                <Text style={styles.activitySubtitle}>
                  {transaction.planName || 'Plan d\'investissement'}
                </Text>
              </View>
              <View style={styles.activityAmount}>
                <Text style={[styles.activityValue, { 
                  color: transaction.type === 'investment' ? '#00f4b0' : '#ff6b6b' 
                }]}>
                  {transaction.type === 'investment' ? '+' : '-'}{transaction.amount?.toFixed(2) || '0.00'} JERR
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(transaction.date || Date.now()).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            </BlurView>
          </View>
        ))
      ) : (
        <View style={styles.emptyActivity}>
          <Feather name="activity" size={48} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyActivityText}>Aucune activité récente</Text>
        </View>
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionsSection}>
      <Text style={styles.sectionTitle}>Actions Rapides</Text>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleManageInvestments}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#d7db3a', '#b8c832']}
          style={styles.actionButtonGradient}
        >
          <Feather name="trending-up" size={24} color="#000" />
          <Text style={styles.actionButtonText}>Gérer mes Investissements</Text>
          <Feather name="arrow-right" size={20} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.secondaryActionButton}
        onPress={handleViewFullHistory}
        activeOpacity={0.8}
      >
        <BlurView blurAmount={15} blurType="light" style={styles.secondaryActionBlur}>
          <Feather name="clock" size={20} color="white" />
          <Text style={styles.secondaryActionText}>Historique Complet</Text>
        </BlurView>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.supportButton}
        onPress={handleSupport}
        activeOpacity={0.8}
      >
        <BlurView blurAmount={15} blurType="light" style={styles.supportButtonBlur}>
          <Feather name="help-circle" size={20} color="#00f4b0" />
          <Text style={styles.supportButtonText}>Support CapiJerr</Text>
        </BlurView>
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#7a006e', '#006e8e']}
          style={styles.backgroundGradient}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d7db3a" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#7a006e', '#006e8e']}
          style={styles.backgroundGradient}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d7db3a" />
          <Text style={styles.loadingText}>Chargement de votre profil CapiJerr...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7a006e', '#006e8e']}
        style={styles.backgroundGradient}
      />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Animated.Text 
              style={[
                styles.headerTitle,
                {
                  transform: [{ scale: glowAnim }]
                }
              ]}
            >
              Mon Profil CapiJerr
            </Animated.Text>
          </View>
          
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.headerBorder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#d7db3a"
            colors={['#d7db3a']}
          />
        }
      >
        {renderAccountCard()}
        {renderStatsGrid()}
        {renderRecentActivity()}
        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
    paddingBottom: 12,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 24,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  headerBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: '#00f4b0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    marginTop: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  
  // Account Card Styles
  accountCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  accountCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  accountCardContent: {
    padding: 24,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d7db3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  tierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tierText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00f4b0',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#00f4b0',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  accountNumberContainer: {
    marginBottom: 16,
  },
  accountNumberLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d7db3a',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  memberSinceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberSinceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  memberSinceValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  
  // Stats Section
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardContent: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  
  // Activity Section
  activitySection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#d7db3a',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  activityItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItemBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  activitySubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  activityAmount: {
    alignItems: 'flex-end',
  },
  activityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  activityDate: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyActivityText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  
  // Actions Section
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryActionButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  secondaryActionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  supportButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  supportButtonBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 244, 176, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00f4b0',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
});

export default CapiJerrProfileScreen;