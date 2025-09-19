import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { messagesApi, statusApi, callsApi, groupsApi } from '../services/speakjerrApi';
import socketService from '../services/socketService';

// ===== ACTIONS ASYNCHRONES =====

// Messages
export const sendMessage = createAsyncThunk(
  'speakjerr/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messagesApi.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'speakjerr/fetchMessages',
  async ({ conversationId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getMessages(conversationId, page, limit);
      return { conversationId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des messages');
    }
  }
);

export const fetchConversations = createAsyncThunk(
  'speakjerr/fetchConversations',
  async ({ type = null } = {}, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getConversations(type);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des conversations');
    }
  }
);

export const fetchConversationMessages = createAsyncThunk(
  'speakjerr/fetchConversationMessages',
  async ({ conversationId, before = null }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getConversationMessages(conversationId, before);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des messages de conversation');
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'speakjerr/markMessageAsRead',
  async (messageId, { rejectWithValue }) => {
    try {
      const response = await messagesApi.markAsRead(messageId);
      return { messageId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du marquage du message comme lu');
    }
  }
);

export const editMessage = createAsyncThunk(
  'speakjerr/editMessage',
  async ({ messageId, content }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.editMessage(messageId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la modification du message');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'speakjerr/deleteMessage',
  async ({ messageId, deleteForAll = false }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.deleteMessage(messageId, deleteForAll);
      return { messageId, deleteForAll, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression du message');
    }
  }
);

export const reactToMessage = createAsyncThunk(
  'speakjerr/reactToMessage',
  async ({ messageId, reaction }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.reactToMessage(messageId, reaction);
      return { messageId, reaction, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la réaction au message');
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'speakjerr/getUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messagesApi.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération du nombre de messages non lus');
    }
  }
);

export const searchMessages = createAsyncThunk(
  'speakjerr/searchMessages',
  async ({ query, conversationId = null, messageType = null, before = null, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await messagesApi.searchMessages(query, conversationId, messageType, before, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la recherche de messages');
    }
  }
);

// Statuts
export const createStatus = createAsyncThunk(
  'speakjerr/createStatus',
  async (statusData, { rejectWithValue }) => {
    try {
      const response = await statusApi.createStatus(statusData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du statut');
    }
  }
);

export const fetchStatuses = createAsyncThunk(
  'speakjerr/fetchStatuses',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await statusApi.getStatuses(page, limit);
      return { type: 'feed', ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des statuts');
    }
  }
);

export const fetchMyStatuses = createAsyncThunk(
  'speakjerr/fetchMyStatuses',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await statusApi.getMyStatuses(page, limit);
      return { type: 'my', ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de mes statuts');
    }
  }
);

export const reactToStatus = createAsyncThunk(
  'speakjerr/reactToStatus',
  async ({ statusId, reaction }, { rejectWithValue }) => {
    try {
      const response = await statusApi.reactToStatus(statusId, reaction);
      return { statusId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la réaction au statut');
    }
  }
);

export const commentOnStatus = createAsyncThunk(
  'speakjerr/commentOnStatus',
  async ({ statusId, content, media = null }, { rejectWithValue }) => {
    try {
      const response = await statusApi.commentOnStatus(statusId, content, media);
      return { statusId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du commentaire du statut');
    }
  }
);

export const markStatusAsViewed = createAsyncThunk(
  'speakjerr/markStatusAsViewed',
  async (statusId, { rejectWithValue }) => {
    try {
      const response = await statusApi.markStatusAsViewed(statusId);
      return { statusId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du marquage du statut comme vu');
    }
  }
);

// Appels
export const initiateCall = createAsyncThunk(
  'speakjerr/initiateCall',
  async (callData, { rejectWithValue }) => {
    try {
      const response = await callsApi.initiateCall(callData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'initiation de l\'appel');
    }
  }
);

export const answerCall = createAsyncThunk(
  'speakjerr/answerCall',
  async ({ callId, mediaSettings = {} }, { rejectWithValue }) => {
    try {
      const response = await callsApi.answerCall(callId, mediaSettings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la réponse à l\'appel');
    }
  }
);

export const declineCall = createAsyncThunk(
  'speakjerr/declineCall',
  async ({ callId, reason = null }, { rejectWithValue }) => {
    try {
      const response = await callsApi.declineCall(callId, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du refus de l\'appel');
    }
  }
);

export const endCall = createAsyncThunk(
  'speakjerr/endCall',
  async (callId, { rejectWithValue }) => {
    try {
      const response = await callsApi.endCall(callId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la fin de l\'appel');
    }
  }
);

export const joinGroupCall = createAsyncThunk(
  'speakjerr/joinGroupCall',
  async ({ callId, mediaSettings = {} }, { rejectWithValue }) => {
    try {
      const response = await callsApi.joinGroupCall(callId, mediaSettings);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la participation à l\'appel de groupe');
    }
  }
);

export const leaveGroupCall = createAsyncThunk(
  'speakjerr/leaveGroupCall',
  async (callId, { rejectWithValue }) => {
    try {
      const response = await callsApi.leaveGroupCall(callId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sortie de l\'appel de groupe');
    }
  }
);

export const updateMediaStatus = createAsyncThunk(
  'speakjerr/updateMediaStatus',
  async ({ callId, mediaStatus }, { rejectWithValue }) => {
    try {
      const response = await callsApi.updateMediaStatus(callId, mediaStatus);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du statut média');
    }
  }
);

export const fetchCallHistory = createAsyncThunk(
  'speakjerr/fetchCallHistory',
  async ({ page = 1, limit = 20, callType = null } = {}, { rejectWithValue }) => {
    try {
      const response = await callsApi.getCallHistory(page, limit, callType);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de l\'historique');
    }
  }
);

export const submitCallFeedback = createAsyncThunk(
  'speakjerr/submitCallFeedback',
  async ({ callId, feedback }, { rejectWithValue }) => {
    try {
      const response = await callsApi.submitCallFeedback(callId, feedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'envoi du feedback');
    }
  }
);

// Groupes
export const createGroup = createAsyncThunk(
  'speakjerr/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await groupsApi.createGroup(groupData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création du groupe');
    }
  }
);

export const fetchGroups = createAsyncThunk(
  'speakjerr/fetchGroups',
  async ({ page = 1, limit = 20, type = null, category = null } = {}, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getGroups(page, limit, type, category);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des groupes');
    }
  }
);

