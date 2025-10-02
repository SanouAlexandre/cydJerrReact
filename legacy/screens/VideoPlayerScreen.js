import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  ActivityIndicator,
  Share,
} from 'react-native';
import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from 'react-native-vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePost, useLikePost, usePostComments, useAddComment } from '../hooks/useApi';
import { sharePost } from '../utils/shareUtils';
import { formatTimeAgo } from '../utils/dateUtils';
import { colors } from '../styles/globalStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params;
  
  // React Query hooks
  const { data: post, isLoading: isLoadingPost } = usePost(postId);
  const { data: comments = [], isLoading: isLoadingComments, refetch: refetchComments } = usePostComments(postId);
  const likePostMutation = useLikePost();
  const addCommentMutation = useAddComment();
  
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  
  const video = useRef(null);
  const controlsTimeout = useRef(null);

  useEffect(() => {
    if (!isLoadingPost && !post) {
      Alert.alert('Erreur', 'Vidéo introuvable');
      navigation.goBack();
    }
  }, [post, navigation, isLoadingPost]);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControls) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [showControls]);

  const handlePlaybackStatusUpdate = (progress) => {
    // Convert react-native-video progress format to our status format
    const playbackStatus = {
      ...status,
      positionMillis: progress.currentTime * 1000,
      durationMillis: progress.seekableDuration * 1000,
      isBuffering: progress.buffering,
      isLoaded: true
    };
    setStatus(playbackStatus);
    if (isLoading) {
      setIsLoading(false);
    }
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handlePlayPause = () => {
    setStatus(prevStatus => ({
      ...prevStatus,
      isPlaying: !prevStatus.isPlaying
    }));
  };

  const handleLike = async () => {
    if (likePostMutation.isPending) return;
    
    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error('Erreur lors du like:', error);
      Alert.alert('Erreur', 'Impossible de liker la vidéo');
    }
  };

  const handleComment = async () => {
    if (comments && comments.length > 0) {
      const commentsText = comments.map(comment => 
        `${comment.author?.firstName || 'Utilisateur'}: ${comment.content}`
      ).join('\n\n');
      
      Alert.alert(
        'Commentaires',
        commentsText,
        [
          {
            text: 'Ajouter un commentaire',
            onPress: () => handleAddComment(),
          },
          {
            text: 'Fermer',
            style: 'cancel',
          },
        ]
      );
    } else {
      handleAddComment();
    }
  };

  const handleAddComment = () => {
    Alert.prompt(
      'Ajouter un commentaire',
      'Écrivez votre commentaire:',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Publier',
          onPress: async (commentText) => {
            if (commentText && commentText.trim()) {
              try {
                await addCommentMutation.mutateAsync({
                  postId,
                  commentText: commentText.trim()
                });
                Alert.alert('Succès', 'Commentaire ajouté avec succès!');
              } catch (error) {
                console.error('Erreur lors de l\'ajout du commentaire:', error);
                Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire');
              }
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      const videoMedia = post.media?.find(m => m.type === 'video');
      const shareContent = {
        message: post.content || 'Regardez cette vidéo sur CydJerr!',
        url: videoMedia?.url || '',
        title: 'Vidéo CydJerr'
      };
      
      // Utiliser l'API native de partage
      const result = await Share.share(shareContent);
      
      // Si le partage a réussi, enregistrer dans le backend
      if (result.action === Share.sharedAction) {
        try {
          await apiService.sharePost(postId, 'Partagé depuis l\'application');
        } catch (apiError) {
          console.error('Erreur lors de l\'enregistrement du partage:', apiError);
          // Ne pas afficher d'erreur à l'utilisateur car le partage natif a fonctionné
        }
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert('Erreur', 'Impossible de partager la vidéo');
    } finally {
      setIsSharing(false);
    }
  };

  const formatDuration = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoadingPost || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <ActivityIndicator size="large" color="#FF3030" />
            <Text style={styles.errorText}>Chargement de la vidéo...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const videoMedia = post.media?.find(m => m.type === 'video');
  
  if (!videoMedia) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Aucune vidéo trouvée</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={[styles.header, { opacity: showControls ? 1 : 0 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {post.content || 'Vidéo'}
          </Text>
        </View>

        {/* Video Player */}
        <View style={styles.videoContainer}>
          <TouchableOpacity
            style={styles.videoTouchable}
            onPress={handleVideoPress}
            activeOpacity={1}
          >
            <Video
              ref={video}
              style={styles.video}
              source={{ uri: videoMedia.url }}
              controls={false}
              resizeMode="contain"
              repeat={true}
              onProgress={handlePlaybackStatusUpdate}
              paused={!status.isPlaying}
            />
            
            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#FF3030" />
              </View>
            )}
            
            {/* Play/Pause Button */}
            {showControls && !isLoading && (
              <View style={styles.playButtonContainer}>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayPause}
                >
                  <Ionicons
                    name={status.isPlaying ? 'pause' : 'play'}
                    size={40}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>
            )}
            
            {/* Action Buttons Overlay */}
            <View style={styles.actionButtonsOverlay}>
              <TouchableOpacity
                style={[
                  styles.actionButtonOverlay,
                  post.isLiked && styles.actionButtonOverlayActive
                ]}
                onPress={handleLike}
                disabled={likePostMutation.isPending}
              >
                {likePostMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name={post.isLiked ? 'heart' : 'heart-outline'}
                    size={28}
                    color={post.isLiked ? '#FF3030' : '#FFFFFF'}
                  />
                )}
                <Text style={[
                  styles.actionButtonOverlayText,
                  post.isLiked && styles.actionButtonOverlayTextActive
                ]}>
                  {post.stats?.likes || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButtonOverlay}
                onPress={handleComment}
              >
                <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
                <Text style={styles.actionButtonOverlayText}>
                  {post.stats?.comments || 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButtonOverlay}
                onPress={handleShare}
                disabled={isSharing}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="share-outline" size={28} color="#FFFFFF" />
                )}
                <Text style={styles.actionButtonOverlayText}>
                  {isSharing ? 'Partage...' : 'Partager'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        {/* Video Info */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{post.content}</Text>
          
          {/* Author Info */}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>
              {post.author?.firstName} {post.author?.lastName}
            </Text>
            <Text style={styles.publishDate}>
              {new Date(post.publishedAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>

          {/* Video Stats */}
          <View style={styles.videoStats}>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={16} color="rgba(255,255,255,0.7)" />
              <Text style={styles.statText}>{post.stats?.views || 0} vues</Text>
            </View>
            
            {videoMedia.duration && (
              <View style={styles.statItem}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.statText}>
                  {formatDuration(videoMedia.duration * 1000)}
                </Text>
              </View>
            )}
          </View>


        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTouchable: {
    width: screenWidth,
    height: screenWidth * (9/16), // 16:9 aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButtonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  publishDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  videoStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtonsOverlay: {
    position: 'absolute',
    right: 16,
    bottom: 60,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
  },
  actionButtonOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.6)',
    minWidth: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonOverlayActive: {
    backgroundColor: 'rgba(255,48,48,0.8)',
  },
  actionButtonOverlayText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionButtonOverlayTextActive: {
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default VideoPlayerScreen;