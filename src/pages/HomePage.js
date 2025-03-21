import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          // Fetch user's Pitcoin balance
          const balanceRes = await api.get(`/users/${user.id}/balance`);
          setBalance(balanceRes.data.balance);
          
          // Fetch today's challenge
          const challengeRes = await api.get('/challenges/daily');
          setDailyChallenge(challengeRes.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="app-title"
        >
          Pitcoin
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="balance-container"
        >
          <div className="balance-label">Your Balance</div>
          <div className="balance-amount">{balance} <span className="currency">PIT</span></div>
        </motion.div>
      </header>

      <section className="daily-challenge">
        <h2>Daily Challenge</h2>
        {dailyChallenge ? (
          <motion.div 
            className="challenge-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3>{dailyChallenge.title}</h3>
            <p>{dailyChallenge.description}</p>
            <div className="reward">
              <span className="reward-label">Reward:</span>
              <span className="reward-amount">{dailyChallenge.reward} PIT</span>
            </div>
            <button className="primary-button">Start Challenge</button>
          </motion.div>
        ) : (
          <p>No daily challenge available right now. Check back soon!</p>
        )}
      </section>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <motion.div 
            className="action-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="action-icon">🎲</div>
            <div className="action-label">Play Games</div>
          </motion.div>
          <motion.div 
            className="action-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="action-icon">👥</div>
            <div className="action-label">Invite Friends</div>
          </motion.div>
          <motion.div 
            className="action-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="action-icon">🏆</div>
            <div className="action-label">Leaderboard</div>
          </motion.div>
          <motion.div 
            className="action-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="action-icon">💰</div>
            <div className="action-label">Wallet</div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 