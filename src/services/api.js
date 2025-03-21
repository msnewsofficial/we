import axios from 'axios';
import { WebApp } from '@twa-dev/sdk';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.pitcoin-app.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(config => {
  // Include Telegram init data in every request for auth verification
  if (WebApp.initData) {
    config.headers['Telegram-Data'] = WebApp.initData;
  }
  
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      console.error('Authentication error');
      // Could trigger re-auth here
    }
    return Promise.reject(error);
  }
);

export default api; 