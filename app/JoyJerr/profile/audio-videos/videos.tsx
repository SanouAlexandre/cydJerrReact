
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AudioVideoHeader from './AudioVideoHeader';

const videos = [
  {
    id: '1',
    title: 'Tutoriel React Native',
    duration: '25:45',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/284c0aea8b4ea1a8d0f658a8ed60858a_m_s.jpg',
    videoUrl: 'https://example.com/video1.mp4',
    views: 1250,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Voyage à Paris',
    duration: '12:30',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0e9f3432fdd31a0975144d56b54a8cde_m_s.jpg',
    videoUrl: 'https://example.com/video2.mp4',
    views: 850,
    createdAt: '2024-01-12',
  },
  {
    id: '3',
    title: 'Recette de cuisine',
    duration: '8:15',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/510e5b7cb16ffc7071a82dbe80ba6d38_m_s.jpg',
    videoUrl: 'https://example.com/video3.mp4',
    views: 2100,
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    title: 'Workout à la maison',
    duration: '30:00',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0fb4676bf750d611333b1f66b2557daf_m_s.jpg',
    videoUrl: 'https://example.com/video4.mp4',
    views: 3200,
    createdAt: '2024-01-08',
  },
  {
    id: '5',
    title: 'DIY Décoration',
    duration: '15:22',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/003b50171bee4bf917a8834484f519e0_m_s.jpg',
    videoUrl: 'https://example.com/video5.mp4',
    views: 890,
    createdAt: '2024-01-05',
  },
  {
    id: '6',
    title: 'Concert live',
    duration: '45:18',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/f08f739f166b3002bc94cf896d2e82a5_m_s.jpg',
    videoUrl: 'https://example.com/video6.mp4',
    views: 5600,
    createdAt: '2024-01-03',
  },
];

const VideosContent = () => {
  const [viewMode, setViewMode] = useState('small'); // small (3 colonnes) ou large (2 colonnes)
  const [sortOrder, setSortOrder] = useState('desc');

  const handlePress = (videoId) => {
    console.log('Play video:', videoId);
    // Ici vous pouvez implémenter la lecture vidéo
  };

  const handleCreateAlbum = (albumData) => {
    if (albumData && albumData.images && albumData.images.length > 0) {
      console.log('Nouvel album vidéo créé:', albumData);
      // Ici vous pouvez ajouter le nouvel album à votre état ou l'envoyer au serveur
    } else {
      console.log('Create video album pressed');
      // Here you can implement album creation
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  // Trier les vidéos selon l'ordre sélectionné
  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortOrder) {
      case 'desc':
        return new Date(b.createdAt) - new Date(a.createdAt); // Plus récents d'abord
      case 'asc':
        return new Date(a.createdAt) - new Date(b.createdAt); // Plus anciens d'abord
      case 'title':
        return a.title.localeCompare(b.title); // Par titre alphabétique
      case 'duration':
        // Convertir la durée en secondes pour la comparaison
        const durationToSeconds = (duration) => {
          const [minutes, seconds] = duration.split(':').map(Number);
          return minutes * 60 + seconds;
        };
        return durationToSeconds(a.duration) - durationToSeconds(b.duration); // Par durée croissante
      default:
        return 0;
    }
  });

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k vues`;
    }
    return `${views} vues`;
  };

  const renderVideo = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.videoContainer, 
        viewMode === 'large' ? styles.videoContainerLarge : styles.videoContainerSmall
      ]} 
      onPress={() => handlePress(item.id)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={[
          styles.videoThumbnail,
          viewMode === 'large' ? styles.videoThumbnailLarge : styles.videoThumbnailSmall
        ]} 
      />
      <View style={styles.playOverlay}>
        <Ionicons name="play-circle" size={50} color="rgba(255,255,255,0.9)" />
      </View>
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{item.duration}</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.videoViews}>{formatViews(item.views)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <AudioVideoHeader 
        onCreateAlbum={handleCreateAlbum} 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
      />
      <FlatList
        data={sortedVideos}
        renderItem={renderVideo}
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
  videoContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  videoContainerSmall: {
    aspectRatio: 0.8,
  },
  videoContainerLarge: {
    aspectRatio: 0.9,
  },
  videoThumbnail: {
    width: '100%',
    flex: 1,
  },
  videoThumbnailSmall: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  videoThumbnailLarge: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 70,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  videoInfo: {
    padding: 8,
    backgroundColor: '#fff',
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  videoViews: {
    fontSize: 10,
    color: '#666',
  },
});

export default VideosContent;
