import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ApiService from '../services/api';
import { selectAuth } from '../redux/userSlice';

export const useGroups = (initialPage = 1, limit = 10) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);

  const fetchGroups = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await ApiService.getGroups(pageNum, limit);
      
      if (response.success) {
        const newGroups = response.data.groups || [];
        
        if (isRefresh || pageNum === 1) {
          setGroups(newGroups);
        } else {
          setGroups(prev => [...prev, ...newGroups]);
        }
        
        setHasMore(newGroups.length === limit);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des groupes');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchGroups:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchGroups(page + 1, false);
    }
  }, [loading, hasMore, page, fetchGroups]);

  const refresh = useCallback(() => {
    fetchGroups(1, true);
  }, [fetchGroups]);

  const createGroup = useCallback(async (groupData) => {
    try {
      setLoading(true);
      const response = await ApiService.createGroup(groupData);
      
      if (response.success) {
        setGroups(prev => [response.data, ...prev]);
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de la création du groupe');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinGroup = useCallback(async (groupId) => {
    try {
      const response = await ApiService.joinGroup(groupId);
      
      if (response.success) {
        setGroups(prev => prev.map(group => 
          group._id === groupId 
            ? { 
                ...group, 
                members: response.data.members,
                isMember: true 
              }
            : group
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur joinGroup:', err);
      throw err;
    }
  }, []);

  const leaveGroup = useCallback(async (groupId) => {
    try {
      const response = await ApiService.leaveGroup(groupId);
      
      if (response.success) {
        setGroups(prev => prev.map(group => 
          group._id === groupId 
            ? { 
                ...group, 
                members: response.data.members,
                isMember: false 
              }
            : group
        ));
        return response.data;
      }
    } catch (err) {
      console.error('Erreur leaveGroup:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchGroups(1, false);
  }, []);

  return {
    groups,
    loading,
    refreshing,
    error,
    hasMore,
    fetchGroups,
    loadMore,
    refresh,
    createGroup,
    joinGroup,
    leaveGroup,
  };
};

export const useMyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Vérifier l'état d'authentification
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  const fetchMyGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getMyGroups();
      
      if (response.success) {
        setGroups(response.data.groups || []);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement de vos groupes');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchMyGroups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ne charger les groupes que si l'utilisateur est authentifié
    if (isAuthenticated && !isLoading) {
      fetchMyGroups();
    }
  }, [isAuthenticated, isLoading, fetchMyGroups]);

  return {
    groups,
    loading,
    error,
    refresh: fetchMyGroups,
  };
};

export const useTrendingGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Vérifier l'état d'authentification
  const { isAuthenticated, isLoading } = useSelector(selectAuth);

  const fetchTrendingGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getTrendingGroups();
      
      if (response.success) {
        setGroups(response.data.groups || []);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des groupes tendances');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchTrendingGroups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ne charger les groupes tendances que si l'utilisateur est authentifié
    if (isAuthenticated && !isLoading) {
      fetchTrendingGroups();
    }
  }, [isAuthenticated, isLoading, fetchTrendingGroups]);

  return {
    groups,
    loading,
    error,
    refresh: fetchTrendingGroups,
  };
};