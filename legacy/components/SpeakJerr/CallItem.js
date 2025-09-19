import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const CallItem = memo(({ call, currentUserId, onPress, onCallBack }) => {
  // Déterminer l'autre participant
  const otherParticipant = call.participants?.find(
    participant => participant._id !== currentUserId
  );

  // Informations d'affichage
  const displayName = otherParticipant 
    ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || otherParticipant.username
    : 'Utilisateur inconnu';

  const displayAvatar = otherParticipant?.profilePicture;

  // Déterminer le type d'appel
  const isVideoCall = call.type === 'video';
  const isIncoming = call.caller !== currentUserId;
  const isOutgoing = call.caller === currentUserId;

  // Déterminer le statut de l'appel
  const getCallStatus = () => {
    switch (call.status) {
      case 'missed':
        return {
          text: 'Manqué',
          color: '#FF3B30',
          icon: isIncoming ? 'call-outline' : 'call-outline',
        };
      case 'declined':
        return {
          text: 'Décliné',
          color: '#FF3B30',
          icon: 'call-outline',
        };
      case 'completed':
        return {
          text: formatDuration(call.duration),
          color: '#34C759',
          icon: isIncoming ? 'call-outline' : 'call-outline',
        };
      case 'failed':
        return {
          text: 'Échec',
          color: '#FF3B30',
          icon: 'warning-outline',
        };
      default:
        return {
          text: call.status,
          color: '#8E8E93',
          icon: 'call-outline',
        };
    }
  };

  const callStatus = getCallStatus();

  // Formatage de la durée
  function formatDuration(seconds) {
    if (!seconds || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

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
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Gérer le rappel
  const handleCallBack = () => {
    if (onCallBack) {
      Alert.alert(
        'Rappeler',
        `Voulez-vous rappeler ${displayName} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Audio', onPress: () => onCallBack(otherParticipant._id, 'audio') },
          { text: 'Vidéo', onPress: () => onCallBack(otherParticipant._id, 'video') },
        ]
      );
    }
  };

  // Obtenir l'icône de direction
  const getDirectionIcon = () => {
    if (isIncoming) {
      return call.status === 'missed' || call.status === 'declined' 
        ? 'arrow-down-left' 
        : 'arrow-down-right';
    } else {
      return 'arrow-up-right';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        call.status === 'missed' && styles.missedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {displayAvatar ? (
          <Image source={{ uri: displayAvatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.defaultAvatar]}>
            <Ionicons name="person" size={24} color="#8E8E93" />
          </View>
        )}
        
        {/* Badge de type d'appel */}
        <View style={[
          styles.callTypeBadge,
          { backgroundColor: isVideoCall ? '#007AFF' : '#34C759' }
        ]}>
          <Ionicons
            name={isVideoCall ? 'videocam' : 'call'}
            size={12}
            color="#FFFFFF"
          />
        </View>
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text
            style={[
              styles.name,
              call.status === 'missed' && styles.missedName,
            ]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          
          <Text style={styles.time}>
            {formatTime(call.createdAt)}
          </Text>
        </View>

        {/* Détails de l'appel */}
        <View style={styles.callDetails}>
          <View style={styles.statusContainer}>
            <Ionicons
              name={getDirectionIcon()}
              size={16}
              color={callStatus.color}
              style={styles.directionIcon}
            />
            
            <Text style={[styles.statusText, { color: callStatus.color }]}>
              {callStatus.text}
            </Text>
          </View>
          
          {/* Qualité de l'appel */}
          {call.quality && call.status === 'completed' && (
            <View style={styles.qualityContainer}>
              {[...Array(5)].map((_, index) => (
                <Ionicons
                  key={index}
                  name="star"
                  size={12}
                  color={index < call.quality ? '#FFD700' : '#E5E5EA'}
                />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Bouton de rappel */}
      <TouchableOpacity
        style={styles.callBackButton}
        onPress={handleCallBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isVideoCall ? 'videocam-outline' : 'call-outline'}
          size={20}
          color="#007AFF"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  missedContainer: {
    backgroundColor: '#FFF5F5',
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
  callTypeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
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
  missedName: {
    color: '#FF3B30',
  },
  time: {
    fontSize: 14,
    color: '#8E8E93',
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  directionIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBackButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CallItem;