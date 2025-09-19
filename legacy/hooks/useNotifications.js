import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ApiService from '../services/api';
import { selectAuth } from '../redux/userSlice';

export const useNotifications = (initialPage = 1, limit = 20, filters = {}) => {
  const { isAuthenticated, isLoading } = useSelector(selectAuth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await ApiService.getNotifications(pageNum, limit, filters);
      
      if (response.success) {
        const newNotifications = response.data.notifications || [];
        
        if (isRefresh || pageNum === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications(prev => [...prev, ...newNotifications]);
        }
        
        setHasMore(newNotifications.length === limit);
        setPage(pageNum);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des notifications');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchNotifications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit, filters]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await ApiService.getUnreadNotificationsCount();
      
      if (response.success) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (err) {
      console.error('Erreur fetchUnreadCount:', err);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNotifications(page + 1, false);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  const refresh = useCallback(() => {
    fetchNotifications(1, true);
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const response = await ApiService.markNotificationAsRead(notificationId);
      
      if (response.success) {
        setNotifications(prev => prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        ));
        
        // Décrémenter le compteur de non lues
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        return response.data;
      }
    } catch (err) {
      console.error('Erreur markAsRead:', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await ApiService.markAllNotificationsAsRead();
      
      if (response.success) {
        setNotifications(prev => prev.map(notification => 
          ({ ...notification, isRead: true })
        ));
        
        setUnreadCount(0);
        return response.data;
      }
    } catch (err) {
      console.error('Erreur markAllAsRead:', err);
      throw err;
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId) => {
    try {
      const response = await ApiService.deleteNotification(notificationId);
      
      if (response.success) {
        setNotifications(prev => prev.filter(notification => 
          notification._id !== notificationId
        ));
        
        // Si la notification était non lue, décrémenter le compteur
        const notification = notifications.find(n => n._id === notificationId);
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        
        return true;
      }
    } catch (err) {
      console.error('Erreur deleteNotification:', err);
      throw err;
    }
  }, [notifications]);

  const clearAll = useCallback(async () => {
    try {
      const response = await ApiService.clearAllNotifications();
      
      if (response.success) {
        setNotifications([]);
        setUnreadCount(0);
        return true;
      }
    } catch (err) {
      console.error('Erreur clearAll:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchNotifications(1, false);
      fetchUnreadCount();
    }
  }, [isAuthenticated, isLoading]);

  // Actualiser le compteur de notifications non lues périodiquement
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000); // Toutes les 30 secondes

      return () => clearInterval(interval);
    }
  }, [fetchUnreadCount, isAuthenticated, isLoading]);

  return {
    notifications,
    loading,
    refreshing,
    error,
    hasMore,
    unreadCount,
    fetchNotifications,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    fetchUnreadCount,
  };
};

export const useNotificationStats = (period = '7d') => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ApiService.getNotificationStats(period);
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des statistiques');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur fetchStats:', err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
};