import React, { createContext, useState, useEffect, useContext } from 'react';
import { WebApp } from '@twa-dev/sdk';
import { useTonConnectUI } from '@tonconnect/ui-react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tonConnectUI, wallet] = useTonConnectUI();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initData from Telegram WebApp
        const initData = WebApp.initData;
        
        if (!initData) {
          console.error('No init data available');
          setIsLoading(false);
          return;
        }
        
        // Authenticate with backend using initData
        const { data } = await api.post('/auth/telegram', { initData });
        
        setUser(data.user);
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    // Monitor wallet connection status
    if (wallet) {
      const walletAddress = wallet.account?.address;
      if (walletAddress && user) {
        // Link wallet to user account if connected
        api.post('/users/link-wallet', { userId: user.id, walletAddress });
      }
    }
  }, [wallet, user]);

  const value = {
    user,
    isLoading,
    wallet,
    tonConnectUI,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider; 