export const fetchMyGroups = createAsyncThunk(
  'speakjerr/fetchMyGroups',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getMyGroups(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération de mes groupes');
    }
  }
);

export const fetchTrendingGroups = createAsyncThunk(
  'speakjerr/fetchTrendingGroups',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await groupsApi.getTrendingGroups(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la récupération des groupes tendances');
    }
  }
);

export const joinGroup = createAsyncThunk(
  'speakjerr/joinGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await groupsApi.joinGroup(groupId);
      return { groupId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de l\'adhésion au groupe');
    }
  }
);

export const leaveGroup = createAsyncThunk(
  'speakjerr/leaveGroup',
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await groupsApi.leaveGroup(groupId);
      return { groupId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la sortie du groupe');
    }
  }
);

export const updateGroup = createAsyncThunk(
  'speakjerr/updateGroup',
  async ({ groupId, updateData }, { rejectWithValue }) => {
    try {
      const response = await groupsApi.updateGroup(groupId, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour du groupe');
    }
  }
);

export const searchGroups = createAsyncThunk(
  'speakjerr/searchGroups',
  async ({ query, page = 1, limit = 20, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await groupsApi.searchGroups(query, page, limit, filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la recherche de groupes');
    }
  }
);

// État initial
const initialState = {
  // Messages et conversations
  conversations: [],
  messages: {}, // { conversationId: { messages: [], pagination: {} } }
  activeConversation: null,
  typingUsers: {}, // { conversationId: [userId1, userId2] }
  
  // Statuts
  statuses: {
    feed: [],
    myStatuses: [],
    userStatuses: {}, // { userId: [] }
  },
  statusesPagination: {
    feed: { page: 1, hasMore: true },
    myStatuses: { page: 1, hasMore: true },
  },
  
  // Appels
  activeCall: null,
  incomingCall: null,
  callHistory: [],
  callHistoryPagination: { page: 1, hasMore: true },
  
  // Groupes
  groups: [],
  groupsPagination: { page: 1, hasMore: true },
  
  // WebSocket
  socketConnected: false,
  socketError: null,
  
  // États de chargement
  loading: {
    conversations: false,
    messages: false,
    statuses: false,
    calls: false,
    groups: false,
  },
  
  // Erreurs
  error: {
    conversations: null,
    messages: null,
    statuses: null,
    calls: null,
    groups: null,
  },
};

// Slice
const speakjerrSlice = createSlice({
  name: 'speakjerr',
  initialState,
  reducers: {
    // WebSocket
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
      if (action.payload) {
        state.socketError = null;
      }
    },
    
    setSocketError: (state, action) => {
      // Stocker seulement le message d'erreur pour éviter les problèmes de sérialisation
      state.socketError = typeof action.payload === 'string' 
        ? action.payload 
        : action.payload?.message || 'Erreur de connexion WebSocket';
    },
    
    // Messages en temps réel
    addNewMessage: (state, action) => {
      const message = action.payload;
      const conversationId = message.conversationId;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = { messages: [], pagination: {} };
      }
      
      // Éviter les doublons
      const exists = state.messages[conversationId].messages.find(m => m._id === message._id);
      if (!exists) {
        state.messages[conversationId].messages.push(message);
      }
      
      // Mettre à jour la conversation
      const conversation = state.conversations.find(c => c._id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.updatedAt = message.createdAt;
        // Déplacer en haut de la liste
        state.conversations = [conversation, ...state.conversations.filter(c => c._id !== conversationId)];
      }
    },
    
    updateMessageStatus: (state, action) => {
      const { messageId, status, readBy } = action.payload;
      
      Object.values(state.messages).forEach(conversation => {
        const message = conversation.messages.find(m => m._id === messageId);
        if (message) {
          if (status) message.status = status;
          if (readBy) message.readBy = readBy;
        }
      });
    },
    
    addMessageReaction: (state, action) => {
      const { messageId, reaction } = action.payload;
      
      Object.values(state.messages).forEach(conversation => {
        const message = conversation.messages.find(m => m._id === messageId);
        if (message) {
          if (!message.reactions) message.reactions = [];
          // Supprimer l'ancienne réaction de l'utilisateur
          message.reactions = message.reactions.filter(r => r.user !== reaction.user);
          message.reactions.push(reaction);
        }
      });
    },
    
    // Indicateurs de frappe
    setTypingUsers: (state, action) => {
      const { conversationId, users } = action.payload;
      state.typingUsers[conversationId] = users;
    },
    
    addTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = [];
      }
      if (!state.typingUsers[conversationId].includes(userId)) {
        state.typingUsers[conversationId].push(userId);
      }
    },
    
    removeTypingUser: (state, action) => {
      const { conversationId, userId } = action.payload;
      if (state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = state.typingUsers[conversationId].filter(id => id !== userId);
      }
    },
    
    // Conversations
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    
    // Statuts en temps réel
    addNewStatus: (state, action) => {
      const status = action.payload;
      
      // Éviter les doublons
      const exists = state.statuses.feed.find(s => s._id === status._id);
      if (!exists) {
        state.statuses.feed.unshift(status);
      }
    },
    
    updateStatusReaction: (state, action) => {
      const { statusId, reaction } = action.payload;
      
      // Mettre à jour dans tous les tableaux de statuts
      [state.statuses.feed, state.statuses.myStatuses, ...Object.values(state.statuses.userStatuses)].forEach(statusArray => {
        const status = statusArray.find(s => s._id === statusId);
        if (status) {
          if (!status.reactions) status.reactions = [];
          // Supprimer l'ancienne réaction de l'utilisateur
          status.reactions = status.reactions.filter(r => r.user !== reaction.user);
          status.reactions.push(reaction);
        }
      });
    },
    
    updateStatusViews: (state, action) => {
      const { statusId, view } = action.payload;
      
      [state.statuses.feed, state.statuses.myStatuses, ...Object.values(state.statuses.userStatuses)].forEach(statusArray => {
        const status = statusArray.find(s => s._id === statusId);
        if (status) {
          if (!status.views) status.views = [];
          const existingView = status.views.find(v => v.user === view.user);
          if (!existingView) {
            status.views.push(view);
          }
        }
      });
    },
    
    // Appels en temps réel
    setIncomingCall: (state, action) => {
      state.incomingCall = action.payload;
    },
    
    setActiveCall: (state, action) => {
      state.activeCall = action.payload;
    },
    
    updateCallStatus: (state, action) => {
      const { callId, status, participants } = action.payload;
      
      if (state.activeCall && state.activeCall._id === callId) {
        if (status) state.activeCall.status = status;
        if (participants) state.activeCall.participants = participants;
      }
      
      if (state.incomingCall && state.incomingCall._id === callId) {
        if (status) state.incomingCall.status = status;
        if (participants) state.incomingCall.participants = participants;
      }
    },
    
    clearIncomingCall: (state) => {
      state.incomingCall = null;
    },
    
    clearActiveCall: (state) => {
      state.activeCall = null;
    },
    
    // Réinitialisation des erreurs
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.error[errorType]) {
        state.error[errorType] = null;
      }
    },
    
    // Réinitialisation complète
    resetSpeakjerr: (state) => {
      return initialState;
    },
  },
  
  extraReducers: (builder) => {
    // Messages
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error.conversations = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = action.payload.data;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error.conversations = action.payload;
      })
      
      .addCase(fetchMessages.pending, (state) => {
        state.loading.messages = true;
        state.error.messages = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        const { conversationId, data, pagination } = action.payload;
        
        // Vérifier que data existe (pour gérer les réponses 304 Not Modified)
        if (!data) {
          return; // Ne rien faire si data est undefined
        }
        
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = { messages: [], pagination: {} };
        }
        
        if (pagination && pagination.page === 1) {
          state.messages[conversationId].messages = data;
        } else if (pagination) {
          state.messages[conversationId].messages = [...data, ...state.messages[conversationId].messages];
        }
        
        if (pagination) {
          state.messages[conversationId].pagination = pagination;
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error.messages = action.payload;
      })
      
      .addCase(sendMessage.fulfilled, (state, action) => {
        // Le message sera ajouté via WebSocket
      })
      
      // Statuts
      .addCase(fetchStatuses.pending, (state) => {
        state.loading.statuses = true;
        state.error.statuses = null;
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.loading.statuses = false;
        const { type, data, pagination } = action.payload;
        
        console.log('🔍 fetchStatuses.fulfilled - Payload reçu:', action.payload);
        console.log('🔍 Type:', type, 'Data:', data, 'Pagination:', pagination);
        
        // Vérifier que data existe (pour gérer les réponses 304 Not Modified)
        if (!data) {
          console.log('⚠️ Aucune donnée reçue (réponse 304 ou data undefined)');
          return; // Ne rien faire si data est undefined
        }
        
        // Filtrer les statuts valides
        const validStatuses = (data || []).filter(status => status && status._id);
        console.log('✅ Statuts valides filtrés:', validStatuses.length, validStatuses);
        
        console.log('🔍 État avant mise à jour - feed length:', state.statuses.feed.length, 'myStatuses length:', state.statuses.myStatuses.length);
        
        if (type === 'feed') {
          if (pagination && pagination.page === 1) {
            state.statuses.feed = validStatuses;
            console.log('✅ État mis à jour (feed page 1) - feed length:', state.statuses.feed.length);
          } else if (pagination) {
            state.statuses.feed = [...state.statuses.feed, ...validStatuses];
            console.log('✅ État mis à jour (feed pagination) - feed length:', state.statuses.feed.length);
          }
          if (pagination) {
            state.statusesPagination.feed = pagination;
          }
        } else if (type === 'my') {
          if (pagination && pagination.page === 1) {
            state.statuses.myStatuses = validStatuses;
            console.log('✅ État mis à jour (my page 1) - myStatuses length:', state.statuses.myStatuses.length);
          } else if (pagination) {
            state.statuses.myStatuses = [...state.statuses.myStatuses, ...validStatuses];
            console.log('✅ État mis à jour (my pagination) - myStatuses length:', state.statuses.myStatuses.length);
          }
          if (pagination) {
            state.statusesPagination.myStatuses = pagination;
          }
        } else {
          console.log('⚠️ Type non reconnu:', type);
        }
        
        console.log('🔍 État final - feed length:', state.statuses.feed.length, 'myStatuses length:', state.statuses.myStatuses.length);
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.loading.statuses = false;
        state.error.statuses = action.payload;
      })
      
      .addCase(createStatus.fulfilled, (state, action) => {
        // Ajouter le nouveau statut directement à l'état
        const newStatus = action.payload.data;
        if (newStatus && newStatus._id) {
          state.statuses.feed.unshift(newStatus);
          state.statuses.myStatuses.unshift(newStatus);
        }
      })
      
      .addCase(fetchMyStatuses.pending, (state) => {
        state.loading.statuses = true;
        state.error.statuses = null;
      })
      .addCase(fetchMyStatuses.fulfilled, (state, action) => {
        state.loading.statuses = false;
        const { type, data, pagination } = action.payload;
        
        console.log('🔍 fetchMyStatuses.fulfilled - Payload reçu:', action.payload);
        console.log('🔍 Type:', type, 'Data:', data, 'Pagination:', pagination);
        
        // Vérifier que data existe (pour gérer les réponses 304 Not Modified)
        if (!data) {
          console.log('⚠️ Aucune donnée reçue pour mes statuts (réponse 304 ou data undefined)');
          return; // Ne rien faire si data est undefined
        }
        
        // Filtrer les statuts valides
        const validStatuses = (data || []).filter(status => status && status._id);
        console.log('✅ Mes statuts valides filtrés:', validStatuses.length, validStatuses);
        
        console.log('🔍 État avant mise à jour - myStatuses length:', state.statuses.myStatuses.length);
        console.log('🔍 Conditions - type === "my":', type === 'my', 'pagination:', pagination);
        
        if (type === 'my') {
          console.log('✅ Condition type === "my" respectée');
          if (pagination && pagination.page === 1) {
            console.log('✅ Mise à jour page 1 avec', validStatuses.length, 'statuts');
            state.statuses.myStatuses = validStatuses;
            console.log('✅ État mis à jour (page 1) - myStatuses length:', state.statuses.myStatuses.length);
          } else if (pagination) {
            console.log('✅ Mise à jour pagination avec', validStatuses.length, 'statuts');
            state.statuses.myStatuses = [...state.statuses.myStatuses, ...validStatuses];
            console.log('✅ État mis à jour (pagination) - myStatuses length:', state.statuses.myStatuses.length);
          } else {
            console.log('⚠️ Pas de pagination trouvée, mise à jour directe avec', validStatuses.length, 'statuts');
            // Mettre à jour directement même sans pagination
            state.statuses.myStatuses = validStatuses;
            console.log('✅ État mis à jour (sans pagination) - myStatuses length:', state.statuses.myStatuses.length);
          }
          if (pagination) {
            state.statusesPagination.myStatuses = pagination;
            console.log('✅ Pagination mise à jour:', pagination);
          }
        } else {
          console.log('⚠️ Type ne correspond pas à "my":', type);
        }
        
        console.log('🔍 État final - myStatuses length:', state.statuses.myStatuses.length);
      })
      .addCase(fetchMyStatuses.rejected, (state, action) => {
        state.loading.statuses = false;
        state.error.statuses = action.payload;
      })
      
      // Appels
      .addCase(fetchCallHistory.pending, (state) => {
        state.loading.calls = true;
        state.error.calls = null;
      })
      .addCase(fetchCallHistory.fulfilled, (state, action) => {
        state.loading.calls = false;
        const { data, pagination } = action.payload;
        
        // Vérifier que data existe (pour gérer les réponses 304 Not Modified)
        if (!data) {
          return; // Ne rien faire si data est undefined
        }
        
        if (pagination && pagination.page === 1) {
          state.callHistory = data;
        } else if (pagination) {
          state.callHistory = [...state.callHistory, ...data];
        }
        
        if (pagination) {
          state.callHistoryPagination = pagination;
        }
      })
      .addCase(fetchCallHistory.rejected, (state, action) => {
        state.loading.calls = false;
        state.error.calls = action.payload;
      })
      
      .addCase(initiateCall.fulfilled, (state, action) => {
        state.activeCall = action.payload;
      })
      
      .addCase(answerCall.fulfilled, (state, action) => {
        state.activeCall = action.payload;
        state.incomingCall = null;
      })
      
      .addCase(endCall.fulfilled, (state) => {
        state.activeCall = null;
        state.incomingCall = null;
      })
      
      // Groupes
      .addCase(fetchGroups.pending, (state) => {
        state.loading.groups = true;
        state.error.groups = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading.groups = false;
        const { data, pagination } = action.payload;
        
        // Vérifier que data existe (pour gérer les réponses 304 Not Modified)
        if (!data) {
          return; // Ne rien faire si data est undefined
        }
        
        if (pagination && pagination.page === 1) {
          state.groups = data;
        } else if (pagination) {
          state.groups = [...state.groups, ...data];
        }
        
        if (pagination) {
          state.groupsPagination = pagination;
        }
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading.groups = false;
        state.error.groups = action.payload;
      })
      
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
      });
  },
});

