import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const GroupItem = memo(({ group, currentUserId, onPress, onLongPress }) => {
  // Vérifier si l'utilisateur est admin
  const isAdmin = group.admins && group.admins.some(admin => admin._id === currentUserId);
  
  // Vérifier si l'utilisateur est membre
  const isMember = group.members && group.members.some(member => member._id === currentUserId);

  // Compter les membres
  const membersCount = group.members ? group.members.length : 0;
  const adminsCount = group.admins ? group.admins.length : 0;

  // Dernier message
  const lastMessage = group.lastMessage;
  const lastMessageText = lastMessage 
    ? getMessagePreview(lastMessage)
    : 'Aucun message';

  // Statut de lecture
  const isUnread = lastMessage && 
    lastMessage.sender !== currentUserId && 
    !lastMessage.readBy?.some(read => read.user === currentUserId);

  // Nombre de messages non lus
  const unreadCount = group.unreadCount || 0;

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

  // Obtenir les avatars des membres (max 3)
  const getMemberAvatars = () => {
    if (!group.members) return [];
    
    return group.members
      .slice(0, 3)
      .map(member => ({
        id: member._id,
        avatar: member.profilePicture,
        name: member.firstName || member.username,
      }));
  };

  const memberAvatars = getMemberAvatars();

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
      {/* Avatar du groupe */}
      <View style={styles.avatarContainer}>
        {group.avatar ? (
          <Image source={{ uri: group.avatar }} style={styles.groupAvatar} />
        ) : (
          <View style={[styles.groupAvatar, styles.defaultGroupAvatar]}>
            <Ionicons name="people" size={24} color="#8E8E93" />
          </View>
        )}
        
        {/* Badge admin */}
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Ionicons name="shield" size={12} color="#FFFFFF" />
          </View>
        )}
        
        {/* Indicateur de statut */}
        {group.isActive && (
          <View style={styles.activeIndicator} />
        )}
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text
            style={[
              styles.groupName,
              isUnread && styles.unreadGroupName,
            ]}
            numberOfLines={1}
          >
            {group.name || 'Groupe sans nom'}
          </Text>
          
          {lastMessage && (
            <Text style={styles.time}>
              {formatTime(lastMessage.createdAt)}
            </Text>
          )}
        </View>

        {/* Description ou dernier message */}
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.description,
              isUnread && styles.unreadDescription,
            ]}
            numberOfLines={1}
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

        {/* Informations du groupe */}
        <View style={styles.groupInfo}>
          {/* Avatars des membres */}
          <View style={styles.membersAvatars}>
            {memberAvatars.map((member, index) => (
              <View
                key={member.id}
                style={[
                  styles.memberAvatar,
                  { marginLeft: index > 0 ? -8 : 0 },
                ]}
              >
                {member.avatar ? (
                  <Image
                    source={{ uri: member.avatar }}
                    style={styles.memberAvatarImage}
                  />
                ) : (
                  <View style={[styles.memberAvatarImage, styles.defaultMemberAvatar]}>
                    <Text style={styles.memberInitial}>
                      {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                    </Text>
                  </View>
                )}
              </View>
            ))}
            
            {/* Indicateur de membres supplémentaires */}
            {membersCount > 3 && (
              <View style={[styles.memberAvatar, styles.moreMembers, { marginLeft: -8 }]}>
                <Text style={styles.moreMembersText}>
                  +{membersCount - 3}
                </Text>
              </View>
            )}
          </View>
          
          {/* Compteur de membres */}
          <View style={styles.membersCount}>
            <Ionicons name="people-outline" size={14} color="#8E8E93" />
            <Text style={styles.membersCountText}>
              {membersCount} membre{membersCount > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Indicateurs de statut */}
        <View style={styles.statusContainer}>
          {/* Type de groupe */}
          <View style={styles.groupType}>
            <Ionicons
              name={group.isPrivate ? 'lock-closed-outline' : 'globe-outline'}
              size={12}
              color="#8E8E93"
            />
            <Text style={styles.groupTypeText}>
              {group.isPrivate ? 'Privé' : 'Public'}
            </Text>
          </View>
          
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
  
  const senderName = message.senderName || 'Quelqu\'un';
  
  switch (message.type) {
    case 'text':
      return `${senderName}: ${message.content || ''}`;
    case 'image':
      return `${senderName}: 📷 Photo`;
    case 'video':
      return `${senderName}: 🎥 Vidéo`;
    case 'audio':
      return `${senderName}: 🎵 Audio`;
    case 'file':
      return `${senderName}: 📎 ${message.fileName || 'Fichier'}`;
    case 'location':
      return `${senderName}: 📍 Position`;
    default:
      return `${senderName}: Message`;
  }
};

// Fonction pour obtenir l'icône de statut du message
const getMessageStatusIcon = (message) => {
  if (message.status === 'sending') {
    return <Ionicons name="time-outline" size={12} color="#8E8E93" />;
  }
  
  if (message.status === 'sent') {
    return <Ionicons name="checkmark" size={12} color="#8E8E93" />;
  }
  
  if (message.status === 'delivered') {
    return <Ionicons name="checkmark-done" size={12} color="#8E8E93" />;
  }
  
  if (message.status === 'read') {
    return <Ionicons name="checkmark-done" size={12} color="#007AFF" />;
  }
  
  if (message.status === 'failed') {
    return <Ionicons name="alert-circle" size={12} color="#FF3B30" />;
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
  groupAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultGroupAvatar: {
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
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
  groupName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  unreadGroupName: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  description: {
    flex: 1,
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 8,
  },
  unreadDescription: {
    color: '#000000',
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  membersAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    position: 'relative',
  },
  memberAvatarImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  defaultMemberAvatar: {
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInitial: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
  },
  moreMembers: {
    backgroundColor: '#8E8E93',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  moreMembersText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  membersCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  membersCountText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTypeText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 4,
  },
  messageStatus: {
    marginLeft: 8,
  },
});

export default GroupItem;