import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ErpContext = createContext();

export const ErpProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.data);
        const unread = res.data.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20s poll
    return () => clearInterval(interval);
  }, [fetchNotifications, refreshTrigger]);

  const triggerGlobalRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  return (
    <ErpContext.Provider value={{
      notifications,
      unreadCount,
      refreshNotifications: fetchNotifications,
      triggerGlobalRefresh,
      markAsRead
    }}>
      {children}
    </ErpContext.Provider>
  );
};

export const useErp = () => useContext(ErpContext);
