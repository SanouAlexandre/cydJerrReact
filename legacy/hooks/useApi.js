// Hooks React Query pour CydJerr Nation
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api/apiClient';
import authService from '../services/api/authService';
import userService from '../services/api/userService';
import { ENDPOINTS } from '../config/api';
import { setAuthenticatedUser, clearUser } from '../redux/userSlice';
import { saveAuthData } from '../services/api/apiClient';

// Clés de requête pour React Query
export const QUERY_KEYS = {
  // Authentification
  AUTH: {
    ME: ['auth', 'me'],
    STATUS: ['auth', 'status'],
  },
  // Utilisateurs
  USERS: {
    PROFILE: (userId) => ['users', 'profile', userId],
    LIST: (filters) => ['users', 'list', filters],
    SEARCH: (query) => ['users', 'search', query],
  },
  // Posts
  POSTS: {
    LIST: (filters) => ['posts', 'list', filters],
    DETAIL: (postId) => ['posts', 'detail', postId],
    USER_POSTS: (userId) => ['posts', 'user', userId],
    SEARCH: (query) => ['posts', 'search', query],
    VIDEOS: (filters) => ['posts', 'videos', filters],
    SHORTS: (filters) => ['posts', 'shorts', filters],
    UPLOAD: ['posts', 'upload'],
  },
  // Cours
  COURSES: {
    LIST: (filters) => ['courses', 'list', filters],
    DETAIL: (slug) => ['courses', 'detail', slug],
    INSTRUCTOR: (instructorId) => ['courses', 'instructor', instructorId],
  },
  // Projets
  PROJECTS: {
    LIST: (filters) => ['projects', 'list', filters],
    DETAIL: (slug) => ['projects', 'detail', slug],
    USER_PROJECTS: (userId) => ['projects', 'user', userId],
  },
  // Emplois
  JOBS: {
    LIST: (filters) => ['jobs', 'list', filters],
    DETAIL: (slug) => ['jobs', 'detail', slug],
    SAVED: (userId) => ['jobs', 'saved', userId],
    EMPLOYER: (employerId) => ['jobs', 'employer', employerId],
  },
  // Stars
  STARS: {
    LIST: (filters) => ['stars', 'list', filters],
    DETAIL: (slug) => ['stars', 'detail', slug],
    TRENDING: ['stars', 'trending'],
    SEARCH: (query) => ['stars', 'search', query],
  },
  // Groupes
  GROUPS: {
    LIST: (filters) => ['groups', 'list', filters],
    DETAIL: (groupId) => ['groups', 'detail', groupId],
    MY_GROUPS: (userId) => ['groups', 'my', userId],
    TRENDING: ['groups', 'trending'],
  },
  // Messages
  MESSAGES: {
    CONVERSATIONS: (userId) => ['messages', 'conversations', userId],
    CONVERSATION: (conversationId) => ['messages', 'conversation', conversationId],
    UNREAD_COUNT: (userId) => ['messages', 'unread', userId],
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: (userId) => ['notifications', 'list', userId],
    UNREAD_COUNT: (userId) => ['notifications', 'unread', userId],
  },
  // Portefeuille
  WALLET: {
    BALANCE: (userId) => ['wallet', 'balance', userId],
    TRANSACTIONS: (userId, filters) => ['wallet', 'transactions', userId, filters],
    STATS: (userId) => ['wallet', 'stats', userId],
  },
  // Cloud
  CLOUD: {
    FILES: (userId, filters) => ['cloud', 'files', userId, filters],
    STATS: (userId) => ['cloud', 'stats', userId],
    SHARED: (userId) => ['cloud', 'shared', userId],
    RECENT: (userId) => ['cloud', 'recent', userId],
    FAVORITES: (userId) => ['cloud', 'favorites', userId],
  },
};

// ==================== HOOKS D'AUTHENTIFICATION ====================

