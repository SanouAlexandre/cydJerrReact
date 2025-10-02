
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Modal, Text, TextInput, ScrollView, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary, MediaType, ImagePickerResponse} from 'react-native-image-picker';

const PhotoHeader = ({ onCreateAlbum, viewMode, onViewModeChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [albumLocation, setAlbumLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageUpload = async () => {
    try {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        selectionLimit: 0, // 0 means no limit for multiple selection
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          if (response.errorMessage) {
            console.error("Erreur lors de l'upload d'images:", response.errorMessage);
            Alert.alert("Erreur", "Impossible d'uploader les images");
          }
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const uploadedImages = response.assets.map((asset) => ({
            id: Date.now() + Math.random().toString(),
            src: asset.uri,
          }));
          
          setSelectedImages(prev => [...prev, ...uploadedImages]);
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'upload d'images:", error);
      Alert.alert("Erreur", "Impossible d'uploader les images");
    }
  };

  const handleCreateAlbum = () => {
    if (!albumName.trim()) {
      Alert.alert("Erreur", "Le nom de l'album est requis");
      return;
    }

    const albumData = {
      name: albumName,
      description: albumDescription,
      location: albumLocation,
      isPublic: isPublic,
      images: selectedImages
    };

    console.log('Album créé:', albumData);
    
    if (onCreateAlbum) {
      onCreateAlbum(albumData);
    }

    // Réinitialiser et fermer le modal
    setAlbumName('');
    setAlbumDescription('');
    setAlbumLocation('');
    setIsPublic(true);
    setSelectedImages([]);
    setShowModal(false);
  };

  const handleCancel = () => {
    setAlbumName('');
    setAlbumDescription('');
    setAlbumLocation('');
    setIsPublic(true);
    setSelectedImages([]);
    setShowModal(false);
  };

  return (
    <View style={styles.header}>
      {/* View Mode Buttons */}
      <View style={styles.viewModeGroup}>
        <TouchableOpacity
          style={[styles.button, viewMode === 'small' && styles.activeButton]}
          onPress={() => onViewModeChange('small')}
        >
          <Ionicons name="grid" size={20} color={viewMode === 'small' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, viewMode === 'large' && styles.activeButton]}
          onPress={() => onViewModeChange('large')}
        >
          <Ionicons name="grid-outline" size={20} color={viewMode === 'large' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal New Album */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Album</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Album name *</Text>
                <TextInput
                  style={styles.input}
                  value={albumName}
                  onChangeText={setAlbumName}
                  placeholder="Enter album name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Album privacy</Text>
                <View style={styles.privacyContainer}>
                  <Text style={styles.privacyText}>Public</Text>
                  <Switch
                    value={isPublic}
                    onValueChange={setIsPublic}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isPublic ? '#f5dd4b' : '#f4f3f4'}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={albumLocation}
                  onChangeText={setAlbumLocation}
                  placeholder="Enter location"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Album description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={albumDescription}
                  onChangeText={setAlbumDescription}
                  placeholder="Enter description"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.formGroup}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                  <Ionicons name="cloud-upload-outline" size={24} color="#007AFF" />
                  <Text style={styles.uploadButtonText}>Upload photos to album</Text>
                </TouchableOpacity>
                {selectedImages.length > 0 && (
                  <Text style={styles.imageCount}>{selectedImages.length} image(s) sélectionnée(s)</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleCreateAlbum}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  viewModeGroup: {
    flexDirection: 'row',
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: '#e0e0e0',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  privacyText: {
    fontSize: 16,
    color: '#333',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  imageCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  createButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PhotoHeader;
