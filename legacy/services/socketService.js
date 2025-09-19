import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.currentUserId = null;
  }

  // Initialiser la connexion WebSocket
  async initialize() {
    try {
      const token = await AsyncStorage.getItem('@cydjerr_access_token');
      if (!token) {
        console.warn('Aucun token trouvé, connexion WebSocket impossible');
        return false;
      }

      // Créer la connexion Socket.IO - utiliser l'URL du serveur sans /api/v1
      const socketUrl = API_BASE_URL.replace('/api/v1', '');
      this.socket = io(socketUrl, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du WebSocket:', error);
      return false;
    }
  }

  // Configurer les écouteurs d'événements
  setupEventListeners() {
    if (!this.socket) return;

    // Événements de connexion
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket déconnecté:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion WebSocket:', error);
      this.reconnectAttempts++;
      this.emit('connection_error', { error, attempts: this.reconnectAttempts });
    });

    // Événements d'authentification
    this.socket.on('authenticated', (data) => {
      console.log('🔐 Authentification WebSocket réussie:', data.user.username);
      this.currentUserId = data.user._id;
      this.emit('authenticated', data);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('❌ Erreur d\'authentification WebSocket:', error);
      this.emit('authentication_error', error);
      this.disconnect();
    });

    // Événements de messagerie
    this.socket.on('new_message', (message) => {
      console.log('📨 Nouveau message reçu:', message._id);
      this.emit('new_message', message);
    });

    this.socket.on('message_read', (data) => {
      this.emit('message_read', data);
    });

    this.socket.on('message_reaction', (data) => {
      this.emit('message_reaction', data);
    });

    this.socket.on('typing_start', (data) => {
      this.emit('typing_start', data);
    });

    this.socket.on('typing_stop', (data) => {
      this.emit('typing_stop', data);
    });

    // Événements d'appels
    this.socket.on('incoming_call', (call) => {
      console.log('📞 Appel entrant:', call._id);
      this.emit('incoming_call', call);
    });

    this.socket.on('call_answered', (data) => {
      this.emit('call_answered', data);
    });

    this.socket.on('call_declined', (data) => {
      this.emit('call_declined', data);
    });

    this.socket.on('call_ended', (data) => {
      this.emit('call_ended', data);
    });

    this.socket.on('call_participant_joined', (data) => {
      this.emit('call_participant_joined', data);
    });

    this.socket.on('call_participant_left', (data) => {
      this.emit('call_participant_left', data);
    });

    this.socket.on('call_media_updated', (data) => {
      this.emit('call_media_updated', data);
    });

    // Signalisation WebRTC
    this.socket.on('webrtc_offer', (data) => {
      this.emit('webrtc_offer', data);
    });

    this.socket.on('webrtc_answer', (data) => {
      this.emit('webrtc_answer', data);
    });

    this.socket.on('webrtc_ice_candidate', (data) => {
      this.emit('webrtc_ice_candidate', data);
    });

    // Événements de statuts
    this.socket.on('new_status', (status) => {
      console.log('📸 Nouveau statut:', status._id);
      this.emit('new_status', status);
    });

    this.socket.on('status_reaction', (data) => {
      this.emit('status_reaction', data);
    });

    this.socket.on('status_viewed', (data) => {
      this.emit('status_viewed', data);
    });

    // Événements généraux
    this.socket.on('user_status_updated', (data) => {
      this.emit('user_status_updated', data);
    });

    this.socket.on('pong', (data) => {
      this.emit('pong', data);
    });
  }

  // Émettre un événement vers le serveur
  send(event, data = {}) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
      return true;
    }
    console.warn(`Impossible d'envoyer l'événement ${event}: WebSocket non connecté`);
    return false;
  }

  // Écouter un événement
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  // Arrêter d'écouter un événement
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  // Émettre un événement local
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erreur dans le callback de l'événement ${event}:`, error);
        }
      });
    }
  }

  // ===== MÉTHODES DE MESSAGERIE =====
  
  // Rejoindre une conversation
  joinConversation(conversationId) {
    return this.send('join_conversation', { conversationId });
  }

  // Quitter une conversation
  leaveConversation(conversationId) {
    return this.send('leave_conversation', { conversationId });
  }

  // Indiquer que l'utilisateur tape
  startTyping(conversationId) {
    return this.send('typing_start', { conversationId });
  }

  // Arrêter l'indication de frappe
  stopTyping(conversationId) {
    return this.send('typing_stop', { conversationId });
  }

  // Marquer des messages comme lus
  markMessagesAsRead(messageIds) {
    return this.send('mark_messages_read', { messageIds });
  }

  // ===== MÉTHODES D'APPELS =====
  
  // Rejoindre un appel
  joinCall(callId) {
    return this.send('join_call', { callId });
  }

  // Quitter un appel
  leaveCall(callId) {
    return this.send('leave_call', { callId });
  }

  // Envoyer une offre WebRTC
  sendWebRTCOffer(callId, offer, targetUserId) {
    return this.send('webrtc_offer', { callId, offer, targetUserId });
  }

  // Envoyer une réponse WebRTC
  sendWebRTCAnswer(callId, answer, targetUserId) {
    return this.send('webrtc_answer', { callId, answer, targetUserId });
  }

  // Envoyer un candidat ICE
  sendICECandidate(callId, candidate, targetUserId) {
    return this.send('webrtc_ice_candidate', { callId, candidate, targetUserId });
  }

  // Mettre à jour le statut média
  updateMediaStatus(callId, mediaStatus) {
    return this.send('update_media_status', { callId, ...mediaStatus });
  }

  // ===== MÉTHODES DE STATUTS =====
  
  // Rejoindre le feed de statuts
  joinStatusFeed() {
    return this.send('join_status_feed');
  }

  // Quitter le feed de statuts
  leaveStatusFeed() {
    return this.send('leave_status_feed');
  }

  // Marquer un statut comme vu
  markStatusAsViewed(statusId) {
    return this.send('mark_status_viewed', { statusId });
  }

  // ===== MÉTHODES GÉNÉRALES =====
  
  // Ping le serveur
  ping() {
    return this.send('ping', { timestamp: Date.now() });
  }

  // Mettre à jour le statut utilisateur
  updateUserStatus(status) {
    return this.send('update_user_status', { status });
  }

  // Déconnecter le WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentUserId = null;
      console.log('🔌 WebSocket déconnecté manuellement');
    }
  }

  // Reconnecter le WebSocket
  async reconnect() {
    this.disconnect();
    await new Promise(resolve => setTimeout(resolve, 1000));
    return this.initialize();
  }

  // Vérifier l'état de la connexion
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socket: !!this.socket,
      userId: this.currentUserId,
      reconnectAttempts: this.reconnectAttempts,
    };
  }

  // Nettoyer tous les écouteurs
  cleanup() {
    this.listeners.clear();
    this.disconnect();
  }
}

// Instance singleton
const socketService = new SocketService();

export default socketService;