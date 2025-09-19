import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import cloudService from '../services/cloudService';
import userService from '../services/api/userService';

const CloudSettingsScreen = () => {
  const navigation = useNavigation();
  const [storageStats, setStorageStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    autoSync: true,
    notifications: true,
    wifiOnly: false,
    autoBackup: false,
    compressionEnabled: true,
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les statistiques de stockage
      const statsResponse = await cloudService.getStorageStats();
      const stats = statsResponse.data || statsResponse;
      setStorageStats(stats);
      
      // Charger les paramètres depuis AsyncStorage
      const savedSettings = await AsyncStorage.getItem('cloudSettings');
      if (savedSettings) {
        setSettings({ ...settings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les paramètres');
    } finally {
      setLoading(false);
    }
  };
  
  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('cloudSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };
  
  const clearCache = async () => {
    Alert.alert(
      'Vider le cache',
      'Êtes-vous sûr de vouloir vider le cache ? Cela supprimera les fichiers temporaires.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await cloudService.clearCache();
              Alert.alert('Succès', 'Cache vidé avec succès!');
              // Recharger les statistiques après le nettoyage
              loadData();
            } catch (error) {
              console.error('Erreur lors du nettoyage du cache:', error);
              Alert.alert('Erreur', 'Impossible de vider le cache');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const exportData = () => {
    Alert.alert(
      'Exporter les données',
      'Cette fonctionnalité permet d\'exporter vos données pour sauvegarde.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Exporter',
          onPress: async () => {
            try {
              setLoading(true);
              const data = await cloudService.exportUserData();
              
              // Créer un fichier temporaire avec les données exportées
              const fileName = `cydjerr_export_${new Date().toISOString().split('T')[0]}.json`;
              const fileUri = FileSystem.documentDirectory + fileName;
              
              await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2));
              
              // Partager le fichier
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                  mimeType: 'application/json',
                  dialogTitle: 'Exporter les données CYDJERR',
                });
              } else {
                Alert.alert('Succès', `Données exportées vers: ${fileName}`);
              }
            } catch (error) {
              console.error('Erreur lors de l\'export des données:', error);
              Alert.alert('Erreur', 'Impossible d\'exporter les données');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const deleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'ATTENTION: Cette action est irréversible. Tous vos fichiers seront définitivement supprimés.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Confirmation mot de passe',
              'Entrez votre mot de passe pour confirmer la suppression :',
              [
                { text: 'Annuler', style: 'cancel' },
                {
                  text: 'Continuer',
                  style: 'destructive',
                  onPress: (password) => {
                    if (!password) {
                      Alert.alert('Erreur', 'Mot de passe requis');
                      return;
                    }
                    
                    Alert.prompt(
                      'Confirmation finale',
                      'Tapez "DELETE" pour confirmer définitivement la suppression de votre compte :',
                      [
                        { text: 'Annuler', style: 'cancel' },
                        {
                          text: 'Supprimer définitivement',
                          style: 'destructive',
                          onPress: async (confirmation) => {
                            if (confirmation === 'DELETE') {
                              try {
                                setLoading(true);
                                await userService.deleteAccount(password);
                                Alert.alert(
                                  'Compte supprimé',
                                  'Votre compte a été supprimé avec succès',
                                  [{
                                    text: 'OK',
                                    onPress: () => {
                                      // Nettoyer le stockage local et rediriger vers l'écran de connexion
                                      AsyncStorage.clear();
                                      navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                      });
                                    }
                                  }]
                                );
                              } catch (error) {
                                console.error('Erreur lors de la suppression du compte:', error);
                                Alert.alert('Erreur', error.message || 'Impossible de supprimer le compte');
                              } finally {
                                setLoading(false);
                              }
                            } else {
                              Alert.alert('Erreur', 'Confirmation incorrecte. Tapez "DELETE" exactement.');
                            }
                          },
                        },
                      ],
                      'plain-text'
                    );
                  },
                },
              ],
              'secure-text'
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
      
      <Text style={styles.headerTitle}>Paramètres Cloud</Text>
      
      <View style={styles.headerButton} />
    </BlurView>
  );
  
  const renderStorageInfo = () => {
    if (!storageStats) return null;
    
    const usedPercentage = (storageStats.totalSize / storageStats.storageLimit) * 100;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stockage</Text>
        <BlurView blurAmount={10} blurType="light" style={styles.card}>
          <View style={styles.storageHeader}>
            <Ionicons name="cloud" size={24} color="#FFDE59" />
            <Text style={styles.storageTitle}>Utilisation du stockage</Text>
          </View>
          
          <View style={styles.storageBar}>
            <View style={[styles.storageProgress, { width: `${Math.min(usedPercentage, 100)}%` }]} />
          </View>
          
          <View style={styles.storageStats}>
            <Text style={styles.storageText}>
              {cloudService.formatFileSize(storageStats.totalSize)} / {cloudService.formatFileSize(storageStats.storageLimit)}
            </Text>
            <Text style={styles.storagePercentage}>{usedPercentage.toFixed(1)}%</Text>
          </View>
          
          <Text style={styles.filesCount}>{storageStats.fileCount} fichiers stockés</Text>
          
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => navigation.navigate('StoragePlans')}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>Augmenter le stockage</Text>
            <Ionicons name="arrow-forward" size={16} color="#333" />
          </TouchableOpacity>
        </BlurView>
      </View>
    );
  };
  
  const renderSettingItem = (icon, title, description, value, onToggle, type = 'switch') => (
    <BlurView blurAmount={10} blurType="light" style={styles.settingCard}>
      <View style={styles.settingContent}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={24} color="#FFDE59" />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: 'rgba(255, 255, 255, 0.2)', true: '#FFDE59' }}
            thumbColor={value ? '#333' : 'white'}
          />
        )}
        {type === 'arrow' && (
          <TouchableOpacity onPress={onToggle} style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        )}
      </View>
    </BlurView>
  );
  
  const renderActionButton = (icon, title, description, onPress, color = 'white', dangerous = false) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <BlurView blurAmount={10} blurType="light" style={[styles.actionCard, dangerous && styles.dangerousCard]}>
        <View style={styles.actionIcon}>
          <Ionicons name={icon} size={24} color={dangerous ? '#ff4757' : color} />
        </View>
        <View style={styles.actionInfo}>
          <Text style={[styles.actionTitle, dangerous && styles.dangerousText]}>{title}</Text>
          <Text style={[styles.actionDescription, dangerous && styles.dangerousDescription]}>
            {description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={dangerous ? '#ff4757' : 'rgba(255, 255, 255, 0.7)'} />
      </BlurView>
    </TouchableOpacity>
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
          {renderStorageInfo()}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Synchronisation</Text>
            {renderSettingItem(
              'sync',
              'Synchronisation automatique',
              'Synchroniser automatiquement vos fichiers',
              settings.autoSync,
              (value) => updateSetting('autoSync', value)
            )}
            {renderSettingItem(
              'wifi',
              'Wi-Fi uniquement',
              'Synchroniser seulement en Wi-Fi',
              settings.wifiOnly,
              (value) => updateSetting('wifiOnly', value)
            )}
            {renderSettingItem(
              'cloud-upload',
              'Sauvegarde automatique',
              'Sauvegarder automatiquement les nouveaux fichiers',
              settings.autoBackup,
              (value) => updateSetting('autoBackup', value)
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            {renderSettingItem(
              'notifications',
              'Notifications push',
              'Recevoir des notifications pour les activités',
              settings.notifications,
              (value) => updateSetting('notifications', value)
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optimisation</Text>
            {renderSettingItem(
              'archive',
              'Compression des fichiers',
              'Compresser les fichiers pour économiser l\'espace',
              settings.compressionEnabled,
              (value) => updateSetting('compressionEnabled', value)
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            {renderActionButton(
              'trash',
              'Vider le cache',
              'Supprimer les fichiers temporaires',
              clearCache,
              '#FFDE59'
            )}
            {renderActionButton(
              'download',
              'Exporter les données',
              'Télécharger une copie de vos données',
              exportData,
              '#4facfe'
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zone de danger</Text>
            {renderActionButton(
              'person-remove',
              'Supprimer le compte',
              'Supprimer définitivement votre compte et toutes vos données',
              deleteAccount,
              '#ff4757',
              true
            )}
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 12,
  },
  storageBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  storageProgress: {
    height: '100%',
    backgroundColor: '#FFDE59',
    borderRadius: 4,
  },
  storageStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  storagePercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFDE59',
    fontFamily: 'Poppins-SemiBold',
  },
  filesCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDE59',
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
    marginRight: 8,
  },
  settingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  arrowButton: {
    padding: 8,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  dangerousCard: {
    borderColor: 'rgba(255, 71, 87, 0.3)',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  dangerousText: {
    color: '#ff4757',
  },
  actionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  dangerousDescription: {
    color: 'rgba(255, 71, 87, 0.7)',
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

export default CloudSettingsScreen;