// Hook pour récupérer les informations de l'utilisateur connecté
export const useAuthUser = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: () => authService.getMe(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook pour la connexion
export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: ({ email, password, rememberMe = false }) => authService.login(email, password, rememberMe),
    onSuccess: async (data) => {
      // La réponse d'authService.login a la structure: { user, accessToken, refreshToken }
      const tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      };
      
      // Sauvegarder les données d'authentification
      await saveAuthData(
        data.accessToken,
        data.refreshToken,
        data.user
      );
      
      // Mettre à jour l'état Redux
      dispatch(setAuthenticatedUser({
        user: data.user,
        tokens: tokens
      }));
      
      // Mettre à jour le cache avec les données utilisateur
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, data.user);
      // Invalider les requêtes liées à l'authentification
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.STATUS });
    },
    onError: (error) => {
      // En cas d'erreur, s'assurer que l'utilisateur n'est pas marqué comme connecté
      dispatch(clearUser());
      // console.error('Erreur de connexion dans useLogin:', error); // Commenté pour éviter l'affichage sur l'écran mobile
    },
  });
};

// Hook pour l'inscription
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData) => authService.register(userData),
  });
};

// Hook pour la déconnexion
export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Mettre à jour l'état Redux
      dispatch({ type: 'user/clearUser' });
      
      // Vider tout le cache lors de la déconnexion
      queryClient.clear();
    },
  });
};

// Hook pour mot de passe oublié
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
  });
};

// Hook pour réinitialiser le mot de passe
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, newPassword, confirmPassword }) => 
      authService.resetPassword(token, newPassword, confirmPassword),
  });
};

// Hook pour vérifier l'email
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: ({ code, email }) => authService.verifyEmail(code, email),
  });
};

// Hook pour renvoyer l'email de vérification
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: (email) => authService.resendVerificationEmail(email),
  });
};

// ==================== HOOKS UTILISATEURS ====================

// Hook pour récupérer le profil d'un utilisateur
export const useUserProfile = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.PROFILE(userId),
    queryFn: () => userService.getProfile(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour mettre à jour le profil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData) => userService.updateProfile(profileData),
    onSuccess: (data, variables) => {
      // Mettre à jour le cache du profil
      queryClient.setQueryData(QUERY_KEYS.USERS.PROFILE(data.id), data);
      // Mettre à jour les données utilisateur dans AUTH.ME
      queryClient.setQueryData(QUERY_KEYS.AUTH.ME, data);
    },
  });
};

// ==================== HOOKS POSTS ====================

// Hook pour récupérer la liste des posts
export const usePosts = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.POSTS.LIST(filters),
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: filters }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer un post spécifique
export const usePost = (postId) => {
  return useQuery({
    queryKey: QUERY_KEYS.POSTS.DETAIL(postId),
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.DETAILS.replace(':id', postId)),
    enabled: !!postId,
  });
};

// Hook pour créer un post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData) => apiClient.post(ENDPOINTS.POSTS.CREATE, postData),
    onSuccess: () => {
      // Invalider tous les caches de posts pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// Hook pour liker un post
export const useLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => apiClient.post(ENDPOINTS.POSTS.LIKE.replace(':id', postId)),
    onSuccess: (data, postId) => {
      // Mettre à jour le cache du post spécifique
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.DETAIL(postId) });
      // Invalider tous les caches de posts
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// ==================== HOOKS COURS ====================

