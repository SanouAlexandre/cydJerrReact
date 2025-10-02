import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, MediaType, ImagePickerResponse} from 'react-native-image-picker';
import DocumentPicker from '@react-native-documents/picker';
import Video from 'react-native-video';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { colors, fontSizes, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { glass } from '../utils/glass';
import { gradients } from '../utils/gradients';
import { useCreateVideoPost } from '../hooks/useApi';

const { width, height } = Dimensions.get('window');

const VideoUploadScreen = ({ navigation }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowDownload, setAllowDownload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const videoRef = useRef(null);
  
  // Hook pour créer un post vidéo avec upload
  const createVideoPostMutation = useCreateVideoPost();

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        const asset = result[0];
        setSelectedVideo(asset);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled the picker
        return;
      }
      console.error('Erreur lors de la sélection de la vidéo:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner la vidéo');
    }
  };

  const pickThumbnail = async () => {
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          return;
        }
        
        if (response.errorMessage) {
          console.error('Erreur lors de la sélection de la miniature:', response.errorMessage);
          Alert.alert('Erreur', 'Impossible de sélectionner la miniature');
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setThumbnail(response.assets[0]);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection de la miniature:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner la miniature');
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert('Erreur', 'Veuillez sélectionner une vidéo');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer un titre');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Préparer les données pour l'upload et la création du post
      const formData = new FormData();
      
      // Ajouter le fichier vidéo
      formData.append('media', {
        uri: selectedVideo.uri,
        type: selectedVideo.mimeType || 'video/mp4',
        name: selectedVideo.name || 'video.mp4',
      });
      
      // Ajouter la miniature si présente
      if (thumbnail) {
        formData.append('media', {
          uri: thumbnail.uri,
          type: 'image/jpeg',
          name: 'thumbnail.jpg',
        });
      }
      
      // Ajouter les métadonnées du post
      formData.append('content', title);
      formData.append('description', description || '');
      formData.append('type', 'video');
      
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        formData.append('tags', JSON.stringify(tagArray));
      }
      
      formData.append('settings', JSON.stringify({
        isPublic,
        allowComments,
        allowDownload,
      }));

      // Simuler la progression d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Créer le post avec upload
      await createVideoPostMutation.mutateAsync(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      
      Alert.alert('Succès', 'Vidéo uploadée avec succès!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', error.message || 'Échec de l\'upload de la vidéo');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleSetting = (setting) => {
    switch (setting) {
      case 'public':
        setIsPublic(!isPublic);
        break;
      case 'comments':
        setAllowComments(!allowComments);
        break;
      case 'download':
        setAllowDownload(!allowDownload);
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={gradients.main} style={styles.backgroundGradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Upload Vidéo</Text>
          
          <TouchableOpacity 
            style={[styles.headerButton, { opacity: isUploading ? 0.5 : 1 }]}
            onPress={handleUpload}
            disabled={isUploading}
          >
            <Ionicons name="checkmark" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sélection de vidéo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vidéo</Text>
            
            {!selectedVideo ? (
              <TouchableOpacity style={styles.uploadArea} onPress={pickVideo}>
                <Ionicons name="cloud-upload-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.uploadText}>Sélectionner une vidéo</Text>
                <Text style={styles.uploadSubtext}>MP4, MOV, AVI jusqu'à 500MB</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.videoContainer}>
                <Video
                  ref={videoRef}
                  style={styles.videoPreview}
                  source={{ uri: selectedVideo.uri }}
                  controls={true}
                  resizeMode="contain"
                  paused={true}
                />
                <View style={styles.videoInfo}>
                  <Text style={styles.videoName} numberOfLines={1}>
                    {selectedVideo.name}
                  </Text>
                  <Text style={styles.videoSize}>
                    {formatFileSize(selectedVideo.size)}
                  </Text>
                  <TouchableOpacity style={styles.changeButton} onPress={pickVideo}>
                    <Ionicons name="refresh" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Miniature */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Miniature</Text>
            
            {!thumbnail ? (
              <TouchableOpacity style={styles.thumbnailUploadArea} onPress={pickThumbnail}>
                <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
                <Text style={styles.thumbnailUploadText}>Ajouter une miniature</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.thumbnailContainer}>
                <Image source={{ uri: thumbnail.uri }} style={styles.thumbnailPreview} />
                <TouchableOpacity style={styles.changeThumbnailButton} onPress={pickThumbnail}>
                  <Ionicons name="camera" size={16} color={colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Détails de la vidéo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détails</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Titre *</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
                placeholder="Titre de votre vidéo"
                placeholderTextColor={colors.textSecondary}
                maxLength={100}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Décrivez votre vidéo..."
                placeholderTextColor={colors.textSecondary}
                multiline
                maxLength={500}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Tags</Text>
              <TextInput
                style={styles.textInput}
                value={tags}
                onChangeText={setTags}
                placeholder="Séparez les tags par des virgules"
                placeholderTextColor={colors.textSecondary}
                maxLength={200}
              />
            </View>
          </View>

          {/* Paramètres */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => toggleSetting('public')}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Vidéo publique</Text>
                <Text style={styles.settingDescription}>
                  Visible par tous les utilisateurs
                </Text>
              </View>
              <View style={[styles.toggle, isPublic && styles.toggleActive]}>
                <View style={[styles.toggleThumb, isPublic && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => toggleSetting('comments')}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Autoriser les commentaires</Text>
                <Text style={styles.settingDescription}>
                  Les utilisateurs peuvent commenter
                </Text>
              </View>
              <View style={[styles.toggle, allowComments && styles.toggleActive]}>
                <View style={[styles.toggleThumb, allowComments && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => toggleSetting('download')}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Autoriser le téléchargement</Text>
                <Text style={styles.settingDescription}>
                  Les utilisateurs peuvent télécharger
                </Text>
              </View>
              <View style={[styles.toggle, allowDownload && styles.toggleActive]}>
                <View style={[styles.toggleThumb, allowDownload && styles.toggleThumbActive]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          {isUploading && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upload en cours...</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
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
    backgroundColor: '#1A1A2E',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? verticalScale(10) : 0,
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    ...glass.header,
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    ...glass.button,
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(12),
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(40),
    borderRadius: scale(12),
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderStyle: 'dashed',
    ...glass.card,
  },
  uploadText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginTop: verticalScale(12),
  },
  uploadSubtext: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: verticalScale(4),
  },
  videoContainer: {
    ...glass.card,
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: verticalScale(200),
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(12),
  },
  videoName: {
    flex: 1,
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
  },
  videoSize: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginLeft: scale(8),
  },
  changeButton: {
    padding: scale(8),
  },
  thumbnailUploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(24),
    borderRadius: scale(12),
    ...glass.card,
  },
  thumbnailUploadText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
    marginTop: verticalScale(8),
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  thumbnailPreview: {
    width: '100%',
    height: verticalScale(120),
    borderRadius: scale(12),
  },
  changeThumbnailButton: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: scale(16),
    padding: scale(8),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginBottom: verticalScale(8),
  },
  textInput: {
    ...glass.input,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    borderRadius: scale(8),
  },
  textArea: {
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(8),
    borderRadius: scale(8),
    ...glass.card,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
  },
  settingDescription: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  toggle: {
    width: scale(48),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    paddingHorizontal: scale(2),
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: colors.white,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  progressBar: {
    flex: 1,
    height: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
  },
});

export default VideoUploadScreen;