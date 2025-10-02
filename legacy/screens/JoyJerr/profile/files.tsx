
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FilesHeader = ({ viewMode, onViewModeChange, sortOrder, onSortOrderChange }) => {
  const [showSortModal, setShowSortModal] = useState(false);

  const sortOptions = [
    { value: "desc", label: "Plus récents", icon: "arrow-down" },
    { value: "asc", label: "Plus anciens", icon: "arrow-up" },
    { value: "name", label: "Par nom", icon: "text" },
    { value: "size", label: "Par taille", icon: "resize" },
    { value: "type", label: "Par type", icon: "document" },
  ];

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

const FilesContent = () => {
  const [viewMode, setViewMode] = useState('small');
  const [sortOrder, setSortOrder] = useState('desc');

  const files = [
    {
      id: '1',
      name: 'Rapport_Mensuel.pdf',
      type: 'PDF',
      size: '2.5 MB',
      createdAt: '2024-01-15',
      icon: 'document-text',
      color: '#FF6B6B',
      url: 'https://example.com/document1.pdf',
    },
    {
      id: '2',
      name: 'Presentation_Projet.pptx',
      type: 'PowerPoint',
      size: '8.3 MB',
      createdAt: '2024-01-12',
      icon: 'easel',
      color: '#4ECDC4',
      url: 'https://example.com/presentation.pptx',
    },
    {
      id: '3',
      name: 'Budget_2024.xlsx',
      type: 'Excel',
      size: '1.2 MB',
      createdAt: '2024-01-10',
      icon: 'grid',
      color: '#45B7D1',
      url: 'https://example.com/budget.xlsx',
    },
    {
      id: '4',
      name: 'Contrat_Service.docx',
      type: 'Word',
      size: '456 KB',
      createdAt: '2024-01-08',
      icon: 'document',
      color: '#96CEB4',
      url: 'https://example.com/contract.docx',
    },
    {
      id: '5',
      name: 'Images_Produits.zip',
      type: 'Archive',
      size: '15.7 MB',
      createdAt: '2024-01-05',
      icon: 'archive',
      color: '#FECA57',
      url: 'https://example.com/images.zip',
    },
    {
      id: '6',
      name: 'Video_Demo.mp4',
      type: 'Vidéo',
      size: '45.2 MB',
      createdAt: '2024-01-03',
      icon: 'videocam',
      color: '#FF9FF3',
      url: 'https://example.com/demo.mp4',
    },
    {
      id: '7',
      name: 'Audio_Reunion.mp3',
      type: 'Audio',
      size: '12.8 MB',
      createdAt: '2024-01-01',
      icon: 'musical-notes',
      color: '#54A0FF',
      url: 'https://example.com/audio.mp3',
    },
    {
      id: '8',
      name: 'Code_Source.zip',
      type: 'Archive',
      size: '3.4 MB',
      createdAt: '2023-12-28',
      icon: 'code-slash',
      color: '#5F27CD',
      url: 'https://example.com/code.zip',
    },
  ];

  const handleFilePress = (file) => {
    console.log('Ouvrir le fichier:', file.name);
    // Ici vous pouvez implémenter l'ouverture du fichier
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  // Trier les fichiers selon l'ordre sélectionné
  const sortedFiles = [...files].sort((a, b) => {
    switch (sortOrder) {
      case 'desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        const getSizeInBytes = (size) => {
          const [value, unit] = size.split(' ');
          const multiplier = unit === 'MB' ? 1024 * 1024 : unit === 'KB' ? 1024 : 1;
          return parseFloat(value) * multiplier;
        };
        return getSizeInBytes(a.size) - getSizeInBytes(b.size);
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const renderFile = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.fileContainer, 
        viewMode === 'large' ? styles.fileContainerLarge : styles.fileContainerSmall
      ]} 
      onPress={() => handleFilePress(item)}
    >
      <View 
        style={[
          styles.fileIcon,
          viewMode === 'large' ? styles.fileIconLarge : styles.fileIconSmall,
          { backgroundColor: item.color }
        ]}
      >
        <Ionicons 
          name={item.icon} 
          size={viewMode === 'large' ? 40 : 30} 
          color="#fff" 
        />
      </View>
      <View style={styles.fileInfo}>
        <Text 
          style={[
            styles.fileName,
            viewMode === 'large' ? styles.fileNameLarge : styles.fileNameSmall
          ]} 
          numberOfLines={viewMode === 'large' ? 2 : 1}
        >
          {item.name}
        </Text>
        <Text style={styles.fileType}>{item.type}</Text>
        <Text style={styles.fileSize}>{item.size}</Text>
        <Text style={styles.fileDate}>{new Date(item.createdAt).toLocaleDateString('fr-FR')}</Text>
      </View>
      <View style={styles.fileActions}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <FilesHeader 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />
      <FlatList
        data={sortedFiles}
        renderItem={renderFile}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'small' ? 1 : 1} // Mode liste pour les fichiers
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        key={viewMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  listContainer: {
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  fileContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fileContainerSmall: {
    minHeight: 70,
  },
  fileContainerLarge: {
    minHeight: 90,
  },
  fileIcon: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIconSmall: {
    width: 50,
    height: 50,
  },
  fileIconLarge: {
    width: 70,
    height: 70,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  fileNameSmall: {
    fontSize: 14,
  },
  fileNameLarge: {
    fontSize: 16,
  },
  fileType: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 10,
    color: '#999',
  },
  fileActions: {
    padding: 8,
  },
});

export default FilesContent;