// Hook pour récupérer la liste des cours
export const useCourses = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.LIST(filters),
    queryFn: () => apiClient.get(ENDPOINTS.COURSES.LIST, { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un cours spécifique
export const useCourse = (courseSlug) => {
  return useQuery({
    queryKey: QUERY_KEYS.COURSES.DETAIL(courseSlug),
    queryFn: () => apiClient.get(ENDPOINTS.COURSES.DETAILS.replace(':slug', courseSlug)),
    enabled: !!courseSlug,
  });
};

// ==================== HOOKS EMPLOIS ====================

// Hook pour récupérer la liste des emplois
export const useJobs = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.LIST(filters),
    queryFn: () => apiClient.get(ENDPOINTS.JOBS.LIST, { params: filters }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer un emploi spécifique
export const useJob = (jobSlug) => {
  return useQuery({
    queryKey: QUERY_KEYS.JOBS.DETAIL(jobSlug),
    queryFn: () => apiClient.get(ENDPOINTS.JOBS.DETAILS.replace(':slug', jobSlug)),
    enabled: !!jobSlug,
  });
};

// ==================== HOOKS STARS ====================

// Hook pour récupérer la liste des stars
export const useStars = (filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.STARS.LIST(filters),
    queryFn: () => apiClient.get(ENDPOINTS.STARS.LIST, { params: filters }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook pour récupérer les stars tendances
export const useTrendingStars = () => {
  return useQuery({
    queryKey: QUERY_KEYS.STARS.TRENDING,
    queryFn: () => apiClient.get(ENDPOINTS.STARS.TRENDING),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Hook pour rechercher des stars
export const useSearchStars = (query) => {
  return useQuery({
    queryKey: QUERY_KEYS.STARS.SEARCH(query),
    queryFn: () => apiClient.get(ENDPOINTS.STARS.SEARCH, { params: { q: query } }),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ==================== HOOKS NOTIFICATIONS ====================

// Hook pour récupérer les notifications
export const useNotifications = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.LIST(userId),
    queryFn: () => apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook pour récupérer le nombre de notifications non lues
export const useUnreadNotificationsCount = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT(userId),
    queryFn: () => apiClient.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT),
    enabled: !!userId,
    refetchInterval: 30 * 1000, // Rafraîchir toutes les 30 secondes
  });
};

// ==================== HOOKS PORTEFEUILLE ====================

// Hook pour récupérer le solde du portefeuille
export const useWalletBalance = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET.BALANCE(userId),
    queryFn: () => apiClient.get(ENDPOINTS.WALLET.BALANCE),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour récupérer les transactions du portefeuille
export const useWalletTransactions = (userId, filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.WALLET.TRANSACTIONS(userId, filters),
    queryFn: () => apiClient.get(ENDPOINTS.WALLET.TRANSACTIONS, { params: filters }),
    enabled: !!userId,
  });
};

// ==================== HOOKS CLOUD ====================

// Hook pour récupérer les fichiers cloud
export const useCloudFiles = (userId, filters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLOUD.FILES(userId, filters),
    queryFn: () => apiClient.get(ENDPOINTS.CLOUD.FILES, { params: filters }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer les statistiques cloud
export const useCloudStats = (userId) => {
  return useQuery({
    queryKey: QUERY_KEYS.CLOUD.STATS(userId),
    queryFn: () => apiClient.get(ENDPOINTS.CLOUD.STATS),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==================== HOOKS RECHERCHE ====================

// Hook pour la recherche globale
export const useGlobalSearch = (query) => {
  return useQuery({
    queryKey: ['search', 'global', query],
    queryFn: () => apiClient.get(ENDPOINTS.SEARCH.GLOBAL, { params: { q: query } }),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour les suggestions de recherche
export const useSearchSuggestions = (query) => {
  return useQuery({
    queryKey: ['search', 'suggestions', query],
    queryFn: () => apiClient.get(ENDPOINTS.SEARCH.SUGGESTIONS, { params: { q: query } }),
    enabled: !!query && query.length > 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ==================== HOOKS COMMENTAIRES ====================

// Hook pour récupérer les commentaires d'un post
export const usePostComments = (postId) => {
  return useQuery({
    queryKey: ['comments', 'post', postId],
    queryFn: () => apiClient.get(ENDPOINTS.COMMENTS.LIST.replace(':postId', postId)),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook pour ajouter un commentaire
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, content }) => 
      apiClient.post(ENDPOINTS.COMMENTS.CREATE.replace(':postId', postId), { content }),
    onSuccess: (data, { postId }) => {
      // Invalider les commentaires du post
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', postId] });
      // Invalider le post pour mettre à jour le nombre de commentaires
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POSTS.DETAIL(postId) });
    },
  });
};

// ==================== HOOKS CHABJERR ====================

// Hook pour récupérer le feed principal ChabJerr
export const useChabJerrFeed = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'feed',
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'feed', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer les lives actifs
export const useChabJerrLives = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'video', // Utiliser 'video' au lieu de 'status: live'
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'lives', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 30 * 1000, // 30 secondes pour les lives
    refetchInterval: 30 * 1000, // Actualisation automatique toutes les 30 secondes
    refetchOnWindowFocus: true,
  });
};

// Hook pour récupérer les contenus audio
export const useChabJerrAudio = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'recent', // Utiliser 'recent' au lieu de 'audio'
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'audio', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour démarrer un live
export const useStartLive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (liveData) => apiClient.post('/posts/live/start', liveData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'lives'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'feed'] });
    },
  });
};

// Hook pour arrêter un live
export const useStopLive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (liveId) => apiClient.post(`/posts/live/${liveId}/stop`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'lives'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'feed'] });
    },
  });
};

// Hook pour rejoindre un live
export const useJoinLive = () => {
  return useMutation({
    mutationFn: (liveId) => apiClient.post(`/posts/live/${liveId}/join`),
  });
};

