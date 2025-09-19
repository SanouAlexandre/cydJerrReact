import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from 'react-native-vector-icons';
import {
  fetchMessages,
  sendMessage,
  markMessageAsRead,
  selectMessages,
  selectLoading,
  selectErrors,
} from '../../redux/speakjerrSlice';
import { selectUser } from '../../redux/userSlice';
import socketService from '../../services/socketService';
import MessageItem from '../../components/SpeakJerr/MessageItem';
import LoadingSpinner from '../../components/SpeakJerr/LoadingSpinner';

const ChatScreen = ({ route, navigation }) => {
  const { conversationId, groupId, otherUser, group } = route.params;
  const actualConversationId = conversationId || groupId;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const messages = useSelector(state => selectMessages(state, actualConversationId));
  const loading = useSelector(selectLoading);
  const errors = useSelector(selectErrors);
  const insets = useSafeAreaInsets();
  
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Configuration de l'en-tête
  useEffect(() => {
    navigation.setOptions({
      title: group ? group.name : (otherUser ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.username : 'Chat'),
      headerStyle: {
        backgroundColor: '#FFFFFF',
        height: Platform.OS === 'ios' ? 100 + insets.top : 80 + (StatusBar.currentHeight || 24),
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
      },
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => initiateCall('audio')}
          >
            <Ionicons name="call" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => initiateCall('video')}
          >
            <Ionicons name="videocam" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, otherUser, group, insets.top]);

  // Charger les messages
  useEffect(() => {
    if (actualConversationId) {
      dispatch(fetchMessages({ conversationId: actualConversationId, page: 1 }));
      
      // Rejoindre la conversation via socket
      socketService.joinConversation(actualConversationId);
      
      // Marquer comme lu
      dispatch(markMessageAsRead({ conversationId: actualConversationId }));
    }

    return () => {
      // Quitter la conversation
      if (actualConversationId) {
        socketService.leaveConversation(actualConversationId);
      }
    };
  }, [dispatch, actualConversationId]);

  // Écouter les événements socket
  useEffect(() => {
    const handleNewMessage = (message) => {
      if (message.conversation === actualConversationId) {
        // Le message sera ajouté via Redux
        // Marquer comme lu automatiquement
        dispatch(markMessageAsRead({ conversationId: actualConversationId }));
        
        // Faire défiler vers le bas
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, 100);
      }
    };

    const handleTypingStart = (data) => {
      if (data.conversationId === actualConversationId && data.userId !== user._id) {
        setOtherUserTyping(true);
      }
    };

    const handleTypingStop = (data) => {
      if (data.conversationId === actualConversationId && data.userId !== user._id) {
        setOtherUserTyping(false);
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId === actualConversationId) {
        // Mettre à jour le statut des messages
      }
    };

    socketService.on('new_message', handleNewMessage);
    socketService.on('typing_start', handleTypingStart);
    socketService.on('typing_stop', handleTypingStop);
    socketService.on('message_read', handleMessageRead);

    return () => {
      socketService.off('new_message', handleNewMessage);
      socketService.off('typing_start', handleTypingStart);
      socketService.off('typing_stop', handleTypingStop);
      socketService.off('message_read', handleMessageRead);
    };
  }, [actualConversationId, user._id, dispatch]);

  // Envoyer un message
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim()) return;

    const messageData = {
      conversationId: actualConversationId,
      content: messageText.trim(),
      type: 'text',
    };

    try {
      await dispatch(sendMessage(messageData)).unwrap();
      setMessageText('');
      
      // Arrêter l'indicateur de frappe
      if (isTyping) {
        socketService.stopTyping(actualConversationId);
        setIsTyping(false);
      }
      
      // Faire défiler vers le bas
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'envoyer le message');
    }
  }, [messageText, actualConversationId, dispatch, isTyping]);

  // Gérer la frappe
  const handleTextChange = useCallback((text) => {
    setMessageText(text);
    
    // Gérer l'indicateur de frappe
    if (text.trim() && !isTyping) {
      socketService.startTyping(actualConversationId);
      setIsTyping(true);
    }
    
    // Réinitialiser le timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        socketService.stopTyping(actualConversationId);
        setIsTyping(false);
      }
    }, 2000);
  }, [actualConversationId, isTyping]);

  // Initier un appel
  const initiateCall = useCallback((type) => {
    if (!otherUser) return;
    
    Alert.alert(
      'Appel',
      `Voulez-vous appeler ${otherUser.firstName || otherUser.username} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: type === 'video' ? 'Appel vidéo' : 'Appel audio',
          onPress: () => {
            // Dispatch initiate call action
            navigation.navigate('CallScreen', {
              callType: type,
              otherUserId: otherUser._id,
              isInitiator: true,
            });
          },
        },
      ]
    );
  }, [otherUser, navigation]);

  // Charger plus de messages
  const loadMoreMessages = useCallback(async () => {
    if (loading.messages || !hasMore) return;
    
    try {
      const result = await dispatch(fetchMessages({ 
        conversationId: actualConversationId, 
        page: page + 1 
      })).unwrap();
      
      // Vérifier que result.data existe (pour gérer les réponses 304 Not Modified)
      if (!result.data || result.data.length === 0) {
        setHasMore(false);
      } else {
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    }
  }, [dispatch, actualConversationId, page, hasMore, loading.messages]);

  // Rafraîchir les messages
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchMessages({ conversationId: actualConversationId, page: 1 })).unwrap();
      setPage(1);
      setHasMore(true);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rafraîchir les messages');
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, actualConversationId]);

  // Rendu d'un message
  const renderMessage = useCallback(({ item }) => (
    <MessageItem
      message={item}
      currentUserId={user._id}
      onReaction={(messageId, reaction) => {
        // Dispatch reaction action
      }}
      onReply={(message) => {
        // Gérer la réponse
      }}
    />
  ), [user._id]);

  // Rendu de l'indicateur de frappe
  const renderTypingIndicator = () => {
    if (!otherUserTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>
            {otherUser?.firstName || otherUser?.username || 'L\'utilisateur'} est en train d'écrire...
          </Text>
        </View>
      </View>
    );
  };

  // Rendu du séparateur de date
  const renderDateSeparator = (date) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>
        {new Date(date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
    </View>
  );

  // Messages filtrés par conversation
  const conversationMessages = messages.filter(msg => msg.conversation === conversationId);

  // Affichage du chargement initial
  if (loading.messages && conversationMessages.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingSpinner message="Chargement des messages..." />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Liste des messages */}
      <FlatList
        ref={flatListRef}
        data={conversationMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        inverted
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.messagesList}
        ListFooterComponent={renderTypingIndicator}
      />

      {/* Zone de saisie */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Tapez votre message..."
            placeholderTextColor="#8E8E93"
            value={messageText}
            onChangeText={handleTextChange}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
          />
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              messageText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color={messageText.trim() ? '#FFFFFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typingBubble: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typingText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: '#8E8E93',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});

export default ChatScreen;