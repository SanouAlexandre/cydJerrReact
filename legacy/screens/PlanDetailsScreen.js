import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather } from 'react-native-vector-icons';

const { width: screenWidth } = Dimensions.get('window');

const PlanDetailsScreen = ({ navigation, route }) => {
  const { plan: initialPlan, investmentService } = route.params;
  const [plan, setPlan] = useState(initialPlan);
  const [performance, setPerformance] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPlanDetails();
  }, []);

  const loadPlanDetails = async () => {
    try {
      setIsLoading(true);
      if (investmentService) {
        const updatedPlan = await investmentService.getPlanById(plan.id);
        const planPerformance = await investmentService.getPlanPerformanceHistory(plan.id);
        setPlan(updatedPlan);
        setPerformance(planPerformance);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundPlan = () => {
    Alert.prompt(
      'Alimenter le Plan',
      `${plan.name}\nSolde actuel: ${(Number(plan.balance) || 0).toFixed(2)} JERR\n\nMontant à ajouter:`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Alimenter',
          onPress: async (amount) => {
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
                [{ text: 'OK', onPress: () => loadPlanDetails() }]
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || 'Impossible d\'alimenter le plan.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ],
      'plain-text',
      '100'
    );
  };

  const handleWithdraw = () => {
    Alert.prompt(
      'Retirer des Fonds',
      `${plan.name}\nSolde disponible: ${(Number(plan.balance) || 0).toFixed(2)} JERR\n\nMontant à retirer:`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Retirer',
          onPress: async (amount) => {
            try {
              const withdrawAmount = parseFloat(amount);
              if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
                Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
                return;
              }
              
              if (withdrawAmount > (Number(plan.balance) || 0)) {
                Alert.alert('Erreur', 'Montant supérieur au solde disponible.');
                return;
              }
              
              await investmentService.withdrawFromPlan(plan.id, withdrawAmount);
              
              Alert.alert(
                'Succès',
                `${withdrawAmount} JERR retirés du ${plan.name}`,
                [{ text: 'OK', onPress: () => loadPlanDetails() }]
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || 'Impossible de retirer les fonds.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ],
      'plain-text',
      '100'
    );
  };

  const handleDeletePlan = () => {
    Alert.alert(
      'Supprimer le Plan',
      `Êtes-vous sûr de vouloir supprimer "${plan.name}" ?\n\nSolde actuel: ${(Number(plan.balance) || 0).toFixed(2)} JERR\n\nCette action est irréversible.`,
      [
        {
          text: 'Annuler',
          style: 'cancel'
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
                [{ text: 'OK', onPress: () => navigation.goBack() }]
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                error.message || 'Impossible de supprimer le plan.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const renderPerformanceItem = (item, index) => (
    <View key={index} style={styles.performanceItem}>
      <Text style={styles.performanceDate}>
        {new Date(item.date).toLocaleDateString('fr-FR')}
      </Text>
      <Text style={[
        styles.performanceValue,
        { color: (Number(item.value) || 0) >= 0 ? '#00f4b0' : '#ff6b6b' }
      ]}>
        {(Number(item.value) || 0) >= 0 ? '+' : ''}{(Number(item.value) || 0).toFixed(2)}%
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails du Plan</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Plan Overview */}
          <View style={styles.overviewCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planStatus}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Actif</Text>
                  </View>
                </View>
                
                <View style={styles.balanceSection}>
                  <Text style={styles.balanceLabel}>Solde Actuel</Text>
                  <Text style={styles.balanceValue}>
                    {(Number(plan.balance) || 0).toFixed(2)} JERR
                  </Text>
                </View>
                
                <View style={styles.performanceSection}>
                  <Text style={styles.performanceLabel}>Performance</Text>
                  <Text style={[
                    styles.performanceValue,
                    { color: (Number(plan.performance) || 0) >= 0 ? '#00f4b0' : '#ff6b6b' }
                  ]}>
                    {(Number(plan.performance) || 0) >= 0 ? '+' : ''}{(Number(plan.performance) || 0).toFixed(1)}%
                  </Text>
                </View>
                
                <View style={styles.valueSection}>
                  <Text style={styles.valueLabel}>Valeur Actuelle</Text>
                  <Text style={styles.valueAmount}>
                    {plan.currentValue ? (Number(plan.currentValue) || 0).toFixed(2) : (Number(plan.balance) || 0).toFixed(2)} JERR
                  </Text>
                </View>
              </View>
            </BlurView>
          </View>

          {/* Allocation */}
          <View style={styles.allocationCard}>
            <BlurView blurAmount={15} blurType="light" style={styles.cardBlur}>
              <View style={styles.cardContent}>
                <Text style={styles.sectionTitle}>Allocation d'Actifs</Text>
                
                <View style={styles.allocationBar}>
                  <View 
                    style={[
                      styles.allocationSegment, 
                      styles.stocksSegment,
                      { flex: plan.allocation?.stocks || 50 }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.allocationSegment, 
                      styles.bondsSegment,
                      { flex: plan.allocation?.bonds || 50 }
                    ]} 
                  />
                </View>
                
                <View style={styles.allocationLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.stocksDot]} />
                    <Text style={styles.legendText}>Actions {plan.allocation?.stocks || 50}%</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.bondsDot]} />
                    <Text style={styles.legendText}>Obligations {plan.allocation?.bonds || 50}%</Text>
                  </View>
                </View>
              </View>
            </BlurView>
          </View>

          {/* Performance History */}
          {performance.length > 0 && (
            <View style={styles.performanceCard}>
              <BlurView blurAmount={15} blurType="light" style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <Text style={styles.sectionTitle}>Historique des Performances</Text>
                  <View style={styles.performanceList}>
                    {performance.slice(0, 10).map(renderPerformanceItem)}
                  </View>
                </View>
              </BlurView>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleFundPlan}>
              <LinearGradient
                colors={['#d7db3a', '#b8c332']}
                style={styles.actionButtonGradient}
              >
                <Feather name="plus-circle" size={20} color="#000" />
                <Text style={styles.actionButtonText}>Alimenter</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleWithdraw}>
              <View style={styles.secondaryActionButton}>
                <Feather name="minus-circle" size={20} color="#00f4b0" />
                <Text style={styles.secondaryActionButtonText}>Retirer</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleDeletePlan}>
              <View style={styles.dangerActionButton}>
                <Feather name="trash-2" size={20} color="#ff6b6b" />
                <Text style={styles.dangerActionButtonText}>Supprimer</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  overviewCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  allocationCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  performanceCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardContent: {
    padding: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  planStatus: {
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
    fontWeight: '600',
  },
  balanceSection: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d7db3a',
  },
  performanceSection: {
    marginBottom: 16,
  },
  performanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  performanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  valueSection: {
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  valueAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  allocationBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  allocationSegment: {
    height: 12,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  stocksDot: {
    backgroundColor: '#d7db3a',
  },
  bondsDot: {
    backgroundColor: '#00f4b0',
  },
  legendText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  performanceList: {
    gap: 8,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  performanceDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  secondaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 244, 176, 0.1)',
    borderWidth: 1,
    borderColor: '#00f4b0',
    borderRadius: 16,
  },
  secondaryActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00f4b0',
    marginLeft: 8,
  },
  dangerActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: '#ff6b6b',
    borderRadius: 16,
  },
  dangerActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginLeft: 8,
  },
});

export default PlanDetailsScreen;