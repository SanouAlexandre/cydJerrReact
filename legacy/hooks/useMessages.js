import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ApiService from '../services/api';
import { selectAuth } from '../redux/userSlice';

export const useConversations = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Vérifier l'état d'authentification
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getConversations();
      
      if (response.success) {
        setConversations(response.data.conversations || []);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des conversations');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchConversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await ApiService.getUnreadMessagesCount();
      
      if (response.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (err) {
      console.error('Erreur fetchUnreadCount:', err);
    }
  }, []);

  const sendMessage = useCallback(async (messageData) => {
    try {
      const response = await ApiService.sendMessage(messageData);
      
      if (response.success) {
        // Mettre à jour les conversations
        await fetchConversations();
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchConversations]);

  useEffect(() => {
    // Ne charger les conversations que si l'utilisateur est authentifié
    if (isAuthenticated && !isLoading) {
      fetchConversations();
      fetchUnreadCount();
    }
  }, [isAuthenticated, isLoading, fetchConversations, fetchUnreadCount]);

  return {
    conversations,
    loading,
    error,
    unreadCount,
    refresh: fetchConversations,
    sendMessage,
    fetchUnreadCount,
  };
};

export const useMessages = (conversationId, userId = null, groupId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMessages = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (conversationId) {
        response = await ApiService.getConversationMessages(conversationId, pageNum, 20);
      } else if (userId) {
        response = await ApiService.getDirectMessages(userId, pageNum, 20);
      } else if (groupId) {
        response = await ApiService.getGroupMessages(groupId, pageNum, 20);
      } else {
        throw new Error('ID de conversation, utilisateur ou groupe requis');
      }
      
      if (response.success) {
        const newMessages = response.data.messages || [];
        
        if (isRefresh || pageNum === 1) {
          setMessages(newMessages.reverse()); // Les messages les plus récents en bas
        } else {
          setMessages(prev => [...newMessages.reverse(), ...prev]);
        }
        
        setHasMore(newMessages.length === 20);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des messages');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchMessages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, userId, groupId]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchMessages(page + 1, false);
    }
  }, [loading, hasMore, page, fetchMessages]);

  const sendMessage = useCallback(async (messageData) => {
    try {
      const response = await ApiService.sendMessage({
        ...messageData,
        recipientId: userId,
        groupId: groupId,
      });
      
      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId, groupId]);

  const updateMessage = useCallback(async (messageId, content) => {
    try {
      const response = await ApiService.updateMessage(messageId, content);
      
      if (response.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, content: response.data.content, isEdited: true }
            : msg
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur updateMessage:', err);
      throw err;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId, deleteForEveryone = false) => {
    try {
      const response = await ApiService.deleteMessage(messageId, deleteForEveryone);
      
      if (response.success) {
        if (deleteForEveryone) {
          setMessages(prev => prev.filter(msg => msg._id !== messageId));
        } else {
          setMessages(prev => prev.map(msg => 
            msg._id === messageId 
              ? { ...msg, isDeleted: true, content: 'Message supprimé' }
              : msg
          ));
        }
        return true;
      }
    } catch (err) {
      console.error('Erreur deleteMessage:', err);
      throw err;
    }
  }, []);

  const reactToMessage = useCallback(async (messageId, emoji) => {
    try {
      const response = await ApiService.reactToMessage(messageId, emoji);
      
      if (response.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, reactions: response.data.reactions }
            : msg
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur reactToMessage:', err);
      throw err;
    }
  }, []);

  const markAsRead = useCallback(async (messageId) => {
    try {
      const response = await ApiService.markMessageAsRead(messageId);
      
      if (response.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, readBy: response.data.readBy }
            : msg
        ));
      }
    } catch (err) {
      console.error('Erreur markAsRead:', err);
    }
  }, []);

  useEffect(() => {
    if (conversationId || userId || groupId) {
      fetchMessages(1, false);
    }
  }, [conversationId, userId, groupId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchMessages(1, true),
    sendMessage,
    updateMessage,
    deleteMessage,
    reactToMessage,
    markAsRead,
  };
};