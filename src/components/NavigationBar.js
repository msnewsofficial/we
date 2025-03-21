import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/NavigationBar.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/games', icon: '🎮', label: 'Games' },
    { path: '/wallet', icon: '💰', label: 'Wallet' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaders' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <div className="navigation-bar">
      {navItems.map(item => (
        <motion.div
          key={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
          whileTap={{ scale: 0.9 }}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
          {location.pathname === item.path && (
            <motion.div 
              className="nav-indicator"
              layoutId="indicator"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default NavigationBar; 