// Hook pour quitter un live
export const useLeaveLive = () => {
  return useMutation({
    mutationFn: (liveId) => apiClient.post(`/posts/live/${liveId}/leave`),
  });
};

// Hook pour initier un appel audio/vidéo
export const useInitiateCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (callData) => apiClient.post('/speakjerr/call', callData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['activeCall']);
      queryClient.invalidateQueries(['callHistory']);
    }
  });
};

// Hook pour répondre à un appel
export const useAnswerCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ callId, mediaStatus }) => 
      apiClient.post(`/speakjerr/call/${callId}/answer`, { mediaStatus }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['activeCall']);
    }
  });
};

// Hook pour raccrocher un appel
export const useEndCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ callId, reason }) => 
      apiClient.post(`/speakjerr/call/${callId}/end`, { reason }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(['activeCall']);
      queryClient.invalidateQueries(['callHistory']);
    }
  });
};

// Hook pour mettre à jour le statut média d'un appel
export const useUpdateCallMedia = () => {
  return useMutation({
    mutationFn: ({ callId, mediaStatus }) => 
      apiClient.put(`/speakjerr/call/${callId}/media`, mediaStatus).then(res => res.data)
  });
};

// Hook pour récupérer l'appel actif
export const useActiveCall = () => {
  return useQuery({
    queryKey: ['call', 'active'],
    queryFn: () => apiClient.get('/speakjerr/call/active'),
    staleTime: 10 * 1000, // 10 secondes
    refetchInterval: 5 * 1000, // Actualisation toutes les 5 secondes
  });
};

