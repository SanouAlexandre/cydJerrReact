import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/userSlice';
import { 
  useChabJerrFeed, 
  useChabJerrTrending, 
  useChabJerrVideos, 
  useChabJerrShorts, 
  useChabJerrRecent,
  useChabJerrSearch,
  useChabJerrLikePost,
  useChabJerrSharePost,
  useChabJerrLives,
  useStartLive,
  useStopLive,
  useJoinLive,
  useLeaveLive,
  useInitiateCall,
  useAnswerCall,
  useEndCall,
  useUpdateCallMedia,
  useActiveCall,
  useUploadVideo,
  useCreateVideoPost,
  useUpdateVideoPost,
  useDeleteVideoPost,
  useIncrementVideoViews,
  useCreateLive,
  useUpdateLive,
  useLiveDetails,
  useLiveParticipants
} from '../hooks/useApi';
import { moderateScale, verticalScale, scale } from 'react-native-size-matters';
import { colors, fontSizes, spacing, borderRadius, shadows } from '../styles/globalStyles';
import { glass } from '../utils/glass';
import { gradients } from '../utils/gradients';

const { width, height } = Dimensions.get('window');

const ChabJerrScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  
  // États locaux - doivent être déclarés avant les hooks React Query
  const [activeTab, setActiveTab] = useState('Accueil');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchText, setSearchText] = useState('');
  const [fabOpen, setFabOpen] = useState(false);
  
  const fabAnimation = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Hooks React Query pour les différents types de contenu
  const feedQuery = useChabJerrFeed({ page: 1, limit: 20 });
  const trendingQuery = useChabJerrTrending({ page: 1, limit: 20 });
  const videosQuery = useChabJerrVideos({ page: 1, limit: 20 });
  const shortsQuery = useChabJerrShorts({ page: 1, limit: 20 });
  const recentQuery = useChabJerrRecent({ page: 1, limit: 20 });
  const searchQuery = useChabJerrSearch(searchText, { page: 1, limit: 20 });
  const livesQuery = useChabJerrLives({ page: 1, limit: 20 });
  
  // Hooks pour les appels et lives
  const activeCallQuery = useActiveCall();
  
  // Mutations pour les interactions
  const likePostMutation = useChabJerrLikePost();
  const sharePostMutation = useChabJerrSharePost();
  const startLiveMutation = useStartLive();
  const stopLiveMutation = useStopLive();
  const joinLiveMutation = useJoinLive();
  const leaveLiveMutation = useLeaveLive();
  const initiateCallMutation = useInitiateCall();
  const answerCallMutation = useAnswerCall();
  const endCallMutation = useEndCall();
  const updateCallMediaMutation = useUpdateCallMedia();
  
  // Nouveaux hooks pour les vidéos
  const uploadVideoMutation = useUploadVideo();
  const createVideoPostMutation = useCreateVideoPost();
  const updateVideoPostMutation = useUpdateVideoPost();
  const deleteVideoPostMutation = useDeleteVideoPost();
  const incrementVideoViewsMutation = useIncrementVideoViews();
  
  // Nouveaux hooks pour les lives améliorés
  const createLiveMutation = useCreateLive();
  const updateLiveMutation = useUpdateLive();
  
  // Sélection des données selon l'onglet actif
  const getCurrentQuery = () => {
    switch (activeTab) {
      case 'Tendances':
        return trendingQuery;
      case 'Shorts':
        return shortsQuery;
      case 'Lives':
        return livesQuery;
      case 'Abonnements':
        return recentQuery;
      default:
        return searchText.length > 2 ? searchQuery : feedQuery;
    }
  };
  
  const currentQuery = getCurrentQuery();
  const { data: postsResponse, isLoading, isError, error, refetch } = currentQuery;
  
  // Extraction des posts depuis la réponse API
  const posts = postsResponse?.data || [];
  
  const tabs = ['Accueil', 'Tendances', 'Shorts', 'Lives', 'Abonnements'];
  const filters = ['Tous', 'Musique', 'Gaming', 'Sport', 'Tech', 'Lifestyle'];
  
  // Animation du FAB
  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    setFabOpen(!fabOpen);
    Animated.spring(fabAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };
  
  // Fonctions d'interaction avec les posts
  const handleLikePost = (postId) => {
    likePostMutation.mutate(postId, {
      onSuccess: () => {
        // Le cache sera automatiquement invalidé par le hook
      },
      onError: (error) => {
        console.error('Erreur lors du like:', error);
      }
    });
  };
  
  const handleSharePost = (postId, platform = 'native') => {
    sharePostMutation.mutate({ postId, platform }, {
      onSuccess: () => {
        console.log('Post partagé avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors du partage:', error);
      }
    });
  };

  const handleVideoPlay = (videoId) => {
    incrementVideoViewsMutation.mutate(videoId);
    navigation.navigate('VideoPlayer', { videoId });
  };

  const handleDeleteVideo = (videoId) => {
    deleteVideoPostMutation.mutate(videoId);
  };

  const handleEditVideo = (video) => {
    navigation.navigate('VideoEdit', { video });
  };
  
  // Fonction pour formater les données des posts pour l'affichage
  const formatPostForDisplay = (post) => {
    return {
      id: post._id || post.id,
      title: post.content || 'Sans titre',
      creator: post.author?.username || post.author?.name || 'Utilisateur inconnu',
      avatar: sanitizeImageUri(post.author?.avatar || post.author?.profilePicture || 'https://via.placeholder.com/40'),
      thumbnail: sanitizeImageUri(post.media?.[0]?.url || post.media?.[0]?.thumbnail || 'https://via.placeholder.com/300x200'),
      duration: post.media?.[0]?.duration ? formatDuration(post.media[0].duration) : '0:00',
      views: formatNumber(post.stats?.views || 0),
      likes: formatNumber(post.stats?.likes || 0),
      timeAgo: formatTimeAgo(post.createdAt || post.publishedAt),
      price: calculateJerrPrice(post.stats?.views || 0, post.stats?.likes || 0),
      hasVideo: post.media?.some(m => m.type === 'video') || false,
      isShort: post.media?.some(m => m.type === 'video' && m.duration && m.duration < 60) || false,
      engagementRate: post.engagementRate || 0,
      commentsCount: post.stats?.comments || 0,
      sharesCount: post.stats?.shares || 0,
      isLiked: post.likes?.includes(user?.id) || false,
    };
  };

  // Ensure RN Image gets a string `uri`. Accept objects with `url` or nested `uri`.
  const sanitizeImageUri = (input) => {
    if (!input) return undefined;
    if (typeof input === 'string') return input;
    // Common shapes: { url }, { uri }, { data: { url } }
    if (input.url && typeof input.url === 'string') return input.url;
    if (input.uri && typeof input.uri === 'string') return input.uri;
    if (input.data && typeof input.data.url === 'string') return input.data.url;
    // Unexpected shapes: return undefined so RN uses fallback if provided
    return undefined;
  };
  
  // Fonctions utilitaires pour le formatage
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'maintenant';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}j`;
    }
  };
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const calculateJerrPrice = (views, likes) => {
    const basePrice = Math.floor((views * 0.01) + (likes * 0.1));
    return Math.max(basePrice, 10); // Prix minimum de 10 Jerr
  };

  // Fonctions pour gérer les lives
  const handleStartLive = (liveData) => {
    startLiveMutation.mutate(liveData, {
      onSuccess: (response) => {
        console.log('Live démarré avec succès:', response);
        // Naviguer vers l'écran de live ou afficher une notification
      },
      onError: (error) => {
        console.error('Erreur lors du démarrage du live:', error);
      }
    });
  };

  const handleStopLive = (liveId) => {
    stopLiveMutation.mutate(liveId, {
      onSuccess: () => {
        console.log('Live arrêté avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de l\'arrêt du live:', error);
      }
    });
  };

  const handleJoinLive = (liveId) => {
    joinLiveMutation.mutate(liveId, {
      onSuccess: () => {
        console.log('Rejoint le live avec succès');
        // Naviguer vers l'écran de visualisation du live
      },
      onError: (error) => {
        console.error('Erreur lors de la connexion au live:', error);
      }
    });
  };

  const handleLeaveLive = (liveId) => {
    leaveLiveMutation.mutate(liveId, {
      onSuccess: () => {
        console.log('Quitté le live avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de la déconnexion du live:', error);
      }
    });
  };

  // Fonction pour démarrer rapidement un live
  const handleQuickStartLive = () => {
    const liveData = {
      title: `Live de ${user?.username || 'Utilisateur'}`,
      description: 'Live démarré rapidement depuis ChabJerr',
      isPublic: true,
      category: 'general',
      metadata: {
        platform: Platform.OS,
        userAgent: 'ChabJerr Mobile App'
      }
    };
    
    createLiveMutation.mutate(liveData, {
      onSuccess: (response) => {
        console.log('Live créé avec succès:', response.data);
        // Ici on pourrait naviguer vers l'écran de live
      },
      onError: (error) => {
        console.error('Erreur lors de la création du live:', error);
      }
    });
    setFabOpen(false); // Fermer le menu FAB après le clic
  };
  
  // Fonction pour gérer l'upload de vidéo
  const handleVideoUpload = () => {
    setFabOpen(false);
    navigation.navigate('VideoUpload');
  };
  
  // Fonction pour incrémenter les vues d'une vidéo
  const handleVideoView = (postId) => {
    incrementVideoViewsMutation.mutate(postId);
  };

  // Fonctions pour gérer les appels
  const handleInitiateCall = (callData) => {
    initiateCallMutation.mutate(callData, {
      onSuccess: (response) => {
        console.log('Appel initié avec succès:', response);
        // Naviguer vers l'écran d'appel
      },
      onError: (error) => {
        console.error('Erreur lors de l\'initiation de l\'appel:', error);
      }
    });
  };

  const handleAnswerCall = (callId, mediaStatus) => {
    answerCallMutation.mutate({ callId, mediaStatus }, {
      onSuccess: () => {
        console.log('Appel accepté avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de l\'acceptation de l\'appel:', error);
      }
    });
  };

  const handleEndCall = (callId, reason = 'normal') => {
    endCallMutation.mutate({ callId, reason }, {
      onSuccess: () => {
        console.log('Appel terminé avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de la fin de l\'appel:', error);
      }
    });
  };

  const handleUpdateCallMedia = (callId, audio, video) => {
    updateCallMediaMutation.mutate({ callId, audio, video }, {
      onSuccess: () => {
        console.log('Statut média mis à jour avec succès');
      },
      onError: (error) => {
        console.error('Erreur lors de la mise à jour du statut média:', error);
      }
    });
  };

  // Fonction pour démarrer un live rapide
  const handleQuickLive = () => {
    const liveData = {
      title: `Live de ${user?.firstName || 'Utilisateur'}`,
      description: 'Live en direct depuis ChabJerr',
      type: 'live',
      privacy: 'public'
    };
    handleStartLive(liveData);
    setFabOpen(false);
  };



  // Fonction pour démarrer un appel vidéo
  const handleQuickVideoCall = () => {
    // Ici, on pourrait ouvrir un modal pour sélectionner le destinataire
    // Pour l'instant, on simule un appel de groupe
    const callData = {
      callType: 'video',
      metadata: {
        platform: Platform.OS,
        userAgent: 'ChabJerr Mobile App'
      }
    };
    handleInitiateCall(callData);
    setFabOpen(false);
  };
  
  // Transformation des posts pour l'affichage
  const videoFeed = Array.isArray(posts) ? posts.map(formatPostForDisplay) : [];
  
  const renderHeader = () => (
    <LinearGradient
      colors={['rgba(15, 28, 63, 0.98)', 'rgba(15, 28, 63, 0.85)']}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={scale(24)} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <Feather name="search" size={scale(18)} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher sur ChabJerr..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="video-call" size={scale(24)} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={scale(24)} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="chatbubble-outline" size={scale(24)} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image 
              source={{ uri: sanitizeImageUri(user?.avatar) || 'https://via.placeholder.com/32' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
  
  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  const renderVideoCard = (video) => (
    <View key={video.id} style={styles.videoCard}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: sanitizeImageUri(video.thumbnail) || 'https://via.placeholder.com/300x200' }} style={styles.thumbnail} />
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{video.duration}</Text>
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.thumbnailOverlay}
        />
      </View>
      
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <Image source={{ uri: sanitizeImageUri(video.avatar) || 'https://via.placeholder.com/40' }} style={styles.creatorAvatar} />
          <View style={styles.videoMeta}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {video.title}
            </Text>
            <Text style={styles.creatorName}>{video.creator}</Text>
            <View style={styles.videoStats}>
              <Text style={styles.statsText}>{video.views} vues</Text>
              <Text style={styles.statsText}>•</Text>
              <Text style={styles.statsText}>{video.timeAgo}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={scale(20)} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoActions}>
          <View style={styles.priceContainer}>
            <Ionicons name="diamond" size={scale(16)} color="#FFD700" />
            <Text style={styles.priceText}>{video.price} Jerr</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikePost(video.id)}
            >
              <Ionicons name={video.isLiked ? "heart" : "heart-outline"} size={scale(20)} color={video.isLiked ? colors.error : colors.textSecondary} />
              <Text style={styles.actionText}>{video.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Comments', { postId: video.id })}
            >
              <Ionicons name="chatbubble-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{video.commentsCount || 'Commenter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSharePost(video.id)}
            >
              <Ionicons name="share-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{video.sharesCount || 'Partager'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleVideoPlay(video.id)}
            >
              <Ionicons name="play-circle-outline" size={scale(20)} color={colors.primary} />
              <Text style={styles.actionText}>Lire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderLiveCard = (live) => (
    <View key={live.id} style={[styles.videoCard, styles.liveCard]}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={{ uri: sanitizeImageUri(live.thumbnail) || 'https://via.placeholder.com/640x360?text=No+Image' }} 
          style={styles.thumbnail} 
        />
        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={styles.viewersBadge}>
          <Ionicons name="eye" size={scale(12)} color={colors.white} />
          <Text style={styles.viewersText}>{live.viewers}</Text>
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.thumbnailOverlay}
        />
      </View>
      
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <Image 
            source={{ uri: sanitizeImageUri(live.avatar) || 'https://via.placeholder.com/36' }} 
            style={styles.creatorAvatar} 
          />
          <View style={styles.videoMeta}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {live.title}
            </Text>
            <Text style={styles.creatorName}>{live.creator}</Text>
            <View style={styles.videoStats}>
              <Text style={styles.statsText}>En direct depuis {live.duration}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.joinLiveButton}
            onPress={() => handleJoinLive(live.id)}
          >
            <Text style={styles.joinLiveText}>Rejoindre</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoActions}>
          <View style={styles.priceContainer}>
            <Ionicons name="diamond" size={scale(16)} color="#FFD700" />
            <Text style={styles.priceText}>{live.price} Jerr</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikePost(live.id)}
            >
              <Ionicons name={live.isLiked ? "heart" : "heart-outline"} size={scale(20)} color={live.isLiked ? colors.error : colors.textSecondary} />
              <Text style={styles.actionText}>{live.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Comments', { postId: live.id })}
            >
              <Ionicons name="chatbubble-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{live.commentsCount || 'Chat'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSharePost(live.id)}
            >
              <Ionicons name="share-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{live.sharesCount || 'Partager'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLeaveLive(live.id)}
            >
              <Ionicons name="exit-outline" size={scale(20)} color={colors.error} />
              <Text style={styles.actionText}>Quitter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // State for audio playback
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  
  // Initialize Sound
  useEffect(() => {
    // Import Sound only if it's not already imported at the top
    const Sound = require('react-native-sound');
    // Enable playback in silent mode
    Sound.setCategory('Playback');
    
    // Cleanup function
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);
  
  // Handle audio playback
  const handleAudioPlay = (audio) => {
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
      const Sound = require('react-native-sound');
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
  
  const renderAudioCard = (audio) => (
    <View key={audio.id} style={[styles.videoCard, styles.audioCard]}>
      <View style={styles.audioThumbnailContainer}>
        <LinearGradient
          colors={['#FF6B35', '#E55A2B', '#D4491F']}
          style={styles.audioThumbnail}
        >
          <Ionicons name="musical-notes" size={scale(48)} color={colors.white} />
        </LinearGradient>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{audio.duration}</Text>
        </View>
      </View>
      
      <View style={styles.videoInfo}>
        <View style={styles.videoHeader}>
          <Image 
            source={{ uri: sanitizeImageUri(audio.avatar) || 'https://via.placeholder.com/36' }} 
            style={styles.creatorAvatar} 
          />
          <View style={styles.videoMeta}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {audio.title}
            </Text>
            <Text style={styles.creatorName}>{audio.creator}</Text>
            <View style={styles.videoStats}>
              <Text style={styles.statsText}>{audio.plays} écoutes</Text>
              <Text style={styles.statsText}>•</Text>
              <Text style={styles.statsText}>{audio.timeAgo}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => handleAudioPlay(audio)}
          >
            <Ionicons 
              name={currentAudio && currentAudio.id === audio.id && isPlaying ? "pause" : "play"} 
              size={scale(20)} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.videoActions}>
          <View style={styles.priceContainer}>
            <Ionicons name="diamond" size={scale(16)} color="#FFD700" />
            <Text style={styles.priceText}>{audio.price} Jerr</Text>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleLikePost(audio.id)}
            >
              <Ionicons name="heart-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{audio.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{audio.commentsCount || 'Commenter'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleSharePost(audio.id)}
            >
              <Ionicons name="share-outline" size={scale(20)} color={colors.textSecondary} />
              <Text style={styles.actionText}>{audio.sharesCount || 'Partager'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Ionicons name="refresh" size={scale(32)} color={colors.primary} />
          <Text style={styles.loadingText}>Chargement des vidéos...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={scale(48)} color={colors.error} />
          <Text style={styles.errorTitle}>Erreur de chargement</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'Impossible de charger les vidéos. Vérifiez votre connexion internet.'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Ionicons name="refresh" size={scale(20)} color={colors.white} />
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!videoFeed || videoFeed.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-off" size={scale(48)} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>Aucune vidéo disponible</Text>
          <Text style={styles.emptyMessage}>
            Il n'y a pas encore de contenu dans cette catégorie.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.feedContainer}>
        {videoFeed.map((item) => {
          if (activeTab === 'Lives') {
            return renderLiveCard(item);
          } else if (activeTab === 'Audio') {
            return renderAudioCard(item);
          } else {
            return renderVideoCard(item);
          }
        })}
      </View>
    );
  };
  
  const renderFAB = () => {
    const fabRotation = fabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg'],
    });
    
    const fabMenuScale = fabAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    return (
      <View style={styles.fabContainer}>
        {fabOpen && (
          <Animated.View 
            style={[
              styles.fabMenu,
              { transform: [{ scale: fabMenuScale }] }
            ]}
          >
            <TouchableOpacity 
              style={styles.fabMenuItem}
              onPress={handleVideoUpload}
            >
              <View style={styles.fabMenuButton}>
                <Ionicons name="videocam" size={scale(24)} color={colors.text} />
              </View>
              <Text style={styles.fabMenuText}>Vidéo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.fabMenuItem}
              onPress={handleQuickLive}
            >
              <View style={styles.fabMenuButton}>
                <Ionicons name="radio" size={scale(24)} color={colors.error} />
              </View>
              <Text style={styles.fabMenuText}>Live</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={toggleFab}
        >
          <LinearGradient
            colors={['#FF6B35', '#E55A2B']}
            style={styles.fabGradient}
          >
            <Animated.View style={{ transform: [{ rotate: fabRotation }] }}>
              <Ionicons name="add" size={scale(28)} color={colors.white} />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#0F1C3F" : "transparent"}
        translucent={Platform.OS === "android"}
      />
      
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.backgroundGradient}
      >
        {renderHeader()}
        {renderTabs()}
        {renderFilters()}
        
        <Animated.ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {renderContent()}
        </Animated.ScrollView>
        
        {renderFAB()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? verticalScale(10) : 0,
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    ...glass.header,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    ...glass.button,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
    ...glass.input,
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: colors.text,
    fontFamily: 'Poppins-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },
  avatarContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  tabsContainer: {
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsContent: {
    paddingHorizontal: scale(16),
    gap: scale(24),
  },
  tab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(4),
    position: 'relative',
  },
  activeTab: {
    // Style actif géré par l'indicateur
  },
  tabText: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.text,
    fontFamily: 'Poppins-SemiBold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  filtersContainer: {
    paddingVertical: verticalScale(12),
  },
  filtersContent: {
    paddingHorizontal: scale(16),
    gap: scale(8),
  },
  filterChip: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
    ...glass.button,
  },
  activeFilterChip: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    gap: verticalScale(12),
  },
  loadingText: {
    fontSize: moderateScale(16),
    color: colors.textSecondary,
    fontFamily: 'Poppins-Regular',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(32),
    gap: verticalScale(16),
  },
  errorTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.error,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    gap: scale(8),
    marginTop: verticalScale(8),
  },
  retryText: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
    paddingHorizontal: scale(32),
    gap: verticalScale(16),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  feedContainer: {
    paddingVertical: verticalScale(8),
  },
  videoCard: {
    marginHorizontal: scale(16),
    marginBottom: verticalScale(20),
    borderRadius: scale(16),
    overflow: 'hidden',
    ...glass.card,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16/9,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  durationBadge: {
    position: 'absolute',
    bottom: scale(8),
    right: scale(8),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(4),
  },
  durationText: {
    fontSize: moderateScale(10),
    color: colors.white,
    fontFamily: 'Poppins-Medium',
  },
  videoInfo: {
    padding: scale(12),
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  creatorAvatar: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    marginRight: scale(12),
  },
  videoMeta: {
    flex: 1,
  },
  videoTitle: {
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    color: colors.text,
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(4),
  },
  creatorName: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
    marginBottom: verticalScale(2),
  },
  videoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  statsText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Regular',
    color: colors.textTertiary,
  },
  menuButton: {
    padding: scale(4),
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  priceText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: '#FFD700',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(16),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  actionText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.textSecondary,
  },
  fabContainer: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: scale(20),
    alignItems: 'center',
  },
  fabMenu: {
    marginBottom: verticalScale(16),
    alignItems: 'center',
    gap: verticalScale(12),
  },
  fabMenuItem: {
    alignItems: 'center',
    gap: verticalScale(4),
  },
  fabMenuButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    ...glass.cardIntense,
  },
  fabMenuText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.text,
  },
  fab: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    overflow: 'hidden',
    ...shadows.large,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Styles pour les Lives
  liveCard: {
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  liveBadge: {
    position: 'absolute',
    top: scale(8),
    left: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(12),
    gap: scale(4),
  },
  liveIndicator: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: colors.white,
  },
  liveText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Bold',
    color: colors.white,
  },
  viewersBadge: {
    position: 'absolute',
    top: scale(8),
    right: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
    borderRadius: scale(10),
    gap: scale(2),
  },
  viewersText: {
    fontSize: moderateScale(10),
    fontFamily: 'Poppins-Medium',
    color: colors.white,
  },
  joinLiveButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(16),
  },
  joinLiveText: {
    fontSize: moderateScale(12),
    fontFamily: 'Poppins-SemiBold',
    color: colors.white,
  },
  // Styles pour l'Audio

});

export default ChabJerrScreen;
