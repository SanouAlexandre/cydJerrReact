import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import { createStatus } from '../../redux/speakjerrSlice';
import * as ImagePicker from 'expo-image-picker';

const CreateStatusScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { loading } = useSelector(state => state.speakjerr.statuses);
  const insets = useSafeAreaInsets();
  
  const [content, setContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' ou 'video'

  const handleSelectMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à vos photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [9, 16], // Format story
        quality: 0.8,
        videoMaxDuration: 30, // 30 secondes max pour les vidéos
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        setMediaType(asset.type === 'video' ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du média:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner le média');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre permission pour accéder à votre caméra.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedMedia(asset.uri);
        setMediaType('image');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const handleRemoveMedia = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  const handlePublish = async () => {
    if (!content.trim() && !selectedMedia) {
      Alert.alert('Erreur', 'Veuillez ajouter du contenu ou un média à votre statut');
      return;
    }

    try {
      const statusData = {
        content: content.trim(),
      };

      // Ajouter les médias dans le bon format pour l'API
      if (selectedMedia) {
        statusData.media = [{
          uri: selectedMedia,
          type: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
          name: `status_media.${mediaType === 'video' ? 'mp4' : 'jpg'}`,
        }];
      }

      await dispatch(createStatus(statusData)).unwrap();
      
      Alert.alert(
        'Succès',
        'Votre statut a été publié avec succès !',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
      Alert.alert('Erreur', 'Impossible de publier le statut. Veuillez réessayer.');
    }
  };

  const renderMediaOptions = () => (
    <View style={styles.mediaOptions}>
      <TouchableOpacity
        style={styles.mediaOption}
        onPress={handleTakePhoto}
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={24} color="#007AFF" />
        <Text style={styles.mediaOptionText}>Caméra</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.mediaOption}
        onPress={handleSelectMedia}
        activeOpacity={0.7}
      >
        <Ionicons name="images" size={24} color="#007AFF" />
        <Text style={styles.mediaOptionText}>Galerie</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedMedia = () => {
    if (!selectedMedia) return null;

    return (
      <View style={styles.selectedMediaContainer}>
        <View style={styles.mediaPreview}>
          {mediaType === 'image' ? (
            <Image source={{ uri: selectedMedia }} style={styles.mediaImage} />
          ) : (
            <View style={styles.videoPlaceholder}>
              <Ionicons name="play-circle" size={48} color="#FFFFFF" />
              <Text style={styles.videoText}>Vidéo sélectionnée</Text>
            </View>
          )}
          
          <TouchableOpacity
            style={styles.removeMediaButton}
            onPress={handleRemoveMedia}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>Annuler</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Nouveau statut</Text>
      
      <TouchableOpacity
        style={[styles.publishButton, (!content.trim() && !selectedMedia) && styles.publishButtonDisabled]}
        onPress={handlePublish}
        disabled={loading || (!content.trim() && !selectedMedia)}
        activeOpacity={0.7}
      >
        <Text style={[styles.publishText, (!content.trim() && !selectedMedia) && styles.publishTextDisabled]}>
          {loading ? 'Publication...' : 'Publier'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      {renderHeader()}
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userUsername}>@{user?.username}</Text>
          </View>
        </View>
        
        <TextInput
          style={styles.contentInput}
          placeholder="Que voulez-vous partager ?"
          placeholderTextColor="#8E8E93"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
          textAlignVertical="top"
        />
        
        <Text style={styles.characterCount}>
          {content.length}/500
        </Text>
        
        {renderSelectedMedia()}
        {renderMediaOptions()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 24,
      },
    }),
  },
  backButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  publishButton: {
    paddingVertical: 8,
  },
  publishButtonDisabled: {
    opacity: 0.5,
  },
  publishText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  publishTextDisabled: {
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  userUsername: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  contentInput: {
    fontSize: 16,
    color: '#000000',
    minHeight: 120,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 8,
  },
  selectedMediaContainer: {
    marginVertical: 16,
  },
  mediaPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    marginTop: 20,
  },
  mediaOption: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  mediaOptionText: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default CreateStatusScreen;