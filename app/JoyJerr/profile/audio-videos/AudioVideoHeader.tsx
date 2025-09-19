import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Text,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";

const AudioVideoHeader = ({ onCreateAlbum, viewMode, onViewModeChange, sortOrder, onSortOrderChange }) => {
  const [showSortModal, setShowSortModal] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumLocation, setAlbumLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);

  const sortOptions = [
    { value: "desc", label: "Plus récents", icon: "arrow-down" },
    { value: "asc", label: "Plus anciens", icon: "arrow-up" },
    { value: "title", label: "Par titre", icon: "text" },
    { value: "duration", label: "Par durée", icon: "time" },
  ];

  const handleImageUpload = async () => {
    try {
      // Demander la permission d'accès à la galerie
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie requise pour sélectionner des images.",
        );
        return;
      }

      // Lancer le sélecteur d'images avec sélection multiple
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uploadedImages = result.assets.map((asset) => ({
          id: Date.now() + Math.random().toString(),
          src: asset.uri,
        }));

        setSelectedImages((prev) => [...prev, ...uploadedImages]);
      }
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
      images: selectedImages,
    };

    console.log("Album créé:", albumData);

    if (onCreateAlbum) {
      onCreateAlbum(albumData);
    }

    // Réinitialiser et fermer le modal
    setAlbumName("");
    setAlbumDescription("");
    setAlbumLocation("");
    setIsPublic(true);
    setSelectedImages([]);
    setShowModal(false);
  };

  const handleCancel = () => {
    setAlbumName("");
    setAlbumDescription("");
    setAlbumLocation("");
    setIsPublic(true);
    setSelectedImages([]);
    setShowModal(false);
  };

  return (
    <View style={styles.header}>
      {/* View Mode Buttons */}
      <View style={styles.viewModeGroup}>
        <TouchableOpacity
          style={[styles.button, viewMode === "small" && styles.activeButton]}
          onPress={() => onViewModeChange("small")}
        >
          <Ionicons
            name="grid"
            size={20}
            color={viewMode === "small" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, viewMode === "large" && styles.activeButton]}
          onPress={() => onViewModeChange("large")}
        >
          <Ionicons
            name="grid-outline"
            size={20}
            color={viewMode === "large" ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {/* Sort Dropdown */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Text style={styles.sortButtonText}>
            {sortOptions.find(option => option.value === sortOrder)?.label || "Trier"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal Sort Options */}
      <Modal
        visible={showSortModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sortModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Trier par</Text>
              <TouchableOpacity
                onPress={() => setShowSortModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.sortOptionsContainer}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    sortOrder === option.value && styles.sortOptionSelected,
                  ]}
                  onPress={() => {
                    onSortOrderChange(option.value);
                    setShowSortModal(false);
                  }}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={sortOrder === option.value ? "#007AFF" : "#666"}
                  />
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortOrder === option.value && styles.sortOptionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortOrder === option.value && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  viewModeGroup: {
    flexDirection: "row",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: "#e0e0e0",
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#d0d0d0",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#333",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  sortModalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
    maxHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  privacyText: {
    fontSize: 16,
    color: "#333",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#f8f9fa",
  },
  uploadButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 8,
    fontWeight: "500",
  },
  imageCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  createButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sortOptionsContainer: {
    padding: 10,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginVertical: 2,
  },
  sortOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  sortOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  sortOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default AudioVideoHeader;
