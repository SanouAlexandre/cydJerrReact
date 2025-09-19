import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';

const { width: screenWidth } = Dimensions.get('window');
const MAX_MESSAGE_WIDTH = screenWidth * 0.75;

const MessageItem = memo(({ 
  message, 
  currentUserId, 
  onReaction, 
  onReply, 
  onLongPress 
}) => {
  const [imageError, setImageError] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});

  // Vérifier si c'est mon message
  const isMyMessage = message.sender === currentUserId;

  // Informations de l'expéditeur
  const senderInfo = message.senderInfo || {};
  const senderName = senderInfo.firstName 
    ? `${senderInfo.firstName} ${senderInfo.lastName || ''}`.trim()
    : senderInfo.username || 'Utilisateur';

  // Formatage de l'heure
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Gérer les réactions
  const handleReaction = (reactionType) => {
    if (onReaction) {
      onReaction(message._id, reactionType);
    }
  };

  // Gérer la réponse
  const handleReply = () => {
    if (onReply) {
      onReply(message);
    }
  };

  // Gérer l'appui long
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    } else {
      // Menu par défaut
      const options = [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Répondre', onPress: handleReply },
      ];

      if (isMyMessage) {
        options.push(
          { text: 'Supprimer', style: 'destructive', onPress: () => handleDelete() }
        );
      } else {
        options.push(
          { text: 'Signaler', onPress: () => handleReport() }
        );
      }

      Alert.alert('Options du message', '', options);
    }
  };

  // Supprimer le message
  const handleDelete = () => {
    Alert.alert(
      'Supprimer le message',
      'Êtes-vous sûr de vouloir supprimer ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {
          // Dispatch delete action
        }}
      ]
    );
  };

  // Signaler le message
  const handleReport = () => {
    Alert.alert(
      'Signaler le message',
      'Voulez-vous signaler ce message ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Signaler', onPress: () => {
          // Dispatch report action
          Alert.alert('Merci', 'Le message a été signalé.');
        }}
      ]
    );
  };

  // Rendu du contenu selon le type
  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}>
            {message.content}
          </Text>
        );

      case 'image':
        return (
          <View style={styles.mediaContainer}>
            {!imageError ? (
              <Image
                source={{ uri: message.mediaUrl }}
                style={styles.imageMessage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[styles.imageMessage, styles.errorMedia]}>
                <Ionicons name="image-outline" size={32} color="#8E8E93" />
                <Text style={styles.errorText}>Image non disponible</Text>
              </View>
            )}
            {message.content && (
              <Text style={[
                styles.mediaCaption,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}>
                {message.content}
              </Text>
            )}
          </View>
        );

      case 'video':
        return (
          <View style={styles.mediaContainer}>
            <Video
              source={{ uri: message.mediaUrl }}
              style={styles.videoMessage}
              resizeMode="cover"
              paused={true}
              repeat={false}
              controls={true}
              onProgress={(data) => setVideoStatus(data)}
            />
            <View style={styles.videoOverlay}>
              <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
            </View>
            {message.content && (
              <Text style={[
                styles.mediaCaption,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}>
                {message.content}
              </Text>
            )}
          </View>
        );

      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <Ionicons name="musical-notes" size={24} color={isMyMessage ? '#FFFFFF' : '#007AFF'} />
            <Text style={[
              styles.audioText,
              isMyMessage ? styles.myMessageText : styles.otherMessageText,
            ]}>
              Message audio
            </Text>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={16} color={isMyMessage ? '#FFFFFF' : '#007AFF'} />
            </TouchableOpacity>
          </View>
        );

      case 'file':
        return (
          <View style={styles.fileContainer}>
            <Ionicons name="document" size={24} color={isMyMessage ? '#FFFFFF' : '#007AFF'} />
            <View style={styles.fileInfo}>
              <Text style={[
                styles.fileName,
                isMyMessage ? styles.myMessageText : styles.otherMessageText,
              ]}>
                {message.fileName || 'Fichier'}
              </Text>
              {message.fileSize && (
                <Text style={[
                  styles.fileSize,
                  isMyMessage ? styles.myMessageText : styles.otherMessageText,
                ]}>
                  {formatFileSize(message.fileSize)}
                </Text>
              )}
            </View>
          </View>
        );

      default:
        return (
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}>
            Message non supporté
          </Text>
        );
    }
  };

  // Rendu des réactions
  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    // Grouper les réactions par type
    const reactionCounts = message.reactions.reduce((acc, reaction) => {
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
      <View style={[
        styles.reactionsContainer,
        isMyMessage ? styles.myReactions : styles.otherReactions,
      ]}>
        {Object.entries(reactionCounts).map(([type, count]) => (
          <TouchableOpacity
            key={type}
            style={styles.reactionItem}
            onPress={() => handleReaction(type)}
          >
            <Text style={styles.reactionEmoji}>{reactionEmojis[type]}</Text>
            <Text style={styles.reactionCount}>{count}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Rendu du statut du message
  const renderMessageStatus = () => {
    if (!isMyMessage) return null;

    let icon, color;
    switch (message.status) {
      case 'sending':
        icon = 'time-outline';
        color = '#8E8E93';
        break;
      case 'sent':
        icon = 'checkmark';
        color = '#8E8E93';
        break;
      case 'delivered':
        icon = 'checkmark-done';
        color = '#8E8E93';
        break;
      case 'read':
        icon = 'checkmark-done';
        color = '#007AFF';
        break;
      case 'failed':
        icon = 'alert-circle';
        color = '#FF3B30';
        break;
      default:
        return null;
    }

    return (
      <Ionicons
        name={icon}
        size={14}
        color={color}
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View style={[
      styles.container,
      isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
    ]}>
      {/* Avatar pour les messages des autres */}
      {!isMyMessage && (
        <View style={styles.avatarContainer}>
          {senderInfo.profilePicture ? (
            <Image source={{ uri: senderInfo.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Text style={styles.avatarText}>
                {senderName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Bulle de message */}
      <TouchableOpacity
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
        onLongPress={handleLongPress}
        activeOpacity={0.7}
      >
        {/* Nom de l'expéditeur (pour les groupes) */}
        {!isMyMessage && message.isGroupMessage && (
          <Text style={styles.senderName}>{senderName}</Text>
        )}

        {/* Contenu du message */}
        {renderContent()}

        {/* Heure et statut */}
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timeText,
            isMyMessage ? styles.myTimeText : styles.otherTimeText,
          ]}>
            {formatTime(message.createdAt)}
          </Text>
          {renderMessageStatus()}
        </View>
      </TouchableOpacity>

      {/* Réactions */}
      {renderReactions()}
    </View>
  );
});

// Fonction utilitaire pour formater la taille des fichiers
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  messageBubble: {
    maxWidth: MAX_MESSAGE_WIDTH,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#F2F2F7',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  mediaContainer: {
    position: 'relative',
  },
  imageMessage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  videoMessage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  errorMedia: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  mediaCaption: {
    fontSize: 14,
    marginTop: 8,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  audioText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  playButton: {
    padding: 4,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  fileInfo: {
    marginLeft: 8,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
  },
  fileSize: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 11,
    marginRight: 4,
  },
  myTimeText: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimeText: {
    color: '#8E8E93',
  },
  statusIcon: {
    marginLeft: 2,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 4,
    marginHorizontal: 8,
  },
  myReactions: {
    justifyContent: 'flex-end',
  },
  otherReactions: {
    justifyContent: 'flex-start',
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginHorizontal: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 10,
    color: '#8E8E93',
    marginLeft: 2,
  },
});

export default MessageItem;