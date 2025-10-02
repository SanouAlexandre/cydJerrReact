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
  Modal,
  TextInput,
  StatusBar,
} from 'react-native';
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
import { commonUIStyles, UI_CONSTANTS } from '../styles/commonUIStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées pour les plans d'investissement
const mockPlans = [
  {
    id: 1,
    name: 'Plan Conservateur',
    balance: 15420.5,
    yield: 8.2,
    trend: 'up',
    allocation: { stocks: 20, bonds: 80 },
    lastUpdate: '2024-01-15',
  },
];

// Données mockées pour les statistiques
const mockStats = [
  {
    id: 1,
    label: 'TVL Total',
    value: '86.35K',
    unit: 'Jerr',
    trend: 'up',
    change: '+12.5%',
    icon: 'trending-up',
  },
  {
    id: 2,
    label: 'Rendement Annuel',
    value: '12.2',
    unit: '%',
    trend: 'up',
    change: '+2.1%',
    icon: 'percent',
  },
  {
    id: 3,
    label: 'Plans Actifs',
    value: '1',
    unit: '',
    trend: 'flat',
    change: '0',
    icon: 'briefcase',
  },
  {
    id: 4,
    label: 'Performance 30j',
    value: '8.7',
    unit: '%',
    trend: 'up',
    change: '+1.3%',
    icon: 'calendar',
  },
];

const CapiJerrScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  // Fonts loading removed in migration; gate with a static true flag
  const fontsLoaded = true;
  // TOUS LES HOOKS DOIVENT ÊTRE APPELÉS DANS LE MÊME ORDRE À CHAQUE RENDU

  // 1. Hook useFonts en premier
  // 2. Hooks Redux
  const user = useSelector(selectUser);

  // 3. Hooks useState
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [stats, setStats] = useState([]);
  const [plans, setPlans] = useState([]);
  const [solanaBalances, setSolanaBalances] = useState(null);
  const [activeTab, setActiveTab] = useState('Plan 20-80');
  const [walletQR, setWalletQR] = useState(null);
  const [priceHistory, setPriceHistory] = useState(null);
  const [securityInfo, setSecurityInfo] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [transactionFees, setTransactionFees] = useState(null);
  const [syncingBalance, setSyncingBalance] = useState(false);
  const [transferAddress, setTransferAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  // 4. Hooks useRef
  const glowAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 5. Fonctions utilitaires
  const formatCurrency = (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Nouvelles fonctions pour les fonctionnalités crypto
  const loadWalletQR = async () => {
    try {
      const qrData = await walletService.generateWalletQR();
      setWalletQR(qrData);
    } catch (error) {
      console.error('Erreur lors du chargement du QR code:', error);
    }
  };

  const loadPriceHistory = async (period = '7d') => {
    try {
      const history = await walletService.getJerrPriceHistory(period);
      setPriceHistory(history);
    } catch (error) {
      console.error(
        "Erreur lors du chargement de l'historique des prix:",
        error,
      );
    }
  };

  const loadSecurityInfo = async () => {
    try {
      const security = await walletService.getWalletSecurity();
      setSecurityInfo(security);
    } catch (error) {
      console.error(
        'Erreur lors du chargement des informations de sécurité:',
        error,
      );
    }
  };

  const loadTransactionFees = async () => {
    try {
      const fees = await walletService.getTransactionFees();
      setTransactionFees(fees);
    } catch (error) {
      console.error('Erreur lors du chargement des frais:', error);
    }
  };

  const syncSolanaBalance = async () => {
    setSyncingBalance(true);
    try {
      // Utiliser les nouvelles fonctions consolidées
      const consolidatedBalances = await walletService
        .getConsolidatedBalances()
        .catch(() => ({
          totalJerrBalance: 0,
          totalSolBalance: 0,
          totalValueEUR: 0,
        }));

      // Mettre à jour les données du wallet principal avec les soldes consolidés
      setWallet(prevWallet => ({
        ...prevWallet,
        balance: consolidatedBalances.totalJerrBalance,
        solBalance: consolidatedBalances.totalSolBalance,
        balanceUsd: consolidatedBalances.totalValueEUR,
      }));

      // Optionnellement synchroniser avec le backend
      await walletService.syncSolanaBalance();

      // Recharger les données du portefeuille après synchronisation
      await loadWalletData();
      Alert.alert(
        'Succès',
        `Solde synchronisé avec succès\nJERR: ${(
          Number(consolidatedBalances.totalJerrBalance) || 0
        ).toLocaleString()}\nSOL: ${(
          Number(consolidatedBalances.totalSolBalance) || 0
        ).toFixed(4)}\nValeur: ${(
          Number(consolidatedBalances.totalValueEUR) || 0
        ).toFixed(2)} EUR`,
      );
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      Alert.alert('Erreur', 'Impossible de synchroniser le solde');
    } finally {
      setSyncingBalance(false);
    }
  };

  const copyWalletAddress = async () => {
    if (wallet?.solana?.publicKey) {
      const success = await walletService.copyAddressToClipboard(
        wallet.solana.publicKey,
      );
      if (success) {
        Alert.alert('Succès', 'Adresse copiée dans le presse-papiers');
      } else {
        Alert.alert('Erreur', "Impossible de copier l'adresse");
      }
    }
  };

  const handleTransferJerr = async (recipientAddress, amount) => {
    try {
      // Validation côté frontend
      if (!recipientAddress || recipientAddress.trim() === '') {
        Alert.alert(
          'Erreur de validation',
          "L'adresse du destinataire est requise",
        );
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert(
          'Erreur de validation',
          'Le montant doit être supérieur à 0',
        );
        return;
      }

      const result = await walletService.transferJerr({
        recipientPublicKey: recipientAddress,
        amount: parseFloat(amount),
      });
      Alert.alert('Succès', 'Transfert effectué avec succès');
      setShowTransferModal(false);
      await loadWalletData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors du transfert:', error);
      Alert.alert('Erreur', 'Échec du transfert');
    }
  };

  // 6. Hooks useCallback
  const loadWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les informations du portefeuille local
      const localWallet = walletService.getLocalWalletInfo();

      // Charger les soldes consolidés pour le Wallet Principal
      const consolidatedBalances = await walletService
        .getConsolidatedBalances()
        .catch(() => ({
          totalJerrBalance: 0,
          totalSolBalance: 0,
          totalValueEUR: 0,
        }));

      // Mettre à jour le wallet avec les soldes consolidés
      const updatedWallet = {
        ...localWallet,
        balance: consolidatedBalances.totalJerrBalance,
        solBalance: consolidatedBalances.totalSolBalance,
        balanceUsd: consolidatedBalances.totalValueEUR,
        totalJerr: consolidatedBalances.totalJerrBalance,
        totalSol: consolidatedBalances.totalSolBalance,
        totalValueEUR: consolidatedBalances.totalValueEUR,
      };

      setWallet(updatedWallet);

      // Charger les données d'investissement réelles
      const [globalStats, allPlans, solanaData] = await Promise.all([
        investmentService.getGlobalStats().catch(() => ({})),
        investmentService.getAllPlans().catch(() => []),
        solanaService
          .getAllWalletsBalances()
          .catch(() => ({ totals: { jerr: 0, sol: 0 }, wallets: [] })),
      ]);

      // Intégrer les données Solana dans les statistiques
      const totalJerrBalance = Number(solanaData?.totals?.jerr) || 0;
      const totalSolBalance = Number(solanaData?.totals?.sol) || 0;
      const usdValue = solanaService.getEstimatedUSDValue(
        totalJerrBalance,
        totalSolBalance,
      ) || { total: 0 };

      // Vérifier et sécuriser les données de globalStats
      const safeGlobalStats = {
        totalInvested: globalStats?.totalInvested || 0,
        totalReturn: globalStats?.totalReturn || 0,
        averageReturn: globalStats?.averageReturn || 0,
        activePlans: globalStats?.activePlans || 0,
      };

      // Transformer les données pour les statistiques
      const transformedStats = [
        {
          id: 1,
          label: 'Total Investi',
          value: (Number(safeGlobalStats.totalInvested) || 0).toFixed(2),
          unit: 'JERR',
          trend: safeGlobalStats.totalInvested > 0 ? 'up' : 'flat',
          change: `+${(Number(safeGlobalStats.totalReturn) || 0).toFixed(1)}%`,
          icon: 'trending-up',
        },
        {
          id: 2,
          label: 'Performance Moyenne',
          value: (Number(safeGlobalStats.averageReturn) || 0).toFixed(1),
          unit: '%',
          trend: safeGlobalStats.averageReturn >= 0 ? 'up' : 'down',
          change: safeGlobalStats.averageReturn >= 0 ? 'Positif' : 'Négatif',
          icon: 'percent',
        },
        {
          id: 3,
          label: 'Plans Actifs',
          value: safeGlobalStats.activePlans.toString(),
          unit: '',
          trend: 'flat',
          change: 'En cours',
          icon: 'briefcase',
        },
        {
          id: 4,
          label: 'Valeur Portefeuille',
          value: (Number(consolidatedBalances.totalValueEUR) || 0).toFixed(2),
          unit: '€',
          trend: (consolidatedBalances.totalValueEUR || 0) > 0 ? 'up' : 'flat',
          change: `${(Number(totalJerrBalance) || 0).toFixed(2)} JERR`,
          icon: 'circle',
        },
      ];

      // Transformer les données des plans
      const transformedPlans = (allPlans || []).map(plan => ({
        ...plan,
        balance:
          typeof plan?.balance === 'number'
            ? plan.balance
            : parseFloat(plan?.balance) || 0,
        yield:
          typeof plan?.yield === 'number'
            ? plan.yield
            : parseFloat(plan?.yield) || 0,
        performance:
          typeof plan?.performance === 'number'
            ? plan.performance
            : parseFloat(plan?.performance) || 0,
        trend:
          (plan?.performance || 0) > 0
            ? 'up'
            : (plan?.performance || 0) < 0
            ? 'down'
            : 'flat',
      }));

      setStats(transformedStats);
      setPlans(transformedPlans);
      setSolanaBalances(solanaData);

      // Charger les nouvelles données crypto en parallèle
      Promise.all([
        loadWalletQR(),
        loadPriceHistory(),
        loadSecurityInfo(),
        loadTransactionFees(),
      ]).catch(error => {
        console.warn('Erreur lors du chargement des données crypto:', error);
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Impossible de charger les données du portefeuille');

      // Utiliser les données mockées en cas d'erreur
      setStats(mockStats);
      setPlans(mockPlans);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWalletData();
  }, [loadWalletData]);

  // 6. Hooks useEffect
  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user, loadWalletData]);

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
      ]),
    );
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, [glowAnim]);

  // TOUTES LES FONCTIONS APRÈS LES HOOKS
  const animatePress = callback => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleViewHistory = () => {
    animatePress(() => {
      navigation.navigate('InvestmentHistory', {
        transactions: [],
        investmentService,
      });
    });
  };

  const handleCreatePlan = () => {
    animatePress(() => {
      createPlan();
    });
  };

  const createPlan = async () => {
    try {
      // Afficher un dialogue pour choisir le montant d'investissement
      Alert.prompt(
        "Nouveau Plan d'Investissement",
        `Créer un ${activeTab}\nMontant à investir (JERR):`,
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Créer',
            onPress: async amount => {
              try {
                const investmentAmount = parseFloat(amount);
                if (isNaN(investmentAmount) || investmentAmount <= 0) {
                  Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
                  return;
                }

                const newPlan = await investmentService.createInvestmentPlan(
                  activeTab,
                  investmentAmount,
                );

                Alert.alert(
                  'Succès',
                  `Votre ${newPlan.name} a été créé avec succès !\nMontant investi: ${investmentAmount} JERR`,
                  [{ text: 'OK', onPress: () => loadWalletData() }],
                );
              } catch (error) {
                Alert.alert(
                  'Erreur',
                  error.message ||
                    "Impossible de créer le plan d'investissement.",
                  [{ text: 'OK' }],
                );
              }
            },
          },
        ],
        'plain-text',
        '500',
      );
    } catch (error) {
      Alert.alert('Erreur', "Impossible de créer le plan d'investissement.", [
        { text: 'OK' },
      ]);
    }
  };

  const handleSimulateUpdate = async () => {
    try {
      setLoading(true);

      // Simuler une mise à jour des performances
      const updatedPlans = await Promise.all(
        plans.map(async plan => {
          const updatedPlan = await investmentService.simulatePerformanceUpdate(
            plan.id,
          );
          return updatedPlan;
        }),
      );

      Alert.alert(
        'Simulation Terminée',
        `${updatedPlans.length} plans mis à jour avec de nouvelles performances.`,
        [{ text: 'OK', onPress: () => loadWalletData() }],
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de simuler les mises à jour.', [
        { text: 'OK' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPlan = () => {
    navigation.navigate('CreatePlan');
  };

  const handleAlimenter = () => {
    // Afficher la liste des plans pour choisir lequel alimenter
    if (plans.length === 0) {
      Alert.alert(
        'Aucun Plan',
        "Vous devez d'abord créer un plan d'investissement.",
        [{ text: 'OK' }],
      );
      return;
    }

    const planOptions = plans.map(plan => ({
      text: `${plan.name} (${(Number(plan.balance) || 0).toFixed(2)} JERR)`,
      onPress: () => showFundPlanDialog(plan),
    }));

    Alert.alert('Alimenter un Plan', 'Choisissez le plan à alimenter:', [
      ...planOptions,
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  const showFundPlanDialog = plan => {
    Alert.prompt(
      'Alimenter le Plan',
      `${plan.name}\nSolde actuel: ${(Number(plan.balance) || 0).toFixed(
        2,
      )} JERR\n\nMontant à ajouter:`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Alimenter',
          onPress: async amount => {
            try {
              const fundAmount = parseFloat(amount);
              if (isNaN(fundAmount) || fundAmount <= 0) {
                Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
                return;
              }

              await investmentService.fundPlan(plan.id, fundAmount);

              Alert.alert(
                'Succès',
                `${fundAmount} JERR ajoutés au ${plan.name}`,
                [{ text: 'OK', onPress: () => loadWalletData() }],
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || "Impossible d'alimenter le plan.",
                [{ text: 'OK' }],
              );
            }
          },
        },
      ],
      'plain-text',
      '100',
    );
  };

  const renderStatCard = stat => {
    const getTrendColor = trend => {
      switch (trend) {
        case 'up':
          return '#00f4b0';
        case 'down':
          return '#ff6b6b';
        default:
          return '#d7db3a';
      }
    };

    return (
      <View key={stat.id} style={styles.statCard}>
        <BlurView
          blurAmount={15}
          blurType="light"
          style={styles.statCardContent}
        >
          <View style={styles.statHeader}>
            <Feather
              name={stat.icon}
              size={14}
              color="rgba(255, 255, 255, 0.7)"
            />
          </View>
          <Text style={styles.statLabel} numberOfLines={2} ellipsizeMode="tail">
            {stat.label}
          </Text>
          <View style={styles.statValueContainer}>
            <View style={styles.statValueRow}>
              <Text
                style={styles.statValue}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {stat.value}
              </Text>
              <Text style={styles.statUnit} numberOfLines={1}>
                {stat.unit}
              </Text>
            </View>
            <Text
              style={[styles.statChange, { color: getTrendColor(stat.trend) }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {stat.change}
            </Text>
          </View>
        </BlurView>
      </View>
    );
  };

  const handlePlanAction = (plan, action) => {
    switch (action) {
      case 'withdraw':
        showWithdrawDialog(plan);
        break;
      case 'delete':
        showDeleteConfirmation(plan);
        break;
      case 'details':
        navigation.navigate('PlanDetails', { plan, investmentService });
        break;
    }
  };

  const showWithdrawDialog = plan => {
    Alert.prompt(
      'Retirer des Fonds',
      `${plan.name}\nSolde disponible: ${(Number(plan.balance) || 0).toFixed(
        2,
      )} JERR\n\nMontant à retirer:`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Retirer',
          onPress: async amount => {
            try {
              const withdrawAmount = parseFloat(amount);
              if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
                Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
                return;
              }

              if (withdrawAmount > plan.balance) {
                Alert.alert('Erreur', 'Montant supérieur au solde disponible.');
                return;
              }

              await investmentService.withdrawFromPlan(plan.id, withdrawAmount);

              Alert.alert(
                'Succès',
                `${withdrawAmount} JERR retirés du ${plan.name}`,
                [{ text: 'OK', onPress: () => loadWalletData() }],
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || 'Impossible de retirer les fonds.',
                [{ text: 'OK' }],
              );
            }
          },
        },
      ],
      'plain-text',
      '100',
    );
  };

  const showDeleteConfirmation = plan => {
    Alert.alert(
      'Supprimer le Plan',
      `Êtes-vous sûr de vouloir supprimer "${plan.name}" ?\n\nSolde actuel: ${(
        Number(plan.balance) || 0
      ).toFixed(2)} JERR\n\nCette action est irréversible.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await investmentService.deletePlan(plan.id);

              Alert.alert(
                'Plan Supprimé',
                `Le plan "${plan.name}" a été supprimé avec succès.`,
                [{ text: 'OK', onPress: () => loadWalletData() }],
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || 'Impossible de supprimer le plan.',
                [{ text: 'OK' }],
              );
            }
          },
        },
      ],
    );
  };

  const renderPlanCard = plan => {
    const getTrendColor = trend => {
      switch (trend) {
        case 'up':
          return '#00f4b0';
        case 'down':
          return '#ff6b6b';
        default:
          return '#d7db3a';
      }
    };

    const getTrendIcon = trend => {
      switch (trend) {
        case 'up':
          return 'trending-up';
        case 'down':
          return 'trending-down';
        default:
          return 'minus';
      }
    };

    return (
      <TouchableOpacity
        key={plan.id}
        style={styles.planCard}
        onPress={() => handlePlanAction(plan, 'details')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(215, 219, 58, 0.1)', 'rgba(0, 244, 176, 0.05)']}
          style={styles.planCardGradient}
        >
          <BlurView
            blurAmount={20}
            blurType="light"
            style={styles.planCardBlur}
          >
            <View style={styles.planCardContent}>
              {/* Header avec icône premium */}
              <View style={styles.planCardHeader}>
                <LinearGradient
                  colors={['#d7db3a', '#00f4b0']}
                  style={styles.planIconContainer}
                >
                  <Feather name="shield" size={20} color="#000" />
                </LinearGradient>
                <View style={styles.planBadgeContainer}>
                  <Text style={styles.planBadge}>CONSERVATEUR</Text>
                  <Text style={styles.planRisk}>Risque Faible</Text>
                </View>
              </View>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.planActions}>
                  <View style={styles.planTrend}>
                    <Feather
                      name={getTrendIcon(plan.trend)}
                      size={16}
                      color={getTrendColor(plan.trend)}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePlanAction(plan, 'withdraw')}
                  >
                    <Feather name="minus-circle" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handlePlanAction(plan, 'delete')}
                  >
                    <Feather name="trash-2" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.planBalance}>
                <Text style={styles.planBalanceLabel}>Solde actuel</Text>
                <Text style={styles.planBalanceValue}>
                  {typeof plan.balance === 'number'
                    ? `${(Number(plan.balance) || 0).toFixed(2)} JERR`
                    : plan.balance}
                </Text>
              </View>

              <View style={styles.planYield}>
                <Text style={styles.planYieldLabel}>Performance</Text>
                <Text
                  style={[
                    styles.planYieldValue,
                    { color: plan.performance >= 0 ? '#00f4b0' : '#ff6b6b' },
                  ]}
                >
                  {plan.performance >= 0 ? '+' : ''}
                  {(Number(plan.performance) || 0).toFixed(1)}%
                </Text>
              </View>

              <View style={styles.planYield}>
                <Text style={styles.planYieldLabel}>Valeur Actuelle</Text>
                <Text style={styles.planBalanceValue}>
                  {plan.currentValue
                    ? (Number(plan.currentValue) || 0).toFixed(2)
                    : (Number(plan.balance) || 0).toFixed(2)}{' '}
                  JERR
                </Text>
              </View>

              <View style={styles.planAllocation}>
                <Text style={styles.allocationLabel}>Allocation</Text>
                <View style={styles.allocationBar}>
                  <View
                    style={[
                      styles.allocationSegment,
                      styles.stocksSegment,
                      { flex: plan.allocation.stocks },
                    ]}
                  />
                  <View
                    style={[
                      styles.allocationSegment,
                      styles.bondsSegment,
                      { flex: plan.allocation.bonds },
                    ]}
                  />
                </View>
                <View style={styles.allocationLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.stocksDot]} />
                    <Text style={styles.legendText}>
                      Actions {plan.allocation.stocks}%
                    </Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.bondsDot]} />
                    <Text style={styles.legendText}>
                      Obligations {plan.allocation.bonds}%
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.planLastUpdate}>
                Créé le{' '}
                {new Date(plan.createdAt || plan.lastUpdate).toLocaleDateString(
                  'fr-FR',
                )}
              </Text>
            </View>
          </BlurView>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // VÉRIFICATIONS CONDITIONNELLES APRÈS TOUS LES HOOKS
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#7a006e', '#006e8e']}
          style={styles.backgroundGradient}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d7db3a" />
          <Text style={styles.loadingText}>Chargement des polices...</Text>
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
          <Text style={styles.loadingText}>
            Chargement de votre portefeuille...
          </Text>
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
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
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
                  transform: [{ scale: glowAnim }],
                },
              ]}
            >
              CapiJerr
            </Animated.Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('CapiJerrProfile')}
          >
            <View style={styles.avatar}>
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                {user?.firstName?.charAt(0) || 'U'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.headerBorder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {['Plan 20-80'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.activeTab : styles.inactiveTab,
                styles.singleTabContainer,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <LinearGradient
                colors={
                  activeTab === tab
                    ? ['#d7db3a', '#00f4b0']
                    : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
                }
                style={styles.tabGradient}
              >
                <Feather
                  name="shield"
                  size={16}
                  color={activeTab === tab ? '#000' : 'white'}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}
                >
                  {tab}
                </Text>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>Conservateur</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
        {/* Promo Banner */}
        <LinearGradient
          colors={['#d7db3a', '#00f4b0']}
          style={styles.promoBanner}
        >
          <Text style={styles.promoTitle}>Investissez intelligemment</Text>
          <Text style={styles.promoSubtitle}>
            Diversifiez votre portefeuille avec nos plans d'investissement
            automatisés
          </Text>
        </LinearGradient>

        {/* Primary CTA */}
        <Animated.View
          style={[styles.primaryCTA, { transform: [{ scale: scaleAnim }] }]}
        >
          <TouchableOpacity onPress={handleCreatePlan}>
            <LinearGradient
              colors={['#d7db3a', '#00f4b0']}
              style={styles.primaryCTAGradient}
            >
              <Text style={styles.primaryCTAText}>Créer un nouveau plan</Text>
              <Feather name="plus" size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary CTA - Alimenter */}
        <Animated.View
          style={[styles.primaryCTA, { transform: [{ scale: scaleAnim }] }]}
        >
          <TouchableOpacity onPress={handleAlimenter}>
            <LinearGradient
              colors={['#d7db3a', '#00f4b0']}
              style={styles.primaryCTAGradient}
            >
              <Text style={styles.primaryCTAText}>Alimenter un Plan</Text>
              <Feather name="plus-circle" size={20} color="#000" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Nouvelles actions crypto */}
        <View style={styles.cryptoActionsContainer}>
          <TouchableOpacity
            style={styles.cryptoAction}
            onPress={() => setShowQRModal(true)}
          >
            <BlurView
              blurAmount={20}
              blurType="light"
              style={styles.cryptoActionBlur}
            >
              <MaterialCommunityIcons name="qrcode" size={20} color="#00f4b0" />
              <Text style={styles.cryptoActionText}>Recevoir</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cryptoAction}
            onPress={() => setShowTransferModal(true)}
          >
            <BlurView
              blurAmount={20}
              blurType="light"
              style={styles.cryptoActionBlur}
            >
              <Feather name="send" size={20} color="#d7db3a" />
              <Text style={styles.cryptoActionText}>Envoyer</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cryptoAction}
            onPress={copyWalletAddress}
          >
            <BlurView
              blurAmount={20}
              blurType="light"
              style={styles.cryptoActionBlur}
            >
              <Feather name="copy" size={20} color="white" />
              <Text style={styles.cryptoActionText}>Copier</Text>
            </BlurView>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cryptoAction}
            onPress={() => setShowSecurityModal(true)}
          >
            <BlurView
              blurAmount={20}
              blurType="light"
              style={styles.cryptoActionBlur}
            >
              <Feather name="shield" size={20} color="#ff6b35" />
              <Text style={styles.cryptoActionText}>Sécurité</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Portefeuille Crypto Section */}
        {wallet?.solana && (
          <View style={styles.solanaSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Portefeuille Crypto</Text>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={syncSolanaBalance}
                disabled={syncingBalance}
              >
                <Feather
                  name={syncingBalance ? 'loader' : 'refresh-cw'}
                  size={16}
                  color="#00f4b0"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.walletCard}>
              <BlurView
                blurAmount={20}
                blurType="light"
                style={styles.walletCardBlur}
              >
                <View style={styles.walletCardContent}>
                  <View style={styles.walletHeader}>
                    <Text style={styles.walletName}>Wallet Principal</Text>
                    <View style={styles.walletStatus}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusText}>Actif</Text>
                    </View>
                  </View>

                  <View style={styles.walletAddress}>
                    <Text style={styles.addressLabel}>Adresse publique</Text>
                    <TouchableOpacity onPress={copyWalletAddress}>
                      <Text
                        style={styles.addressValue}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {wallet?.solana?.publicKey ||
                          wallet?.publicKey ||
                          'Non disponible'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.balanceRow}>
                    <View style={styles.balanceItem}>
                      <Text style={styles.balanceLabel}>JERR</Text>
                      <Text style={styles.balanceValue}>
                        {user?.email === 'cydjerr.c@gmail.com'
                          ? (9000000000000).toLocaleString('fr-FR', {
                              maximumFractionDigits: 0,
                            })
                          : (Number(wallet.totalJerr) || 0).toFixed(2)}
                      </Text>
                      <Text style={styles.balanceUsd}>
                        €
                        {user?.email === 'cydjerr.c@gmail.com'
                          ? (9000000000000 * 0.01).toLocaleString('fr-FR', {
                              maximumFractionDigits: 2,
                            })
                          : (Number(wallet.totalJerr) * 0.01 || 0).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.balanceItem}>
                      <Text style={styles.balanceLabel}>SOL</Text>
                      <Text style={styles.balanceValue}>
                        {(Number(wallet.totalSol) || 0).toFixed(4)}
                      </Text>
                      <Text style={styles.balanceUsd}>
                        €{(Number(wallet.totalSol) * 150 || 0).toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.balanceItem}>
                      <Text style={styles.balanceLabel}>Total EUR</Text>
                      <Text style={styles.balanceValue}>
                        €
                        {user?.email === 'cydjerr.c@gmail.com'
                          ? (
                              9000000000000 * 0.01 +
                              (Number(wallet.totalSol) * 150 || 0)
                            ).toLocaleString('fr-FR', {
                              maximumFractionDigits: 2,
                            })
                          : (Number(wallet.totalValueEUR) || 0).toFixed(2)}
                      </Text>
                      {transactionFees && (
                        <Text style={styles.feesText}>
                          Frais: {transactionFees.estimated} SOL
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Historique des prix JERR */}
                  <View style={styles.priceHistorySection}>
                    <Text style={styles.priceHistoryTitle}>Prix JERR (7j)</Text>
                    <View style={styles.priceHistoryContainer}>
                      <Text style={styles.currentPrice}>
                        €
                        {priceHistory?.current
                          ? (priceHistory.current * 0.01).toFixed(4)
                          : '0.0100'}
                      </Text>
                      <Text
                        style={[
                          styles.priceChange,
                          {
                            color:
                              (priceHistory?.change24h || 0) >= 0
                                ? '#00f4b0'
                                : '#ff6b35',
                          },
                        ]}
                      >
                        {(priceHistory?.change24h || 0) >= 0 ? '+' : ''}
                        {(priceHistory?.change24h || 0).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </View>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>{stats.map(renderStatCard)}</View>
        </View>

        {/* Solana Wallets Section */}
        {solanaBalances && (
          <View style={styles.solanaSection}>
            <Text style={styles.sectionTitle}>Wallets Solana</Text>
            {solanaBalances.wallets.map((wallet, index) => (
              <View key={index} style={styles.walletCard}>
                <BlurView
                  blurAmount={15}
                  blurType="light"
                  style={styles.walletCardBlur}
                >
                  <View style={styles.walletCardContent}>
                    <View style={styles.walletHeader}>
                      <Text style={styles.walletName}>
                        {user?.email === 'cydjerr.c@gmail.com' &&
                        wallet.wallet === 'MNT'
                          ? 'MNT Wallet (Réel)'
                          : user?.email === 'cydjerr.c@gmail.com' &&
                            wallet.wallet === 'BOSS'
                          ? 'BOSS Wallet (Réel)'
                          : `${wallet.wallet} Wallet`}
                      </Text>
                      <View style={styles.walletStatus}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Actif</Text>
                      </View>
                    </View>

                    <View style={styles.walletAddress}>
                      <Text style={styles.addressLabel}>Adresse:</Text>
                      <Text style={styles.addressValue}>
                        {user?.email === 'cydjerr.c@gmail.com' &&
                        wallet.wallet === 'MNT'
                          ? 'mntjcoBM3xFuhYavwJ2RAPwVbHuRg4p3TnzmXVjnhwn'
                          : user?.email === 'cydjerr.c@gmail.com' &&
                            wallet.wallet === 'BOSS'
                          ? 'bosM6zBegCdA2RoegdDC8GTvFn1n3MWcYjANUHbbV1L'
                          : `${wallet.address.substring(
                              0,
                              8,
                            )}...${wallet.address.substring(
                              wallet.address.length - 8,
                            )}`}
                      </Text>
                    </View>

                    <View style={styles.balanceRow}>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceLabel}>JERR</Text>
                        <Text style={styles.balanceValue}>
                          {user?.email === 'cydjerr.c@gmail.com'
                            ? (4500000000000).toLocaleString('fr-FR', {
                                maximumFractionDigits: 0,
                              })
                            : (Number(wallet.jerr) || 0).toFixed(2)}
                        </Text>
                      </View>
                      <View style={styles.balanceItem}>
                        <Text style={styles.balanceLabel}>SOL</Text>
                        <Text style={styles.balanceValue}>
                          {(Number(wallet.sol) || 0).toFixed(4)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </BlurView>
              </View>
            ))}
          </View>
        )}

        {/* Plans Section */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Mes Plans d'Investissement</Text>
          {plans.map(renderPlanCard)}
        </View>
      </ScrollView>

      {/* Modales pour les fonctionnalités crypto */}
      {/* Modal QR Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            blurAmount={20}
            blurType="light"
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recevoir JERR</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowQRModal(false)}
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {walletQR ? (
                <View style={styles.qrContainer}>
                  <View style={styles.qrCode}>
                    <MaterialCommunityIcons
                      name="qrcode"
                      size={120}
                      color="#00f4b0"
                    />
                  </View>

                  <View style={styles.addressContainer}>
                    <Text style={styles.addressText} numberOfLines={1}>
                      {wallet?.solana?.publicKey || 'Adresse non disponible'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={copyWalletAddress}
                  >
                    <Text style={styles.copyButtonText}>Copier l'adresse</Text>
                  </TouchableOpacity>

                  <Text style={styles.qrInstructions}>
                    Partagez cette adresse ou ce QR code pour recevoir des JERR
                  </Text>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00f4b0" />
                  <Text style={styles.loadingText}>
                    Génération du QR code...
                  </Text>
                </View>
              )}
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Modal Transfert */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTransferModal}
        onRequestClose={() => setShowTransferModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            blurAmount={20}
            blurType="light"
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Envoyer JERR</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTransferModal(false)}
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.transferForm}>
                <View>
                  <Text style={styles.formLabel}>Adresse du destinataire</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Adresse Solana du destinataire"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={transferAddress}
                    onChangeText={setTransferAddress}
                  />
                </View>

                <View>
                  <Text style={styles.formLabel}>Montant JERR</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="numeric"
                    value={transferAmount}
                    onChangeText={setTransferAmount}
                  />
                </View>

                <Text style={styles.feesInfo}>
                  Frais estimés: {transactionFees?.estimated || '0.001'} SOL
                </Text>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowTransferModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() =>
                      handleTransferJerr(transferAddress, transferAmount)
                    }
                  >
                    <Text style={styles.sendButtonText}>Envoyer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Modal Sécurité */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSecurityModal}
        onRequestClose={() => setShowSecurityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            blurAmount={20}
            blurType="light"
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sécurité du Portefeuille</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSecurityModal(false)}
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {securityInfo ? (
                <View style={styles.securitySettings}>
                  <View style={styles.securityItem}>
                    <Text style={styles.securityLabel}>
                      Authentification biométrique
                    </Text>
                    <TouchableOpacity style={styles.securityToggle}>
                      <Text style={styles.securityToggleText}>
                        {securityInfo.biometricEnabled ? 'Activé' : 'Désactivé'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.securityItem}>
                    <Text style={styles.securityLabel}>
                      Phrase de récupération
                    </Text>
                    <TouchableOpacity style={styles.securityButton}>
                      <Text style={styles.securityButtonText}>Sauvegarder</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.securityItem}>
                    <Text style={styles.securityLabel}>
                      Limite de transaction
                    </Text>
                    <TextInput
                      style={styles.securityInput}
                      placeholder="1000 JERR"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={securityInfo.transactionLimit?.toString()}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#00f4b0" />
                  <Text style={styles.loadingText}>
                    Chargement des paramètres...
                  </Text>
                </View>
              )}
            </View>
          </BlurView>
        </View>
      </Modal>
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
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: '#00f4b0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  avatarButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d7db3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 60,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 16,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  singleTabContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  tabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 56,
    position: 'relative',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabBadge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  activeTab: {
    backgroundColor: 'transparent',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  activeTabText: {
    color: '#000',
  },
  inactiveTabText: {
    color: 'white',
  },
  devIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b35',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
  },
  promoBanner: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  promoSubtitle: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  primaryCTA: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryCTAGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  primaryCTAText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  secondaryCTAContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  secondaryCTA: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  secondaryCTABlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryCTAText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  statsSection: {
    marginBottom: 32,
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
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 100,
  },
  statCardContent: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    justifyContent: 'space-between',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    flexWrap: 'wrap',
  },
  statValueContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    flexShrink: 1,
  },
  statUnit: {
    fontSize: 10,
    fontWeight: 'normal',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 2,
  },
  statChange: {
    fontSize: 9,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    flexShrink: 1,
  },
  solanaSection: {
    marginBottom: 32,
  },
  walletCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  walletCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  walletCardContent: {
    padding: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  walletStatus: {
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
  walletAddress: {
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  addressValue: {
    fontSize: 14,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d7db3a',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  plansSection: {
    marginBottom: 32,
  },
  planCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.8)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  planCardGradient: {
    borderRadius: 24,
    padding: 2,
  },
  planCardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 22,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  planBadgeContainer: {
    flex: 1,
  },
  planBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d7db3a',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  planRisk: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
    marginTop: 2,
  },
  planCardContent: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    flex: 1,
  },
  planActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planTrend: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  planBalance: {
    marginBottom: 12,
  },
  planBalanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  planBalanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d7db3a',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  planYield: {
    marginBottom: 16,
  },
  planYieldLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  planYieldValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00f4b0',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  planAllocation: {
    marginBottom: 12,
  },
  allocationLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  allocationBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  allocationSegment: {
    height: 8,
  },
  stocksSegment: {
    backgroundColor: '#d7db3a',
  },
  bondsSegment: {
    backgroundColor: '#00f4b0',
  },
  allocationLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stocksDot: {
    backgroundColor: '#d7db3a',
  },
  bondsDot: {
    backgroundColor: '#00f4b0',
  },
  legendText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  planLastUpdate: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  cryptoActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  cryptoAction: {
    flex: 1,
    marginHorizontal: 3,
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 70,
  },
  cryptoActionBlur: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
  },
  cryptoActionText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 244, 176, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceUsd: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  feesText: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  priceHistorySection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceHistoryTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  priceHistoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d7db3a',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  qrInstructions: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  addressLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  // Styles pour les modales crypto
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    maxWidth: 350,
    minHeight: 400,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    flex: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    padding: 16,
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCode: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPlaceholder: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  addressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  copyButton: {
    backgroundColor: '#00f4b0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  transferForm: {
    gap: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  feesInfo: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#00f4b0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  securitySettings: {
    gap: 16,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  securityLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  securityToggle: {
    backgroundColor: '#00f4b0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  securityToggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  securityButton: {
    backgroundColor: 'rgba(0, 244, 176, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  securityButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00f4b0',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  securityInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    padding: 6,
    fontSize: 10,
    color: 'white',
    width: 80,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
});

export default CapiJerrScreen;
