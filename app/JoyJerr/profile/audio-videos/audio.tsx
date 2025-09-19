
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import AudioVideoHeader from './AudioVideoHeader';
import Sound from 'react-native-sound';

const audios = [
  {
    id: '1',
    title: 'Mon premier podcast',
    duration: '15:32',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/284c0aea8b4ea1a8d0f658a8ed60858a_m_s.jpg',
    audioUrl: 'https://example.com/audio1.mp3',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Session de musique live',
    duration: '8:45',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0e9f3432fdd31a0975144d56b54a8cde_m_s.jpg',
    audioUrl: 'https://example.com/audio2.mp3',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Interview exclusive',
    duration: '23:18',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/510e5b7cb16ffc7071a82dbe80ba6d38_m_s.jpg',
    audioUrl: 'https://example.com/audio3.mp3',
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    title: 'Méditation guidée',
    duration: '12:00',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/0fb4676bf750d611333b1f66b2557daf_m_s.jpg',
    audioUrl: 'https://example.com/audio4.mp3',
    createdAt: '2024-01-01',
  },
  {
    id: '5',
    title: 'Cours de guitare',
    duration: '18:25',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/003b50171bee4bf917a8834484f519e0_m_s.jpg',
    audioUrl: 'https://example.com/audio5.mp3',
    createdAt: '2023-12-28',
  },
  {
    id: '6',
    title: 'Histoire du soir',
    duration: '6:33',
    thumbnail: 'https://demo.peepso.com/wp-content/peepso/users/2/photos/thumbs/f08f739f166b3002bc94cf896d2e82a5_m_s.jpg',
    audioUrl: 'https://example.com/audio6.mp3',
    createdAt: '2023-12-25',
  },
];

const AudioContent = () => {
  const [viewMode, setViewMode] = useState('small'); // small (3 colonnes) ou large (2 colonnes)
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  // Enable playback in silent mode
  useEffect(() => {
    Sound.setCategory('Playback');
    
    // Cleanup function
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const handlePress = (audio) => {
    // If we're already playing this audio
    if (currentAudio && currentAudio.id === audio.id) {
      if (isPlaying) {
        // Pause the current audio
        sound.pause();
        setIsPlaying(false);
      } else {
        // Resume the current audio
        sound.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
          setCurrentAudio(null);
        });
        setIsPlaying(true);
      }
    } else {
      // Stop previous sound if exists
      if (sound) {
        sound.stop();
        sound.release();
      }
      
      // Load and play the new audio
      const newSound = new Sound(audio.audioUrl, null, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        
        // Play the sound
        newSound.play((success) => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
          setCurrentAudio(null);
        });
      });
      
      setSound(newSound);
      setCurrentAudio(audio);
      setIsPlaying(true);
    }
  };

  const handleCreateAlbum = (albumData) => {
    if (albumData && albumData.images && albumData.images.length > 0) {
      console.log('Nouvel album audio créé:', albumData);
      // Ici vous pouvez ajouter le nouvel album à votre état ou l'envoyer au serveur
    } else {
      console.log('Create audio album pressed');
      // Here you can implement album creation
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
  };

  // Trier les audios selon l'ordre sélectionné
  const sortedAudios = [...audios].sort((a, b) => {
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

  const renderAudio = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.audioContainer, 
        viewMode === 'large' ? styles.audioContainerLarge : styles.audioContainerSmall
      ]} 
      onPress={() => handlePress(item)}
    >
      <Image 
        source={{ uri: item.thumbnail }} 
        style={[
          styles.audioThumbnail,
          viewMode === 'large' ? styles.audioThumbnailLarge : styles.audioThumbnailSmall
        ]} 
      />
      <View style={styles.playOverlay}>
        <Ionicons 
          name={currentAudio && currentAudio.id === item.id && isPlaying ? "pause-circle" : "play-circle"} 
          size={40} 
          color="rgba(255,255,255,0.9)" 
        />
      </View>
      <View style={styles.audioInfo}>
        <Text style={styles.audioTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.audioDuration}>{item.duration}</Text>
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
        data={sortedAudios}
        renderItem={renderAudio}
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
  audioContainer: {
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
  audioContainerSmall: {
    aspectRatio: 0.8,
  },
  audioContainerLarge: {
    aspectRatio: 0.9,
  },
  audioThumbnail: {
    width: '100%',
    flex: 1,
  },
  audioThumbnailSmall: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  audioThumbnailLarge: {
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
  audioInfo: {
    padding: 8,
    backgroundColor: '#fff',
  },
  audioTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 10,
    color: '#666',
  },
});

export default AudioContent;
