import React, { createContext, useContext, useState, useEffect } from 'react';
import { getNotifications } from '../api/notifications';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    async function loadNotifs() {
      try {
        const notifs = await getNotifications();
        const unread = notifs.filter(n => !n.read).length;
        setUnreadNotifications(unread);
      } catch {
        // mock fallback
      }
    }
    loadNotifs();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ unreadNotifications, setUnreadNotifications, isOnline }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
