import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const AssuJerrScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('staking');
  const [simulatorAge, setSimulatorAge] = useState(30);
  const [simulatorCoverage, setSimulatorCoverage] = useState(50000);
  const [calculatedPremium, setCalculatedPremium] = useState(null);

  // Données simulées pour les pools d'assurance
  const insurancePools = [
    {
      id: 1,
      name: 'Santé Premium',
      icon: '🏥',
      priceJerr: 250, // 2.50€ converti en Jerr (1 Jerr = 0.01€)
      coverage: '100,000 Jerr',
      participants: 1250,
    },
    {
      id: 2,
      name: 'Auto Protection',
      icon: '🚗',
      priceJerr: 180,
      coverage: '75,000 Jerr',
      participants: 890,
    },
    {
      id: 3,
      name: 'Habitation Sécure',
      icon: '🏠',
      priceJerr: 320,
      coverage: '150,000 Jerr',
      participants: 2100,
    },
    {
      id: 4,
      name: 'Voyage Liberté',
      icon: '✈️',
      priceJerr: 85,
      coverage: '25,000 Jerr',
      participants: 650,
    },
  ];

  // Données simulées pour le staking
  const stakingData = {
    totalStaked: 15750,
    apy: 12.5,
    revenueGenerated: 1968,
  };

  // Données simulées pour les votes
  const votes = [
    {
      id: 1,
      title: 'Augmentation couverture santé',
      description: 'Proposition d\'augmenter la couverture maximale à 200,000 Jerr',
      votingPower: 1250,
      deadline: '2024-02-15',
    },
    {
      id: 2,
      title: 'Nouveau pool crypto',
      description: 'Création d\'un pool d\'assurance pour les actifs crypto',
      votingPower: 1250,
      deadline: '2024-02-20',
    },
  ];

  // Données simulées pour l'historique
  const transactions = [
    {
      id: 1,
      date: '2024-01-15',
      action: 'Stake',
      amount: 5000,
      type: 'deposit',
    },
    {
      id: 2,
      date: '2024-01-10',
      action: 'Reward',
      amount: 156,
      type: 'reward',
    },
    {
      id: 3,
      date: '2024-01-05',
      action: 'Vote',
      amount: 0,
      type: 'vote',
    },
  ];

  const calculatePremium = () => {
    // Simulation de calcul de prime basée sur l'âge et la couverture
    const basePremium = simulatorCoverage * 0.002;
    const ageFactor = simulatorAge < 25 ? 0.8 : simulatorAge > 50 ? 1.3 : 1.0;
    const result = Math.ceil(basePremium * ageFactor);
    setCalculatedPremium(result);
  };

  const renderPoolCard = (pool) => (
    <TouchableOpacity key={pool.id} style={styles.poolCard}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.poolCardGradient}
      >
        <Text style={styles.poolIcon}>{pool.icon}</Text>
        <Text style={styles.poolName}>{pool.name}</Text>
        <Text style={styles.poolPrice}>{pool.priceJerr} Jerr/mois</Text>
        <Text style={styles.poolCoverage}>Couverture: {pool.coverage}</Text>
        <Text style={styles.poolParticipants}>{pool.participants} participants</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staking':
        return (
          <View style={styles.tabContent}>
            <View style={styles.stakingCard}>
              <Text style={styles.stakingTitle}>Total Staké</Text>
              <Text style={styles.stakingAmount}>{stakingData.totalStaked.toLocaleString()} Jerr</Text>
              <View style={styles.stakingRow}>
                <View style={styles.stakingItem}>
                  <Text style={styles.stakingLabel}>APY</Text>
                  <Text style={styles.stakingValue}>{stakingData.apy}%</Text>
                </View>
                <View style={styles.stakingItem}>
                  <Text style={styles.stakingLabel}>Revenus</Text>
                  <Text style={styles.stakingValue}>{stakingData.revenueGenerated} Jerr</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addFundsButton}>
                <LinearGradient
                  colors={['#FFDE59', '#FFB800']}
                  style={styles.addFundsGradient}
                >
                  <Text style={styles.addFundsText}>Add Funds</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'votes':
        return (
          <View style={styles.tabContent}>
            {votes.map((vote) => (
              <View key={vote.id} style={styles.voteCard}>
                <Text style={styles.voteTitle}>{vote.title}</Text>
                <Text style={styles.voteDescription}>{vote.description}</Text>
                <Text style={styles.votePower}>Pouvoir de vote: {vote.votingPower} Jerr</Text>
                <Text style={styles.voteDeadline}>Échéance: {vote.deadline}</Text>
                <View style={styles.voteButtons}>
                  <TouchableOpacity style={[styles.voteButton, styles.approveButton]}>
                    <Text style={styles.voteButtonText}>Approuver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.voteButton, styles.rejectButton]}>
                    <Text style={styles.voteButtonText}>Rejeter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      case 'historique':
        return (
          <View style={styles.tabContent}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                  <Text style={styles.transactionAction}>{transaction.action}</Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'reward' && styles.rewardAmount,
                  transaction.type === 'deposit' && styles.depositAmount,
                ]}>
                  {transaction.amount > 0 ? `${transaction.amount} Jerr` : '-'}
                </Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#0F1C3F', '#2D4A7B', '#1A365D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        {/* Header fixe */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Ionicons name="shield-checkmark" size={24} color="#FFDE59" />
            <Text style={styles.headerTitle}>AssuJerr</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Section Hero */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.heroCard}
            >
              <LinearGradient
                colors={['#FFDE59', '#FFB800']}
                style={styles.heroIcon}
              >
                <Text style={styles.heroEmoji}>🛡️</Text>
              </LinearGradient>
              <Text style={styles.heroTitle}>AssuJerr</Text>
              <Text style={styles.heroSubtitle}>Assurance décentralisée nouvelle génération</Text>
              <Text style={styles.heroDescription}>
                Pools collaboratifs • Gouvernance DAO • Primes optimisées
              </Text>
            </LinearGradient>
          </View>

          {/* Section Pools d'assurance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pools d'Assurance</Text>
            <View style={styles.poolsGrid}>
              {insurancePools.map(renderPoolCard)}
            </View>
          </View>

          {/* Section Simulateur */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Simulateur de Prime</Text>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.simulatorCard}
            >
              <View style={styles.simulatorField}>
                <Text style={styles.simulatorLabel}>Âge: {simulatorAge} ans</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={18}
                  maximumValue={80}
                  value={simulatorAge}
                  onValueChange={setSimulatorAge}
                  step={1}
                  minimumTrackTintColor="#FFDE59"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbStyle={styles.sliderThumb}
                />
              </View>
              <View style={styles.simulatorField}>
                <Text style={styles.simulatorLabel}>Couverture: {simulatorCoverage.toLocaleString()} Jerr</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={10000}
                  maximumValue={200000}
                  value={simulatorCoverage}
                  onValueChange={setSimulatorCoverage}
                  step={5000}
                  minimumTrackTintColor="#FFDE59"
                  maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
                  thumbStyle={styles.sliderThumb}
                />
              </View>
              <TouchableOpacity style={styles.calculateButton} onPress={calculatePremium}>
                <LinearGradient
                  colors={['#FFDE59', '#FFB800']}
                  style={styles.calculateGradient}
                >
                  <Text style={styles.calculateText}>Calculer</Text>
                </LinearGradient>
              </TouchableOpacity>
              {calculatedPremium && (
                <View style={styles.resultContainer}>
                  <Text style={styles.resultLabel}>Prime mensuelle estimée:</Text>
                  <Text style={styles.resultAmount}>{calculatedPremium} Jerr</Text>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Dashboard Utilisateur */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'staking' && styles.activeTab]}
                onPress={() => setActiveTab('staking')}
              >
                <Ionicons name="wallet" size={20} color={activeTab === 'staking' ? '#FFDE59' : 'white'} />
                <Text style={[styles.tabText, activeTab === 'staking' && styles.activeTabText]}>Staking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'votes' && styles.activeTab]}
                onPress={() => setActiveTab('votes')}
              >
                <Ionicons name="checkmark-circle" size={20} color={activeTab === 'votes' ? '#FFDE59' : 'white'} />
                <Text style={[styles.tabText, activeTab === 'votes' && styles.activeTabText]}>Votes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'historique' && styles.activeTab]}
                onPress={() => setActiveTab('historique')}
              >
                <Ionicons name="time" size={20} color={activeTab === 'historique' ? '#FFDE59' : 'white'} />
                <Text style={[styles.tabText, activeTab === 'historique' && styles.activeTabText]}>Historique</Text>
              </TouchableOpacity>
            </View>
            {renderTabContent()}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: StatusBar.currentHeight + 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textShadowColor: '#FFDE59',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#B0C4DE',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8A9BA8',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 16,
  },
  poolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  poolCard: {
    width: (width - 44) / 2,
    marginBottom: 12,
  },
  poolCardGradient: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  poolIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  poolName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  poolPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFDE59',
    textAlign: 'center',
    marginBottom: 4,
  },
  poolCoverage: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#B0C4DE',
    textAlign: 'center',
    marginBottom: 2,
  },
  poolParticipants: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: '#8A9BA8',
    textAlign: 'center',
  },
  simulatorCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  simulatorField: {
    marginBottom: 20,
  },
  simulatorLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#FFDE59',
    width: 20,
    height: 20,
  },
  calculateButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  calculateGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  calculateText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F1C3F',
  },
  resultContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B0C4DE',
    marginBottom: 4,
  },
  resultAmount: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFDE59',
    textShadowColor: '#FFDE59',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  activeTabText: {
    color: '#FFDE59',
  },
  tabContent: {
    minHeight: 200,
  },
  stakingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  stakingTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  stakingAmount: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFDE59',
    textAlign: 'center',
    marginBottom: 20,
  },
  stakingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stakingItem: {
    alignItems: 'center',
  },
  stakingLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#B0C4DE',
    marginBottom: 4,
  },
  stakingValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  addFundsButton: {
    marginTop: 10,
  },
  addFundsGradient: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addFundsText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#0F1C3F',
  },
  voteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  voteTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
  },
  voteDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#B0C4DE',
    marginBottom: 8,
  },
  votePower: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FFDE59',
    marginBottom: 4,
  },
  voteDeadline: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8A9BA8',
    marginBottom: 12,
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  rejectButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
  },
  voteButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  transactionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#8A9BA8',
  },
  transactionAction: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  transactionAmount: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'right',
  },
  rewardAmount: {
    color: '#22C55E',
  },
  depositAmount: {
    color: '#FFDE59',
  },
});

export default AssuJerrScreen;