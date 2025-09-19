import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { useCloudStats, useCloudFiles } from '../hooks/useApi';
import cloudService from '../services/cloudService';

const { width, height } = Dimensions.get('window');

const CloudJerrScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // États pour l'upload
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // React Query hooks
  const { 
    data: storageStats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useCloudStats();
  
  const { 
    data: recentFiles = [], 
    isLoading: filesLoading, 
    refetch: refetchFiles 
  } = useCloudFiles({}, { limit: 4 });
  
  const loading = statsLoading || filesLoading;

  // Calculs de stockage
  const storagePercentage = storageStats ? (storageStats.totalSize / storageStats.storageLimit) * 100 : 0;
  const isNearLimit = storagePercentage > 80;
  
  // Fonction de rafraîchissement
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchStats(), refetchFiles()]);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      Alert.alert('Erreur', 'Impossible de rafraîchir les données');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Fonction pour sélectionner et uploader un fichier
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setUploading(true);
        
        await cloudService.uploadFile(file.uri, {
          description: `Fichier uploadé depuis CloudJerr`,
          folder: '/',
          type: 'personal'
        });
        
        Alert.alert('Succès', 'Fichier uploadé avec succès!');
        await Promise.all([refetchStats(), refetchFiles()]); // Recharger les données
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', 'Impossible d\'uploader le fichier');
    } finally {
      setUploading(false);
    }
  };

  // Fonction pour formater la date relative
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}j`;
    return `${Math.floor(diffInSeconds / 604800)}sem`;
  };
  
  // Fonction pour naviguer vers la liste complète des fichiers
  const navigateToFilesList = () => {
    // Navigation vers l'écran de gestion des fichiers
    navigation.navigate('FileManager', { 
      title: 'Mes Fichiers',
      folder: '/',
      showAll: true 
    });
  };
  
  // Fonction pour naviguer vers Mon Drive
  const navigateToMyDrive = () => {
    navigation.navigate('FileManager', { 
      title: 'Mon Drive',
      folder: '/',
      view: 'drive' 
    });
  };
  
  // Fonction pour naviguer vers les Offres & Tarifs
  const navigateToPlans = () => {
    navigation.navigate('StoragePlans', {
      currentPlan: 'free',
      usedStorage: storageStats?.totalSize || 0,
      storageLimit: storageStats?.storageLimit || 5368709120
    });
  };
  
  // Fonction pour naviguer vers les Paramètres
  const navigateToSettings = () => {
    navigation.navigate('CloudSettings', {
      storageStats: storageStats
    });
  };
  
  // Fonction pour ouvrir un fichier
  const handleFilePress = async (file) => {
    try {
      // TODO: Implémenter l'ouverture/prévisualisation du fichier
      Alert.alert('Info', `Ouverture du fichier: ${file.name}`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le fichier');
    }
  };

  // Rendu du header glassmorphique
  const renderHeader = () => (
    <BlurView blurAmount={20} blurType="light" style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>CloudJerr</Text>
      
      <TouchableOpacity
        style={styles.headerButton}
        activeOpacity={0.7}
        onPress={navigateToSettings}
      >
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>
    </BlurView>
  );

  // Rendu de la section Hero
  const renderHeroSection = () => (
    <View style={styles.heroSection}>
      <Text style={styles.heroTitle}>Votre stockage cloud sécurisé</Text>
      <Text style={styles.heroSubtitle}>
        Stockez, synchronisez et partagez vos fichiers en toute sécurité avec un chiffrement de niveau militaire
      </Text>
      
      <View style={styles.featuresGrid}>
        <BlurView blurAmount={10} blurType="light" style={styles.featureCard}>
          <Ionicons name="server" size={32} color="#FFDE59" />
          <Text style={styles.featureText}>Jusqu'à 5To</Text>
        </BlurView>
        
        <BlurView blurAmount={10} blurType="light" style={styles.featureCard}>
          <Ionicons name="shield-checkmark" size={32} color="#FFDE59" />
          <Text style={styles.featureText}>AES-256</Text>
        </BlurView>
        
        <BlurView blurAmount={10} blurType="light" style={styles.featureCard}>
          <Ionicons name="flash" size={32} color="#FFDE59" />
          <Text style={styles.featureText}>Instantané</Text>
        </BlurView>
      </View>
    </View>
  );

  // Rendu de la barre de quota de stockage
  const renderStorageQuota = () => (
    <BlurView blurAmount={10} blurType="light" style={styles.storageQuotaContainer}>
      <View style={styles.storageHeader}>
        <Text style={styles.storageLabel}>Stockage utilisé</Text>
        <Text style={styles.storageAmount}>
          {storageStats ? `${storageStats.formattedTotalSize} / ${storageStats.formattedStorageLimit}` : 'Chargement...'}
        </Text>
      </View>
      
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={isNearLimit ? ['#FF6B6B', '#FF8E8E'] : ['#FFDE59', '#FFE66D']}
            style={[styles.progressBarFill, { width: `${storagePercentage}%` }]}
          />
        </View>
      </View>
      
      <View style={styles.storageFooter}>
        <Text style={styles.storageStatus}>
          {isNearLimit ? 'Espace presque plein' : 'Espace disponible'}
        </Text>
        {isNearLimit && (
          <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.8}>
            <Text style={styles.upgradeButtonText}>Upgrade</Text>
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );

  // Rendu de l'aperçu du stockage
  const renderStorageOverview = () => (
    <View style={styles.storageOverview}>
      <View style={styles.storageStats}>
        <View style={styles.statItem}>
          <Ionicons name="folder" size={20} color="white" />
          <Text style={styles.statText}>
            {storageStats ? `${storageStats.categoryBreakdown ? Object.keys(storageStats.categoryBreakdown).length : 0} catégories` : '0 catégories'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="document" size={20} color="white" />
          <Text style={styles.statText}>
            {storageStats ? `${storageStats.totalFiles} fichiers` : '0 fichiers'}
          </Text>
        </View>
      </View>
      
      <View style={styles.recentFilesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="white" />
            <Text style={styles.loadingText}>Chargement des fichiers...</Text>
          </View>
        ) : recentFiles.length > 0 ? (
          recentFiles.map((file) => (
            <TouchableOpacity 
              key={file._id} 
              style={styles.fileItem} 
              activeOpacity={0.7}
              onPress={() => handleFilePress(file)}
            >
              <Ionicons 
                name={cloudService.getFileIcon(file.mimeType)} 
                size={24} 
                color={cloudService.getFileIconColor(file.mimeType)} 
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileDetails}>
                  {cloudService.formatFileSize(file.size)} • {getRelativeTime(file.uploadedAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="cloud-outline" size={48} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyText}>Aucun fichier récent</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7} onPress={navigateToFilesList}>
        <Text style={styles.viewAllText}>Voir tout</Text>
        <Ionicons name="chevron-forward" size={16} color="#FFDE59" />
      </TouchableOpacity>
    </View>
  );

  // Rendu des actions rapides
  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={[styles.quickActionButton, styles.primaryAction]} 
          activeOpacity={0.8}
          onPress={handleFileUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#1A1A1A" />
          ) : (
            <Ionicons name="cloud-upload" size={24} color="#1A1A1A" />
          )}
          <Text style={styles.primaryActionText}>
            {uploading ? 'Upload...' : 'Upload fichiers'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton} activeOpacity={0.8} onPress={navigateToMyDrive}>
          <BlurView blurAmount={10} blurType="light" style={styles.actionBlur}>
            <Ionicons name="folder-open" size={24} color="white" />
            <Text style={styles.actionText}>Mon Drive</Text>
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton} activeOpacity={0.8} onPress={navigateToPlans}>
          <BlurView blurAmount={10} blurType="light" style={styles.actionBlur}>
            <Ionicons name="card" size={24} color="white" />
            <Text style={styles.actionText}>Offres & Tarifs</Text>
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickActionButton} activeOpacity={0.8} onPress={navigateToSettings}>
          <BlurView blurAmount={10} blurType="light" style={styles.actionBlur}>
            <Ionicons name="settings" size={24} color="white" />
            <Text style={styles.actionText}>Paramètres</Text>
          </BlurView>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Rendu du bouton flottant
  const renderFloatingButton = () => (
    <TouchableOpacity 
      style={styles.floatingButton} 
      activeOpacity={0.8}
      onPress={handleFileUpload}
      disabled={uploading}
    >
      <LinearGradient
        colors={['#FFDE59', '#FFE66D']}
        style={styles.floatingButtonGradient}
      >
        <Ionicons name="cloud-upload" size={28} color="#1A1A1A" />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="white"
              colors={['#FFDE59']}
            />
          }
        >
          {renderHeroSection()}
          {renderStorageQuota()}
          {renderStorageOverview()}
          {renderQuickActions()}
        </ScrollView>
        
        {renderFloatingButton()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  
  // Header styles
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
  
  // Scroll view styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  
  // Hero section styles
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
    fontFamily: 'Poppins-Regular',
  },
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  featureText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Storage quota styles
  storageQuotaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginVertical: 16,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  storageAmount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  storageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  upgradeButton: {
    backgroundColor: '#FFDE59',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Storage overview styles
  storageOverview: {
    marginVertical: 8,
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    marginLeft: 8,
    fontFamily: 'Poppins-Medium',
  },
  recentFilesContainer: {
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  fileDetails: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#FFDE59',
    fontWeight: '500',
    marginRight: 4,
    fontFamily: 'Poppins-Medium',
  },
  
  // Quick actions styles
  quickActionsContainer: {
    marginVertical: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryAction: {
    backgroundColor: '#FFDE59',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  actionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  
  // Floating button styles
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#FFDE59',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Nouveaux styles pour les fonctionnalités cloud
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
  },
});

export default CloudJerrScreen;