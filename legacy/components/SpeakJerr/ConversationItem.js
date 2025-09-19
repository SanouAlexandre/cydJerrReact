import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const ConversationItem = memo(({ conversation, currentUserId, onPress, onLongPress }) => {
  // Déterminer l'autre participant dans la conversation
  const otherParticipant = conversation.participants?.find(
    participant => participant._id !== currentUserId
  );

  // Informations d'affichage
  const displayName = conversation.isGroup 
    ? conversation.name 
    : otherParticipant 
      ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || otherParticipant.username
      : 'Utilisateur inconnu';

  const displayAvatar = conversation.isGroup 
    ? conversation.avatar 
    : otherParticipant?.profilePicture;

  // Dernier message
  const lastMessage = conversation.lastMessage;
  const lastMessageText = lastMessage 
    ? getMessagePreview(lastMessage)
    : 'Aucun message';

  // Statut de lecture
  const isUnread = lastMessage && 
    lastMessage.sender !== currentUserId && 
    !lastMessage.readBy?.some(read => read.user === currentUserId);

  // Nombre de messages non lus
  const unreadCount = conversation.unreadCount || 0;

  // Formatage de l'heure
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) { // 7 jours
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
      });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  // Statut en ligne
  const isOnline = conversation.isGroup 
    ? false 
    : otherParticipant?.isOnline;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isUnread && styles.unreadContainer,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {displayAvatar ? (
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <Ionicons
              name={conversation.isGroup ? 'people' : 'person'}
              size={24}
              color="#8E8E93"
            />
          </View>
        )}
        
        {/* Indicateur en ligne */}
        {isOnline && !conversation.isGroup && (
          <View style={styles.onlineIndicator} />
        )}
        
        {/* Badge de groupe */}
        {conversation.isGroup && (
          <View style={styles.groupBadge}>
            <Ionicons name="people" size={12} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text
            style={[
              styles.name,
              isUnread && styles.unreadName,
            ]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          
          {lastMessage && (
            <Text style={styles.time}>
              {formatTime(lastMessage.createdAt)}
            </Text>
          )}
        </View>

        {/* Dernier message */}
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.lastMessage,
              isUnread && styles.unreadMessage,
            ]}
            numberOfLines={2}
          >
            {lastMessageText}
          </Text>
          
          {/* Badge de messages non lus */}
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </View>

        {/* Indicateurs de statut */}
        <View style={styles.statusContainer}>
          {/* Indicateur de frappe */}
          {conversation.isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>En train d'écrire...</Text>
            </View>
          )}
          
          {/* Statut du dernier message */}
          {lastMessage && lastMessage.sender === currentUserId && (
            <View style={styles.messageStatus}>
              {getMessageStatusIcon(lastMessage)}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

// Fonction pour obtenir l'aperçu du message
const getMessagePreview = (message) => {
  if (!message) return '';
  
  switch (message.type) {
    case 'text':
      return message.content || '';
    case 'image':
      return '📷 Photo';
    case 'video':
      return '🎥 Vidéo';
    case 'audio':
      return '🎵 Audio';
    case 'file':
      return `📎 ${message.fileName || 'Fichier'}`;
    case 'location':
      return '📍 Position';
    case 'contact':
      return '👤 Contact';
    default:
      return 'Message';
  }
};

// Fonction pour obtenir l'icône de statut du message
const getMessageStatusIcon = (message) => {
  if (message.status === 'sending') {
    return <Ionicons name="time-outline" size={14} color="#8E8E93" />;
  }
  
  if (message.status === 'sent') {
    return <Ionicons name="checkmark" size={14} color="#8E8E93" />;
  }
  
  if (message.status === 'delivered') {
    return <Ionicons name="checkmark-done" size={14} color="#8E8E93" />;
  }
  
  if (message.status === 'read') {
    return <Ionicons name="checkmark-done" size={14} color="#007AFF" />;
  }
  
  if (message.status === 'failed') {
    return <Ionicons name="alert-circle" size={14} color="#FF3B30" />;
  }
  
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  unreadContainer: {
    backgroundColor: '#F8F9FA',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultAvatar: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginRight: 8,
  },
  unreadName: {
    fontWeight: '600',
  },
  time: {
    fontSize: 14,
    color: '#8E8E93',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#000000',
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  typingIndicator: {
    flex: 1,
  },
  typingText: {
    fontSize: 12,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  messageStatus: {
    marginLeft: 8,
  },
});

export default ConversationItem;