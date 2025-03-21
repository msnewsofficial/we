const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  username: {
    type: String,
    sparse: true
  },
  firstName: String,
  lastName: String,
  walletAddress: String,
  balance: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  referralCode: String,
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dailyChallengeCompleted: {
    type: Date,
    default: null
  }
});

// Generate unique referral code on user creation
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema); 