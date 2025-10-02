import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
import {launchImageLibrary, MediaType, ImagePickerResponse} from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { useCreateLive } from '../hooks/useApi';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { colors, fontSizes, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { glass } from '../utils/glass';
import { gradients } from '../utils/gradients';

const { width, height } = Dimensions.get('window');

const LiveSetupScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const createLiveMutation = useCreateLive();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Général');
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowRecording, setAllowRecording] = useState(true);
  const [thumbnail, setThumbnail] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const cameraRef = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const devices = useCameraDevices();
  const device = devices.front;
  
  const categories = [
    'Général',
    'Gaming',
    'Musique',
    'Sport',
    'Éducation',
    'Technologie',
    'Cuisine',
    'Art',
    'Voyage',
    'Lifestyle',
  ];

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const pickThumbnail = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets.length > 0) {
        setThumbnail(response.assets[0]);
      }
    });
  };

  const takeThumbnailPhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'quality',
          flash: 'off',
        });
        setThumbnail({ uri: photo.path });
        setShowPreview(false);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Erreur', 'Impossible de prendre la photo');
      }
    }
  };

  const handleCreateLive = async () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour votre live');
      return;
    }

    try {
      const liveData = {
        title: title.trim(),
        description: description.trim(),
        category,
        isPrivate,
        allowComments,
        allowRecording,
        thumbnail: thumbnail?.uri,
        userId: user.id,
      };

      const response = await createLiveMutation.mutateAsync(liveData);
      
      // Navigate to live stream screen
      navigation.replace('LiveStream', {
        liveId: response.id,
        mode: 'streamer',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le live. Veuillez réessayer.');
    }
  };

  const renderCategorySelector = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Catégorie</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              category === cat && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              category === cat && styles.categoryTextActive,
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderThumbnailSection = () => (
    <View style={styles.thumbnailSection}>
      <Text style={styles.sectionTitle}>Miniature du live</Text>
      
      {thumbnail ? (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: thumbnail.uri }} style={styles.thumbnailImage} />
          <TouchableOpacity 
            style={styles.thumbnailRemove}
            onPress={() => setThumbnail(null)}
          >
            <Ionicons name="close" size={scale(20)} color={colors.white} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.thumbnailPlaceholder}>
          <Ionicons name="image" size={scale(48)} color={colors.textSecondary} />
          <Text style={styles.thumbnailPlaceholderText}>Aucune miniature</Text>
        </View>
      )}
      
      <View style={styles.thumbnailActions}>
        <TouchableOpacity style={styles.thumbnailButton} onPress={pickThumbnail}>
          <Ionicons name="images" size={scale(20)} color={colors.primary} />
          <Text style={styles.thumbnailButtonText}>Galerie</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.thumbnailButton} 
          onPress={() => setShowPreview(true)}
        >
          <Ionicons name="camera" size={scale(20)} color={colors.primary} />
          <Text style={styles.thumbnailButtonText}>Caméra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCameraPreview = () => {
    if (!showPreview || !hasPermission || !device) return null;

    return (
      <View style={styles.cameraPreviewContainer}>
        <View style={styles.cameraPreview}>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={device}
            isActive={showPreview}
            photo={true}
          >
            <View style={styles.cameraOverlay}>
              <TouchableOpacity 
                style={styles.cameraCloseButton}
                onPress={() => setShowPreview(false)}
              >
                <Ionicons name="close" size={scale(24)} color={colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cameraCaptureButton}
                onPress={takeThumbnailPhoto}
              >
                <View style={styles.cameraCaptureInner} />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient colors={gradients.darkPurple} style={styles.gradient}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={scale(24)} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Configurer le live</Text>
          
          <TouchableOpacity 
            style={[
              styles.createButton,
              !title.trim() && styles.createButtonDisabled,
            ]}
            onPress={handleCreateLive}
            disabled={!title.trim() || createLiveMutation.isLoading}
          >
            <Text style={[
              styles.createButtonText,
              !title.trim() && styles.createButtonTextDisabled,
            ]}>
              {createLiveMutation.isLoading ? 'Création...' : 'Créer'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          {/* Title Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Titre du live *</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Donnez un titre accrocheur à votre live"
              placeholderTextColor={colors.textSecondary}
              maxLength={100}
            />
            <Text style={styles.characterCount}>{title.length}/100</Text>
          </View>
          
          {/* Description Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez le contenu de votre live (optionnel)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={styles.characterCount}>{description.length}/500</Text>
          </View>
          
          {/* Category Selector */}
          {renderCategorySelector()}
          
          {/* Thumbnail Section */}
          {renderThumbnailSection()}
          
          {/* Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Paramètres</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Live privé</Text>
                <Text style={styles.settingDescription}>
                  Seules les personnes avec le lien peuvent rejoindre
                </Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Autoriser les commentaires</Text>
                <Text style={styles.settingDescription}>
                  Les spectateurs peuvent envoyer des messages
                </Text>
              </View>
              <Switch
                value={allowComments}
                onValueChange={setAllowComments}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Autoriser l'enregistrement</Text>
                <Text style={styles.settingDescription}>
                  Le live sera sauvegardé après la diffusion
                </Text>
              </View>
              <Switch
                value={allowRecording}
                onValueChange={setAllowRecording}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.white}
              />
            </View>
          </View>
          
          {/* Preview Section */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Aperçu</Text>
            <View style={styles.previewCard}>
              <View style={styles.previewThumbnail}>
                {thumbnail ? (
                  <Image source={{ uri: thumbnail.uri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Ionicons name="videocam" size={scale(32)} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.previewLiveBadge}>
                  <Text style={styles.previewLiveText}>LIVE</Text>
                </View>
              </View>
              
              <View style={styles.previewInfo}>
                <Text style={styles.previewTitle} numberOfLines={2}>
                  {title || 'Titre du live'}
                </Text>
                <Text style={styles.previewCreator}>{user.name || 'Votre nom'}</Text>
                <Text style={styles.previewCategory}>{category}</Text>
              </View>
            </View>
          </View>
          
          <View style={{ height: verticalScale(100) }} />
        </ScrollView>
        
        {/* Camera Preview Modal */}
        {renderCameraPreview()}
        
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingTop: Platform.OS === 'android' ? verticalScale(20) : 0,
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: scale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: scale(16),
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
  },
  createButtonDisabled: {
    backgroundColor: colors.border,
  },
  createButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  createButtonTextDisabled: {
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  inputSection: {
    marginTop: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(12),
  },
  titleInput: {
    ...glass.input,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    borderRadius: scale(12),
  },
  descriptionInput: {
    ...glass.input,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.text,
    borderRadius: scale(12),
    height: verticalScale(100),
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: verticalScale(4),
  },
  categoryContainer: {
    marginTop: verticalScale(24),
  },
  categoryScroll: {
    marginTop: verticalScale(8),
  },
  categoryChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    borderRadius: scale(20),
    marginRight: scale(8),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  thumbnailSection: {
    marginTop: verticalScale(24),
  },
  thumbnailContainer: {
    position: 'relative',
    marginTop: verticalScale(12),
  },
  thumbnailImage: {
    width: '100%',
    height: verticalScale(120),
    borderRadius: scale(12),
  },
  thumbnailRemove: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: scale(16),
    padding: scale(4),
  },
  thumbnailPlaceholder: {
    height: verticalScale(120),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(12),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  thumbnailPlaceholderText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginTop: verticalScale(8),
  },
  thumbnailActions: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(12),
  },
  thumbnailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: colors.primary,
    gap: scale(8),
  },
  thumbnailButtonText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
  settingsSection: {
    marginTop: verticalScale(24),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingInfo: {
    flex: 1,
    marginRight: scale(16),
  },
  settingTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  settingDescription: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    lineHeight: moderateScale(16),
  },
  previewSection: {
    marginTop: verticalScale(24),
  },
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: scale(12),
    padding: scale(12),
    marginTop: verticalScale(12),
  },
  previewThumbnail: {
    position: 'relative',
    width: '100%',
    height: verticalScale(100),
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewLiveBadge: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    backgroundColor: '#FF4444',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(4),
  },
  previewLiveText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Bold',
    color: colors.white,
  },
  previewInfo: {
    marginTop: verticalScale(12),
  },
  previewTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    marginBottom: verticalScale(4),
  },
  previewCreator: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    marginBottom: verticalScale(2),
  },
  previewCategory: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.primary,
  },
  cameraPreviewContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  cameraPreview: {
    width: width * 0.9,
    height: (width * 0.9) * (9/16),
    borderRadius: scale(12),
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
  },
  cameraCloseButton: {
    alignSelf: 'flex-end',
    marginRight: scale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: scale(20),
    padding: scale(8),
  },
  cameraCaptureButton: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  cameraCaptureInner: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: colors.white,
  },
});

export default LiveSetupScreen;