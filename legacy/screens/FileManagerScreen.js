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
  RefreshControl,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import cloudService from '../services/cloudService';

const FileManagerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title = 'Gestionnaire de fichiers', folder = '/', view = 'list' } = route.params || {};
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'grid'
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  useEffect(() => {
    loadFiles();
  }, [folder, sortBy, sortOrder]);
  
  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await cloudService.getFiles({
        folder,
        sortBy,
        sortOrder,
        search: searchQuery
      });
      // Le backend retourne les fichiers dans response.data.files
      setFiles(response.data?.files || response.files || response.data || response);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
      Alert.alert('Erreur', 'Impossible de charger les fichiers');
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFiles();
    setRefreshing(false);
  };
  
  const handleFilePress = (file) => {
    Alert.alert(
      file.name,
      `Taille: ${cloudService.formatFileSize(file.size)}\nType: ${file.mimeType}\nUploadé: ${new Date(file.uploadedAt).toLocaleDateString()}`,
      [
        { text: 'Télécharger', onPress: () => downloadFile(file) },
        { text: 'Partager', onPress: () => shareFile(file) },
        { text: 'Supprimer', onPress: () => deleteFile(file), style: 'destructive' },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };
  
  const downloadFile = async (file) => {
    try {
      const downloadUrl = await cloudService.getDownloadUrl(file._id);
      Alert.alert('Téléchargement', 'Le téléchargement va commencer...');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de télécharger le fichier');
    }
  };
  
  const shareFile = async (file) => {
    Alert.prompt(
      'Partager le fichier',
      'Entrez l\'email de la personne avec qui partager:',
      async (email) => {
        if (email) {
          try {
            await cloudService.shareFile(file._id, email);
            Alert.alert('Succès', 'Fichier partagé avec succès!');
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de partager le fichier');
          }
        }
      }
    );
  };
  
  const deleteFile = async (file) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${file.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await cloudService.deleteFile(file._id);
              Alert.alert('Succès', 'Fichier supprimé avec succès!');
              loadFiles();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le fichier');
            }
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
      
      <Text style={styles.headerTitle}>{title}</Text>
      
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
        activeOpacity={0.7}
      >
        <Ionicons name={viewMode === 'list' ? 'grid' : 'list'} size={24} color="white" />
      </TouchableOpacity>
    </BlurView>
  );
  
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <BlurView blurAmount={10} blurType="light" style={styles.searchBar}>
        <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.7)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher des fichiers..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={loadFiles}
        />
      </BlurView>
    </View>
  );
  
  const renderFileItem = (file) => (
    <TouchableOpacity
      key={file._id}
      style={styles.fileItem}
      onPress={() => handleFilePress(file)}
      activeOpacity={0.7}
    >
      <BlurView blurAmount={10} blurType="light" style={styles.fileCard}>
        <View style={styles.fileIcon}>
          <Ionicons
            name={cloudService.getFileIcon(file.mimeType)}
            size={32}
            color={cloudService.getFileIconColor(file.mimeType)}
          />
        </View>
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
          <Text style={styles.fileSize}>{cloudService.formatFileSize(file.size)}</Text>
          <Text style={styles.fileDate}>
            {new Date(file.uploadedAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="rgba(255, 255, 255, 0.7)" />
        </TouchableOpacity>
      </BlurView>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderHeader()}
        {renderSearchBar()}
        
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
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Chargement des fichiers...</Text>
            </View>
          ) : files.length > 0 ? (
            files.map(renderFileItem)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyText}>Aucun fichier trouvé</Text>
              <Text style={styles.emptySubtext}>Uploadez vos premiers fichiers pour commencer</Text>
            </View>
          )}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fileItem: {
    marginBottom: 12,
  },
  fileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  fileDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default FileManagerScreen;