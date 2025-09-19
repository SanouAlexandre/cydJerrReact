
import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import PhotoHeader from './PhotoHeader';

const albums = [
  {
    id: '54',
    title: 'Stream Photos',
    photosCount: 18,
    image: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/a6fd8ab4ae020de8d6f859008fc6664c_m_s.jpg',
    privacy: 'public',
    url: 'https://demo.peepso.com/profile/?demo/photos/album/54',
  },
  {
    id: '53',
    title: 'Profile Covers',
    photosCount: 2,
    image: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/b8a7afec48d7a6a54c4faf8d09683212_m_s.jpg',
    privacy: 'public',
    url: 'https://demo.peepso.com/profile/?demo/photos/album/53',
  },
  {
    id: '52',
    title: 'Profile Avatars',
    photosCount: 2,
    image: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/cbb131718cb578a3c3db017d9c3805f0_m_s.jpg',
    privacy: 'public',
    url: 'https://demo.peepso.com/profile/?demo/photos/album/52',
  },
  {
    id: '151',
    title: 'Our Travels',
    photosCount: 11,
    image: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/aac6510ba1a22e163b51d232c5583892_m_s.jpg',
    privacy: 'public',
    url: 'https://demo.peepso.com/profile/?demo/photos/album/151',
  },
];

const AlbumsContent = () => {
  const [viewMode, setViewMode] = useState('small'); // small (3 colonnes) ou large (2 colonnes)

  const handleCreateAlbum = (albumData) => {
    if (albumData && albumData.images && albumData.images.length > 0) {
      console.log('Nouvel album créé:', albumData);
      // Ici vous pouvez ajouter le nouvel album à votre état ou l'envoyer au serveur
    } else {
      console.log('Create album pressed');
      // Here you can implement album creation
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleAlbumPress = (album) => {
    console.log('Open Album', album.url);
    // Ici vous pouvez naviguer vers l'album ou ouvrir un modal
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.albumContainer, 
        viewMode === 'large' ? styles.albumContainerLarge : styles.albumContainerSmall
      ]} 
      onPress={() => handleAlbumPress(item)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={[
          styles.albumImage,
          viewMode === 'large' ? styles.albumImageLarge : styles.albumImageSmall
        ]} 
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.details}>{item.photosCount} photos</Text>
        <Ionicons
          name={item.privacy === 'public' ? 'globe-outline' : 'lock-closed-outline'}
          size={16}
          color="#fff"
          style={styles.privacyIcon}
        />
      </View>
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
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'small' ? 3 : 2} // 3 colonnes en mode small, 2 en mode large
        contentContainerStyle={styles.listContainer}
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
  listContainer: {
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  albumContainer: {
    flex: 1,
    margin: 5,
    position: 'relative',
  },
  albumContainerSmall: {
    aspectRatio: 1,
  },
  albumContainerLarge: {
    aspectRatio: 0.8,
  },
  albumImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  albumImageSmall: {
    borderRadius: 8,
  },
  albumImageLarge: {
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  details: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
  },
  privacyIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default AlbumsContent;
