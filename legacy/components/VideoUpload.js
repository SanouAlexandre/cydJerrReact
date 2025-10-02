import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from 'react-native-vector-icons';
import {launchImageLibrary, launchCamera, MediaType, ImagePickerResponse} from 'react-native-image-picker';
import DocumentPicker from '@react-native-documents/picker';

import { useCreatePost, useCreateVideoPost } from '../hooks/useApi';

const VideoUpload = ({ visible, onClose, onSuccess }) => {
  const createPostMutation = useCreatePost();
  const createVideoPostMutation = useCreateVideoPost();
  const isUploading = createPostMutation.isLoading || createVideoPostMutation.isLoading;
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'video', 'image', 'text'
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('Tous');
  const [isShort, setIsShort] = useState(false);
  
  const categories = [
    'Tous', 'Gaming', 'Musique', 'Tech', 'Sport', 
    'Cuisine', 'Voyage', 'Mode', 'Éducation', 'Divertissement'
  ];
  
  const resetForm = useCallback(() => {
    setSelectedMedia(null);
    setMediaType(null);
    setContent('');
    setTitle('');
    setTags('');
    setCategory('Tous');
    setIsShort(false);
  }, []);
  
  const requestPermissions = useCallback(async () => {
    // react-native-image-picker handles permissions automatically
    return true;
  }, []);
  
  const selectVideoFromGallery = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const options = {
        mediaType: 'video',
        quality: 0.8,
        videoQuality: 'medium',
        durationLimit: 30,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          if (response.errorMessage) {
            console.error('Erreur lors de la sélection de vidéo:', response.errorMessage);
            Alert.alert('Erreur', 'Impossible de sélectionner la vidéo');
          }
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          // Déterminer le type MIME basé sur l'extension du fichier
          const fileExtension = asset.uri?.split('.').pop()?.toLowerCase();
          let mimeType = 'video/mp4'; // Type par défaut
          
          switch (fileExtension) {
            case 'mov':
              mimeType = 'video/mov';
              break;
            case 'avi':
              mimeType = 'video/avi';
              break;
            case 'mkv':
              mimeType = 'video/mkv';
              break;
            case 'webm':
              mimeType = 'video/webm';
              break;
            default:
              mimeType = 'video/mp4';
          }
          
          setSelectedMedia({
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `video_${Date.now()}.${fileExtension || 'mp4'}`,
            duration: asset.duration,
            width: asset.width,
            height: asset.height,
          });
          setMediaType('video');
          
          // Déterminer si c'est un short (< 60 secondes)
          if (asset.duration && asset.duration < 60000) {
            setIsShort(true);
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection de vidéo:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner la vidéo');
    }
  }, [requestPermissions]);
  
  const recordVideo = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const options = {
        mediaType: 'video',
        quality: 0.8,
        videoQuality: 'medium',
        durationLimit: 300, // 5 minutes max
      };

      launchCamera(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          if (response.errorMessage) {
            console.error('Erreur lors de l\'enregistrement:', response.errorMessage);
            Alert.alert('Erreur', 'Impossible d\'enregistrer la vidéo');
          }
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          // Déterminer le type MIME basé sur l'extension du fichier
          const fileExtension = asset.uri?.split('.').pop()?.toLowerCase();
          let mimeType = 'video/mp4'; // Type par défaut
          
          switch (fileExtension) {
            case 'mov':
              mimeType = 'video/mov';
              break;
            case 'avi':
              mimeType = 'video/avi';
              break;
            case 'mkv':
              mimeType = 'video/mkv';
              break;
            case 'webm':
              mimeType = 'video/webm';
              break;
            default:
              mimeType = 'video/mp4';
          }
          
          setSelectedMedia({
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `video_${Date.now()}.${fileExtension || 'mp4'}`,
            duration: asset.duration,
            width: asset.width,
            height: asset.height,
          });
          setMediaType('video');
          
          // Déterminer si c'est un short (< 60 secondes)
          if (asset.duration && asset.duration < 60000) {
            setIsShort(true);
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      Alert.alert('Erreur', 'Impossible d\'enregistrer la vidéo');
    }
  }, [requestPermissions]);
  
  const selectImage = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          if (response.errorMessage) {
            console.error('Erreur lors de la sélection d\'image:', response.errorMessage);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
          }
          return;
        }

        if (response.assets && response.assets[0]) {
          const asset = response.assets[0];
          
          // Déterminer le type MIME basé sur l'extension du fichier
          const fileExtension = asset.uri?.split('.').pop()?.toLowerCase();
          let mimeType = 'image/jpeg'; // Type par défaut
          
          switch (fileExtension) {
            case 'png':
              mimeType = 'image/png';
              break;
            case 'gif':
              mimeType = 'image/gif';
              break;
            case 'webp':
              mimeType = 'image/webp';
              break;
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            default:
              mimeType = 'image/jpeg';
          }
          
          setSelectedMedia({
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `image_${Date.now()}.${fileExtension || 'jpg'}`,
            width: asset.width,
            height: asset.height,
          });
          setMediaType('image');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  }, [requestPermissions]);
  
  const createTextPost = useCallback(() => {
    setMediaType('text');
    setSelectedMedia(null);
  }, []);
  
  const handleUpload = useCallback(async () => {
    if (!content.trim()) {
      Alert.alert('Erreur', 'Veuillez ajouter du contenu à votre post');
      return;
    }
    
    if (mediaType === 'video' && !selectedMedia) {
      Alert.alert('Erreur', 'Veuillez sélectionner une vidéo');
      return;
    }
    
    try {
      const postData = {
        content: content.trim(),
        title: title.trim() || undefined,
        category: category !== 'Tous' ? category.toLowerCase() : undefined,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        isShort,
        media: selectedMedia ? [selectedMedia] : [],
      };
      
      // Utiliser le bon hook selon le type de média
      if (mediaType === 'video') {
        await createVideoPostMutation.mutateAsync(postData);
      } else {
        await createPostMutation.mutateAsync(postData);
      }
      
      Alert.alert('Succès', 'Votre contenu a été publié avec succès!', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            onSuccess?.();
            onClose();
          }
        }
      ]);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', error.message || 'Impossible de publier le contenu');
    }
  }, [content, title, category, tags, isShort, selectedMedia, mediaType, createPostMutation, resetForm, onSuccess, onClose]);
  
  const formatDuration = useCallback((duration) => {
    if (!duration) return '0:00';
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  if (!visible) return null;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Créer du contenu</Text>
            <TouchableOpacity 
              onPress={handleUpload} 
              style={[styles.publishButton, (!content.trim() || isUploading) && styles.publishButtonDisabled]}
              disabled={!content.trim() || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.publishButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Media Selection */}
          {!mediaType && (
            <View style={styles.mediaSelection}>
              <Text style={styles.sectionTitle}>Choisir le type de contenu</Text>
              
              <TouchableOpacity style={styles.mediaOption} onPress={recordVideo}>
                <View style={styles.mediaOptionIcon}>
                  <Ionicons name="videocam" size={32} color="#FF3030" />
                </View>
                <View style={styles.mediaOptionContent}>
                  <Text style={styles.mediaOptionTitle}>Enregistrer une vidéo</Text>
                  <Text style={styles.mediaOptionSubtitle}>Utilisez votre caméra</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaOption} onPress={selectVideoFromGallery}>
                <View style={styles.mediaOptionIcon}>
                  <Ionicons name="library" size={32} color="#FF3030" />
                </View>
                <View style={styles.mediaOptionContent}>
                  <Text style={styles.mediaOptionTitle}>Choisir une vidéo</Text>
                  <Text style={styles.mediaOptionSubtitle}>Depuis votre galerie</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaOption} onPress={selectImage}>
                <View style={styles.mediaOptionIcon}>
                  <Ionicons name="image" size={32} color="#FF3030" />
                </View>
                <View style={styles.mediaOptionContent}>
                  <Text style={styles.mediaOptionTitle}>Ajouter une image</Text>
                  <Text style={styles.mediaOptionSubtitle}>Photo ou illustration</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.mediaOption} onPress={createTextPost}>
                <View style={styles.mediaOptionIcon}>
                  <Ionicons name="create" size={32} color="#FF3030" />
                </View>
                <View style={styles.mediaOptionContent}>
                  <Text style={styles.mediaOptionTitle}>Post texte</Text>
                  <Text style={styles.mediaOptionSubtitle}>Partager vos pensées</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Selected Media Preview */}
          {selectedMedia && (
            <View style={styles.mediaPreview}>
              <View style={styles.mediaPreviewHeader}>
                <Text style={styles.sectionTitle}>Aperçu du média</Text>
                <TouchableOpacity onPress={() => { setSelectedMedia(null); setMediaType(null); }}>
                  <Ionicons name="trash-outline" size={20} color="#FF3030" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.mediaContainer}>
                <Image source={{ uri: selectedMedia.uri }} style={styles.mediaImage} />
                {selectedMedia.type === 'video' && (
                  <View style={styles.mediaOverlay}>
                    <Ionicons name="play" size={32} color="#FFFFFF" />
                    <Text style={styles.mediaDuration}>
                      {formatDuration(selectedMedia.duration)}
                    </Text>
                  </View>
                )}
                {isShort && (
                  <View style={styles.shortBadge}>
                    <Text style={styles.shortBadgeText}>SHORT</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Content Form */}
          {mediaType && (
            <View style={styles.form}>
              {/* Title */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titre (optionnel)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Donnez un titre à votre contenu..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>
              
              {/* Content */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Décrivez votre contenu..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={content}
                  onChangeText={setContent}
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.characterCount}>{content.length}/500</Text>
              </View>
              
              {/* Category */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Catégorie</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categoryContainer}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                        onPress={() => setCategory(cat)}
                      >
                        <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
              
              {/* Tags */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tags (séparés par des virgules)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="gaming, tech, tutoriel..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={tags}
                  onChangeText={setTags}
                  maxLength={200}
                />
              </View>
              
              {/* Short Toggle for Videos */}
              {mediaType === 'video' && (
                <View style={styles.inputGroup}>
                  <TouchableOpacity 
                    style={styles.toggleContainer}
                    onPress={() => setIsShort(!isShort)}
                  >
                    <View style={styles.toggleInfo}>
                      <Text style={styles.inputLabel}>Marquer comme Short</Text>
                      <Text style={styles.toggleSubtitle}>Vidéos courtes (moins de 60s)</Text>
                    </View>
                    <View style={[styles.toggle, isShort && styles.toggleActive]}>
                      {isShort && <View style={styles.toggleIndicator} />}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {/* Upload Progress */}
          {isUploading && (
            <View style={styles.uploadProgress}>
              <Text style={styles.uploadProgressText}>
                Upload en cours... {Math.round(uploadProgress)}%
              </Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#FF3030',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  publishButtonDisabled: {
    backgroundColor: 'rgba(255,48,48,0.5)',
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  mediaSelection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mediaOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,48,48,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  mediaOptionContent: {
    flex: 1,
  },
  mediaOptionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  mediaOptionSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  mediaPreview: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mediaPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mediaContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  mediaOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mediaDuration: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shortBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF3030',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shortBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryChipActive: {
    backgroundColor: '#FF3030',
    borderColor: '#FF3030',
  },
  categoryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#FF3030',
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-end',
  },
  uploadProgress: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  uploadProgressText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF3030',
    borderRadius: 2,
  },
});

export default VideoUpload;