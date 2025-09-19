
import React, { useState } from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons'; // For search-plus icon
import PhotoHeader from './PhotoHeader';

const photos = [
  { id: '482', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/284c0aea8b4ea1a8d0f658a8ed60858a_m_s.jpg' },
  { id: '472', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0e9f3432fdd31a0975144d56b54a8cde_m_s.jpg' },
  { id: '473', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/510e5b7cb16ffc7071a82dbe80ba6d38_m_s.jpg' },
  { id: '474', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0fb4676bf750d611333b1f66b2557daf_m_s.jpg' },
  { id: '475', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/003b50171bee4bf917a8834484f519e0_m_s.jpg' },
  { id: '476', src: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/f08f739f166b3002bc94cf896d2e82a5_m_s.jpg' },
];

const PhotosContent = () => {
  const [viewMode, setViewMode] = useState('small'); // small (3 colonnes) ou large (2 colonnes)

  const handlePress = (photoId) => {
    console.log('Open photo comments for:', photoId);
    // Here you can implement ps_comments.open equivalent
  };

  const handleCreateAlbum = (newImages) => {
    if (newImages && newImages.length > 0) {
      console.log('Nouvelles images ajoutées:', newImages);
      // Ici vous pouvez ajouter les nouvelles images à votre état ou les envoyer au serveur
      // Par exemple, vous pourriez les ajouter au tableau photos existant
      // setPhotos(prev => [...prev, ...newImages]);
    } else {
      console.log('Create album pressed');
      // Here you can implement album creation
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.photoContainer} onPress={() => handlePress(item.id)}>
      <Image source={{ uri: item.src }} style={styles.photo} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <PhotoHeader 
        onCreateAlbum={handleCreateAlbum} 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'small' ? 3 : 2} // 3 colonnes en mode small, 2 en mode large
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        key={viewMode} // Force re-render when numColumns changes
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  photoContainer: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});

export default PhotosContent;
