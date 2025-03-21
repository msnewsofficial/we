const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Verify Telegram authentication and create/update user
router.post('/telegram', async (req, res) => {
  try {
    const { initData } = req.body;
    
    if (!initData) {
      return res.status(400).json({ message: 'Missing initialization data' });
    }
    
    // Verify the initialization data (simplified for brevity)
    // In production, implement full hash verification
    const parsedData = Object.fromEntries(new URLSearchParams(initData));
    const telegramUser = JSON.parse(parsedData.user || '{}');
    
    if (!telegramUser.id) {
      return res.status(400).json({ message: 'Invalid user data' });
    }
    
    // Find or create user
    let user = await User.findOne({ telegramId: telegramUser.id });
    
    if (!user) {
      user = new User({
        telegramId: telegramUser.id,
        username: telegramUser.username,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        balance: 100, // Starting balance for new users
        createdAt: new Date()
      });
    } else {
      // Update existing user data
      user.username = telegramUser.username;
      user.firstName = telegramUser.first_name;
      user.lastName = telegramUser.last_name;
      user.lastLogin = new Date();
    }
    
    await user.save();
    
    // Generate session token for the user
    const sessionToken = crypto.randomBytes(64).toString('hex');
    
    res.status(200).json({
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance
      },
      token: sessionToken
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
});

module.exports = router; 