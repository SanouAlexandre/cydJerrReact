import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ApiService from '../services/api';
import { selectAuth } from '../redux/userSlice';

export const usePosts = (initialPage = 1, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  
  // Vérifier l'état d'authentification
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  const fetchPosts = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        console.log('[usePosts] Rafraîchissement des posts...');
      } else {
        setLoading(true);
        console.log(`[usePosts] Chargement des posts page ${pageNum}...`);
      }
      setError(null);

      const response = await ApiService.getPosts(pageNum, limit);

      if (response.success) {
        const newPosts = response.data || [];
        console.log(`[usePosts] ${newPosts.length} posts récupérés pour la page ${pageNum}`);
        
        if (isRefresh || pageNum === 1) {
          setPosts(newPosts);
          setPage(1);
          console.log('[usePosts] Posts remplacés (refresh ou page 1)');
        } else {
          setPosts(prev => {
            const updatedPosts = [...prev, ...newPosts];
            console.log(`[usePosts] Posts ajoutés, total: ${updatedPosts.length}`);
            return updatedPosts;
          });
          setPage(pageNum);
        }
        
        setHasMore(newPosts.length === limit);
      } else {
        console.error('[usePosts] Erreur API:', response.message);
        throw new Error(response.message || 'Erreur lors du chargement des posts');
      }
    } catch (err) {
      setError(err.message);
      console.error('[usePosts] Erreur fetchPosts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false);
    }
  }, [loading, hasMore, page, fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const createPost = useCallback(async (postData) => {
    try {
      setLoading(true);
      const response = await ApiService.createPost(postData);
      
      if (response.success) {
        // Ajouter le nouveau post en haut de la liste
        setPosts(prev => [response.data, ...prev]);
        
        // Attendre un délai puis rafraîchir pour s'assurer que le serveur a traité le post
        setTimeout(() => {
          refresh();
        }, 1500); // Délai de 1.5 secondes
        
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la création du post');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const likePost = useCallback(async (postId) => {
    try {
      const response = await ApiService.likePost(postId);
      
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: response.data.likes,
                isLiked: response.data.isLiked 
              }
            : post
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur likePost:', err);
      throw err;
    }
  }, []);

  const sharePost = useCallback(async (postId) => {
    try {
      const response = await ApiService.sharePost(postId);
      
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, shares: response.data.shares }
            : post
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur sharePost:', err);
      throw err;
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    try {
      const response = await ApiService.deletePost(postId);
      
      if (response.success) {
        setPosts(prev => prev.filter(post => post._id !== postId));
        return true;
      }
    } catch (err) {
      console.error('Erreur deletePost:', err);
      throw err;
    }
  }, []);

  const addComment = useCallback(async (postId, content) => {
    try {
      const response = await ApiService.addComment(postId, content);
      
      if (response.success) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                comments: [...(post.comments || []), response.data]
              }
            : post
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur addComment:', err);
      throw err;
    }
  }, []);

  const getPostComments = useCallback(async (postId) => {
    try {
      const response = await ApiService.getPostComments(postId);
      
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Erreur getPostComments:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    // Ne charger les posts que si l'utilisateur est authentifié
    if (isAuthenticated && !isLoading) {
      fetchPosts(1, false);
    }
  }, [isAuthenticated, isLoading, fetchPosts]);
  return {
    posts,
    loading,
    refreshing,
    error,
    hasMore,
    fetchPosts,
    loadMore,
    refresh,
    createPost,
    likePost,
    sharePost,
    deletePost,
    addComment,
    getPostComments,
  };
};

export const useUserPosts = (userId, initialPage = 1, limit = 10) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);

  const fetchUserPosts = useCallback(async (pageNum = 1) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getUserPosts(userId, pageNum, limit);
      
      if (response.success) {
        const newPosts = response.data.posts || [];
        
        if (pageNum === 1) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        setHasMore(newPosts.length === limit);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchUserPosts:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchUserPosts(page + 1);
    }
  }, [loading, hasMore, page, fetchUserPosts]);

  useEffect(() => {
    if (userId) {
      fetchUserPosts(1);
    }
  }, [userId, fetchUserPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchUserPosts(1),
  };
};