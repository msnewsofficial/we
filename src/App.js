import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WebApp } from '@twa-dev/sdk';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import WalletPage from './pages/WalletPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NavigationBar from './components/NavigationBar';
import AuthProvider from './context/AuthContext';
import './styles/App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize Telegram WebApp
    if (WebApp.isInitialized) {
      WebApp.ready();
      WebApp.expand();
      setIsLoading(false);
    }
    
    // Set theme based on Telegram color scheme
    document.documentElement.className = WebApp.colorScheme;
  }, []);

  if (isLoading) {
    return <div className="loading-screen">Loading Pitcoin...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
          <NavigationBar />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 