// Actions
export const {
  setSocketConnected,
  setSocketError,
  addNewMessage,
  updateMessageStatus,
  addMessageReaction,
  setTypingUsers,
  addTypingUser,
  removeTypingUser,
  setActiveConversation,
  addNewStatus,
  updateStatusReaction,
  updateStatusViews,
  setIncomingCall,
  setActiveCall,
  updateCallStatus,
  clearIncomingCall,
  clearActiveCall,
  clearError,
  resetSpeakjerr,
} = speakjerrSlice.actions;

// Sélecteurs
export const selectConversations = (state) => state.speakjerr.conversations;
export const selectActiveConversation = (state) => state.speakjerr.activeConversation;
export const selectAllMessages = (state) => state.speakjerr.messages;
export const selectAllTypingUsers = (state) => state.speakjerr.typingUsers;

// Memoized selectors
export const selectMessages = createSelector(
  [selectAllMessages, (state, conversationId) => conversationId],
  (messages, conversationId) => messages[conversationId]?.messages || []
);

export const selectTypingUsers = createSelector(
  [selectAllTypingUsers, (state, conversationId) => conversationId],
  (typingUsers, conversationId) => typingUsers[conversationId] || []
);

export const selectStatusesFeed = (state) => state.speakjerr.statuses?.feed || [];
export const selectMyStatuses = (state) => state.speakjerr.statuses?.myStatuses || [];
export const selectAllUserStatuses = (state) => state.speakjerr.statuses?.userStatuses || {};

export const selectUserStatuses = createSelector(
  [selectAllUserStatuses, (state, userId) => userId],
  (userStatuses, userId) => userStatuses[userId] || []
);

export const selectActiveCall = (state) => state.speakjerr.activeCall;
export const selectIncomingCall = (state) => state.speakjerr.incomingCall;
export const selectCallHistory = (state) => state.speakjerr.callHistory;

export const selectGroups = (state) => state.speakjerr.groups;

export const selectSocketConnected = (state) => state.speakjerr.socketConnected;
export const selectLoading = (state) => state.speakjerr.loading || {};
export const selectErrors = (state) => state.speakjerr.error || {};

export default speakjerrSlice.reducer;