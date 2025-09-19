import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import cloudService from '../services/cloudService';

const StoragePlansScreen = () => {
  const navigation = useNavigation();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [storageStats, setStorageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0',
      period: 'JERR/mois',
      storage: '5 GB',
      features: [
        '5 GB de stockage',
        'Upload jusqu\'à 100 MB par fichier',
        'Partage de fichiers basique',
        'Support communautaire'
      ],
      color: ['#667eea', '#764ba2'],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '500',
      period: 'JERR/mois',
      storage: '100 GB',
      features: [
        '100 GB de stockage',
        'Upload jusqu\'à 1 GB par fichier',
        'Partage avancé avec permissions',
        'Synchronisation automatique',
        'Support prioritaire',
        'Historique des versions'
      ],
      color: ['#f093fb', '#f5576c'],
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: '1000',
      period: 'JERR/mois',
      storage: '1 TB',
      features: [
        '1 TB de stockage',
        'Upload illimité',
        'Collaboration d\'équipe',
        'Gestion des utilisateurs',
        'API d\'intégration',
        'Sauvegarde automatique',
        'Support 24/7',
        'Conformité RGPD'
      ],
      color: ['#4facfe', '#00f2fe'],
      popular: false
    }
  ];
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      const statsResponse = await cloudService.getStorageStats();
      const stats = statsResponse.data || statsResponse;
      setStorageStats(stats);
      
      // Déterminer le plan actuel basé sur la limite de stockage
      const storageLimit = stats.storageLimit || 5368709120; // 5GB par défaut
      let plan = 'free';
      if (storageLimit >= 1099511627776) { // 1TB
        plan = 'business';
      } else if (storageLimit >= 107374182400) { // 100GB
        plan = 'pro';
      }
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les informations du plan');
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpgrade = (planId) => {
    if (planId === currentPlan) {
      Alert.alert('Information', 'Vous avez déjà ce plan actif.');
      return;
    }
    
    Alert.alert(
      'Mise à niveau',
      `Voulez-vous passer au plan ${plans.find(p => p.id === planId)?.name} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Continuer',
          onPress: () => {
            // Ici vous pourriez intégrer un système de paiement
            Alert.alert(
              'Redirection',
              'Vous allez être redirigé vers la page de paiement.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };
  
  const renderHeader = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Offres & Tarifs</Text>
      
      <View style={styles.headerButton} />
    </BlurView>
  );
  
  const renderCurrentUsage = () => {
    if (!storageStats) return null;
    
    const usedPercentage = (storageStats.totalSize / storageStats.storageLimit) * 100;
    
    return (
      <View style={styles.usageContainer}>
        <BlurView blurAmount={10} blurType="light" style={styles.usageCard}>
          <Text style={styles.usageTitle}>Utilisation actuelle</Text>
          <View style={styles.usageBar}>
            <View style={[styles.usageProgress, { width: `${Math.min(usedPercentage, 100)}%` }]} />
          </View>
          <View style={styles.usageStats}>
            <Text style={styles.usageText}>
              {cloudService.formatFileSize(storageStats.totalSize)} / {cloudService.formatFileSize(storageStats.storageLimit)}
            </Text>
            <Text style={styles.usagePercentage}>{usedPercentage.toFixed(1)}%</Text>
          </View>
          <Text style={styles.filesCount}>{storageStats.fileCount} fichiers</Text>
        </BlurView>
      </View>
    );
  };
  
  const renderPlanCard = (plan) => (
    <View key={plan.id} style={styles.planContainer}>
      <LinearGradient
        colors={plan.color}
        style={[styles.planCard, currentPlan === plan.id && styles.currentPlanCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {plan.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>POPULAIRE</Text>
          </View>
        )}
        
        {currentPlan === plan.id && (
          <View style={styles.currentBadge}>
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.currentText}>Plan actuel</Text>
          </View>
        )}
        
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>{plan.price}</Text>
          <Text style={styles.planPeriod}>{plan.period}</Text>
        </View>
        <Text style={styles.planStorage}>{plan.storage} de stockage</Text>
        
        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark" size={16} color="white" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.planButton,
            currentPlan === plan.id && styles.currentPlanButton
          ]}
          onPress={() => handleUpgrade(plan.id)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.planButtonText,
            currentPlan === plan.id && styles.currentPlanButtonText
          ]}>
            {currentPlan === plan.id ? 'Plan actuel' : 'Choisir ce plan'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderHeader()}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentUsage()}
          
          <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
          
          {plans.map(renderPlanCard)}
          
          <View style={styles.infoContainer}>
            <BlurView blurAmount={10} blurType="light" style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.infoText}>
                Tous les plans incluent un cryptage de bout en bout et une garantie de disponibilité de 99.9%.
                Vous pouvez changer de plan à tout moment.
              </Text>
            </BlurView>
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
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  usageContainer: {
    marginVertical: 20,
  },
  usageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  usageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
  },
  usageBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  usageProgress: {
    height: '100%',
    backgroundColor: '#FFDE59',
    borderRadius: 4,
  },
  usageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  usageText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  usagePercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFDE59',
    fontFamily: 'Poppins-SemiBold',
  },
  filesCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  planContainer: {
    marginBottom: 20,
  },
  planCard: {
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currentPlanCard: {
    borderColor: '#FFDE59',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FFDE59',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  currentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentText: {
    fontSize: 12,
    color: '#FFDE59',
    marginLeft: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  planName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  planPeriod: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  planStorage: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  planButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanButton: {
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    borderWidth: 1,
    borderColor: '#FFDE59',
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  currentPlanButtonText: {
    color: '#FFDE59',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
  },
});

export default StoragePlansScreen;