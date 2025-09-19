import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = (screenWidth - 48) / 2; // Pour 2 colonnes avec marges
const MEDIA_HEIGHT = 280; // Augmenté pour un meilleur affichage

const StatusItem = memo(({ 
  status, 
  currentUserId, 
  onPress, 
  onLongPress, 
  onReaction, 
  onComment, 
  onView,
  showFullContent = false 
}) => {
  const [videoStatus, setVideoStatus] = useState({});
  const [imageError, setImageError] = useState(false);

  // Vérifications de sécurité
  if (!status || !status._id) {
    return null;
  }
  
  // Sécurisation du contenu pour éviter le rendu d'objets
  const safeContent = React.useMemo(() => {
    if (!status.content) return null;
    if (typeof status.content === 'string') return status.content;
    if (typeof status.content === 'object' && status.content.text) {
      return status.content.text;
    }
    return null;
  }, [status.content]);
  
  const contentStyles = React.useMemo(() => {
    if (!status.content || typeof status.content !== 'object') return {};
    return {
      color: status.content.textColor || '#000000',
      backgroundColor: status.content.backgroundColor || 'transparent'
    };
  }, [status.content]);

  // Informations de l'auteur
  const author = status.author;
  const authorName = author 
    ? `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username
    : 'Utilisateur inconnu';

  // Vérifier si c'est mon statut
  const isMyStatus = status.author?._id === currentUserId;

  // Vérifier si j'ai déjà réagi
  const myReaction = status.reactions?.find(reaction => reaction.user === currentUserId);

  // Vérifier si j'ai déjà vu
  const hasViewed = status.views?.some(view => view.user === currentUserId);

  // Formatage de l'heure
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes < 1 ? 'À l\'instant' : `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}j`;
    }
  };

  // Gérer la réaction
  const handleReaction = (reactionType) => {
    if (onReaction) {
      onReaction(status._id, reactionType);
    }
  };

  // Gérer le commentaire
  const handleComment = () => {
    if (onComment) {
      onComment(status._id);
    }
  };

  // Gérer la vue
  const handleView = () => {
    if (!hasViewed && onView) {
      onView(status._id);
    }
    if (onPress) {
      onPress(status);
    }
  };

  // Gérer les options
  const handleOptions = () => {
    const options = [
      { text: 'Annuler', style: 'cancel' },
    ];

    if (isMyStatus) {
      options.push(
        { text: 'Supprimer', style: 'destructive', onPress: () => handleDelete() }
      );
    } else {
      options.push(
        { text: 'Signaler', onPress: () => handleReport() }
      );
    }

    Alert.alert('Options', '', options);
  };

  // Supprimer le statut
  const handleDelete = () => {
    Alert.alert(
      'Supprimer le statut',
      'Êtes-vous sûr de vouloir supprimer ce statut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {
          // Dispatch delete action
        }}
      ]
    );
  };

  // Signaler le statut
  const handleReport = () => {
    Alert.alert(
      'Signaler le statut',
      'Voulez-vous signaler ce statut ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Signaler', onPress: () => {
          // Dispatch report action
          Alert.alert('Merci', 'Le statut a été signalé.');
        }}
      ]
    );
  };

  // Rendu du média amélioré
  const renderMedia = () => {
    // Vérifier différentes propriétés pour les médias
    const mediaUrl = status.mediaUrl || status.media?.url || status.image?.url || status.attachment?.url;
    const mediaType = status.mediaType || status.media?.type || 'image';
    
    if (!mediaUrl) return null;

    if (mediaType === 'image' || !mediaType) {
      return (
        <View style={[styles.mediaContainer, showFullContent && styles.fullMediaContainer]}>
          {!imageError ? (
            <Image
              source={{ uri: mediaUrl }}
              style={[styles.media, showFullContent && styles.fullMedia]}
              resizeMode={showFullContent ? "contain" : "cover"}
              onError={() => {
                console.log('Erreur de chargement image:', mediaUrl);
                setImageError(true);
              }}
              onLoad={() => console.log('Image chargée avec succès:', mediaUrl)}
            />
          ) : (
            <View style={[styles.media, styles.errorMedia, showFullContent && styles.fullMedia]}>
              <Ionicons name="image-outline" size={60} color="#8E8E93" />
              <Text style={styles.errorText}>Image non disponible</Text>
              <Text style={styles.errorSubText}>{mediaUrl}</Text>
            </View>
          )}
        </View>
      );
    }

    if (mediaType === 'video') {
      return (
        <View style={[styles.mediaContainer, showFullContent && styles.fullMediaContainer]}>
          <Video
            source={{ uri: mediaUrl }}
            style={[styles.media, showFullContent && styles.fullMedia]}
            resizeMode={showFullContent ? "contain" : "cover"}
            paused={true}
            repeat={false}
            controls={showFullContent}
            onProgress={(data) => setVideoStatus(data)}
          />
          {!showFullContent && (
            <TouchableOpacity style={styles.videoOverlay} onPress={handleView}>
              <View style={styles.playButton}>
                <Ionicons name="play" size={30} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return null;
  };

  // Rendu des réactions
  const renderReactions = () => {
    if (!status.reactions || status.reactions.length === 0) return null;

    // Grouper les réactions par type
    const reactionCounts = status.reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    const reactionEmojis = {
      like: '👍',
      love: '❤️',
      laugh: '😂',
      wow: '😮',
      sad: '😢',
      angry: '😡',
    };

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(reactionCounts).map(([type, count]) => (
          <View key={type} style={styles.reactionItem}>
            <Text style={styles.reactionEmoji}>{reactionEmojis[type]}</Text>
            <Text style={styles.reactionCount}>{count}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Rendu des statistiques
  const renderStats = () => {
    const viewsCount = status.views?.length || 0;
    const commentsCount = status.comments?.length || 0;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={16} color="#8E8E93" />
          <Text style={styles.statText}>{viewsCount}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="chatbubble-outline" size={16} color="#8E8E93" />
          <Text style={styles.statText}>{commentsCount}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleView}
      onLongPress={onLongPress || handleOptions}
      activeOpacity={0.95}
    >
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.authorContainer}>
          {author?.profilePicture ? (
            <Image source={{ uri: author.profilePicture }} style={styles.authorAvatar} />
          ) : (
            <View style={[styles.authorAvatar, styles.defaultAvatar]}>
              <Ionicons name="person" size={20} color="#8E8E93" />
            </View>
          )}
          
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{authorName}</Text>
            <Text style={styles.timeText}>{formatTime(status.createdAt)}</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={handleOptions} style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Contenu texte */}
      {safeContent && (
        <Text 
          style={[
            styles.content,
            contentStyles
          ]}
        >
          {safeContent}
        </Text>
      )}

      {/* Média */}
      {renderMedia()}

      {/* Réactions */}
      {renderReactions()}

      {/* Actions - Style WhatsApp */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleReaction(myReaction ? null : 'like')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={myReaction ? 'heart' : 'heart-outline'}
              size={24}
              color={myReaction ? '#FF3B30' : '#8E8E93'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleComment}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            <Ionicons name="paper-plane-outline" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
        
        {renderStats()}
      </View>

      {/* Indicateur de vue */}
      {!hasViewed && !isMyStatus && (
        <View style={styles.unviewedIndicator} />
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: ITEM_WIDTH,
    marginHorizontal: 4,
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  defaultAvatar: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  optionsButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  mediaContainer: {
    position: 'relative',
    marginHorizontal: 0,
    marginBottom: 12,
    borderRadius: 0,
    overflow: 'hidden',
  },
  fullMediaContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
  media: {
    width: '100%',
    height: MEDIA_HEIGHT,
    backgroundColor: '#F2F2F7',
  },
  fullMedia: {
    height: 400,
    borderRadius: 12,
  },
  errorMedia: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 10,
    color: '#C7C7CC',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reactionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 16,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  statText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  unviewedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
  },
});

export default StatusItem;