// Hook pour l'historique des appels
export const useCallHistory = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    ...params
  };
  
  return useQuery({
    queryKey: ['call', 'history', defaultParams],
    queryFn: () => apiClient.get('/speakjerr/call/history', { params: defaultParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour récupérer les posts tendances ChabJerr
export const useChabJerrTrending = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'trending',
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'trending', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer les vidéos ChabJerr
export const useChabJerrVideos = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'video',
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'videos', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer les shorts ChabJerr
export const useChabJerrShorts = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'shorts',
    duration: 'short',
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'shorts', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer les posts récents ChabJerr
export const useChabJerrRecent = (params = {}) => {
  const defaultParams = {
    page: 1,
    limit: 20,
    type: 'recent',
    ...params
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'recent', defaultParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params: defaultParams }),
    staleTime: 2 * 60 * 1000, // 2 minutes pour les récents
    refetchOnWindowFocus: false,
  });
};

// Hook pour rechercher des posts ChabJerr
export const useChabJerrSearch = (query, filters = {}) => {
  const searchParams = {
    q: query,
    page: 1,
    limit: 20,
    ...filters
  };
  
  return useQuery({
    queryKey: ['chabjerr', 'search', searchParams],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.SEARCH, { params: searchParams }),
    enabled: !!query && query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour récupérer un post spécifique ChabJerr
export const useChabJerrPost = (postId) => {
  return useQuery({
    queryKey: ['chabjerr', 'post', postId],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.DETAILS.replace(':id', postId)),
    enabled: !!postId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook pour liker un post ChabJerr
export const useChabJerrLikePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => apiClient.post(ENDPOINTS.POSTS.LIKE.replace(':id', postId)),
    onSuccess: (data, postId) => {
      // Invalider les caches liés aux posts ChabJerr
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Hook pour partager un post ChabJerr
export const useChabJerrSharePost = () => {
  return useMutation({
    mutationFn: ({ postId, platform }) => 
      apiClient.post(ENDPOINTS.POSTS.SHARE.replace(':id', postId), { platform }),
  });
};

// Hook pour créer un post ChabJerr
export const useChabJerrCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData) => apiClient.post(ENDPOINTS.POSTS.CREATE, postData),
    onSuccess: () => {
      // Invalider tous les caches ChabJerr pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

// Hooks pour ChabJerrScreen - Posts et Feed (anciens hooks conservés pour compatibilité)
export const useFeed = (params = {}) => {
  return useQuery({
    queryKey: ['posts', 'feed', params],
    queryFn: () => apiClient.get(ENDPOINTS.POSTS.LIST, { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrendingPosts = (params = {}) => {
  return useQuery({
    queryKey: ['posts', 'trending', params],
    queryFn: () => apiClient.get(`${ENDPOINTS.POSTS.LIST}/trending`, { params }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useShorts = (params = {}) => {
  return useQuery({
    queryKey: ['posts', 'shorts', params],
    queryFn: () => apiClient.get(`${ENDPOINTS.POSTS.LIST}/shorts`, { params }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserPosts = (userId, params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.POSTS.USER_POSTS(userId),
    queryFn: () => apiClient.get(`${ENDPOINTS.USERS.PROFILE}/${userId}/posts`, { params }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook pour partager un post
export const useSharePost = () => {
  return useMutation({
    mutationFn: ({ postId, platform }) => apiClient.post(`${ENDPOINTS.POSTS.LIST}/${postId}/share`, { platform }),
  });
};

// Hook pour rechercher des posts
export const useSearchPosts = () => {
  return useMutation({
    mutationFn: ({ query, filters = {} }) => apiClient.get(ENDPOINTS.SEARCH.GLOBAL, { 
      params: { q: query, type: 'posts', ...filters } 
    }),
  });
};

// Hook pour liker un commentaire
export const useLikeComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (commentId) => apiClient.post(ENDPOINTS.COMMENTS.LIKE.replace(':id', commentId)),
    onSuccess: (data, commentId) => {
      // Invalider les commentaires pour rafraîchir les likes
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// ==================== HOOKS POUR UPLOAD DE VIDÉOS ====================

// Hook pour uploader une vidéo
export const useUploadVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData) => {
      return apiClient.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout pour les gros fichiers
      });
    },
    onSuccess: () => {
      // Invalider les caches des posts pour rafraîchir les listes
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// Hook pour créer un post vidéo
export const useCreateVideoPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData) => {
      // Si c'est un FormData (avec fichiers), on l'envoie directement
      if (formData instanceof FormData) {
        return apiClient.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes timeout pour les gros fichiers
        });
      }
      // Sinon, c'est un objet JSON classique
      return apiClient.post('/posts', {
        ...formData,
        type: 'video'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// Hook pour mettre à jour un post vidéo
export const useUpdateVideoPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ postId, ...updateData }) => {
      return apiClient.put(`/posts/${postId}`, updateData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'detail', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// Hook pour supprimer un post vidéo
export const useDeleteVideoPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => {
      return apiClient.delete(`/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr'] });
    },
  });
};

// Hook pour obtenir les statistiques d'une vidéo
export const useVideoStats = (postId) => {
  return useQuery({
    queryKey: ['posts', 'stats', postId],
    queryFn: () => apiClient.get(`/posts/${postId}/stats`),
    enabled: !!postId,
    staleTime: 30 * 1000, // 30 secondes
  });
};

// Hook pour incrémenter les vues d'une vidéo
export const useIncrementVideoViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId) => {
      return apiClient.post(`/posts/${postId}/view`);
    },
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['posts', 'stats', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] });
    },
  });
};

// ==================== HOOKS POUR GESTION DES LIVES AMÉLIORÉS ====================

// Hook pour créer un live avec plus d'options
export const useCreateLive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (liveData) => {
      return apiClient.post('/calls/live', {
        ...liveData,
        type: 'group',
        callType: 'video'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'lives'] });
    },
  });
};

// Hook pour mettre à jour les paramètres d'un live
export const useUpdateLive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ liveId, ...updateData }) => {
      return apiClient.put(`/calls/${liveId}`, updateData);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
      queryClient.invalidateQueries({ queryKey: ['calls', variables.liveId] });
      queryClient.invalidateQueries({ queryKey: ['chabjerr', 'lives'] });
    },
  });
};

// Hook pour obtenir les détails d'un live
export const useLiveDetails = (liveId) => {
  return useQuery({
    queryKey: ['calls', liveId],
    queryFn: () => apiClient.get(`/calls/${liveId}`),
    enabled: !!liveId,
    refetchInterval: 5000, // Rafraîchir toutes les 5 secondes
  });
};

// Hook pour obtenir les participants d'un live
export const useLiveParticipants = (liveId) => {
  return useQuery({
    queryKey: ['calls', liveId, 'participants'],
    queryFn: () => apiClient.get(`/calls/${liveId}/participants`),
    enabled: !!liveId,
    refetchInterval: 3000, // Rafraîchir toutes les 3 secondes
  });
};