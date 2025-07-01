import axios from 'axios';

// Base API URL
const API_URL = '/';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API methods
export const login = async (email, password) => {
  const response = await api.post('/api/login', { email, password });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post('/api/register', { username, email, password });
  return response.data;
};

// User API methods
export const getUserProfile = async (userId) => {
  const response = await api.get(`/api/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (username, email) => {
  const response = await api.put('/api/profile', { username, email });
  return response.data;
};

export const uploadAvatar = async (avatarUrl) => {
  const response = await api.post('/api/profile/avatar', { avatarUrl });
  return response.data;
};

// Posts API methods
export const createPost = async (content, imageUrl) => {
  const response = await api.post('/api/posts', { content, imageUrl });
  return response.data;
};

export const getFeed = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

export const likePost = async (postId) => {
  const response = await api.post(`/api/posts/${postId}/like`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await api.post(`/api/posts/${postId}/comments`, { content });
  return response.data;
};

// Messages API methods
export const sendMessage = async (recipientId, content) => {
  const response = await api.post('/api/messages', { recipientId, content });
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/messages/${chatId}`);
  return response.data;
};

// Search API methods
export const search = async (query) => {
  const response = await api.get(`/api/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

// Notifications API methods
export const getNotifications = async () => {
  const response = await api.get('/api/notifications');
  return response.data;
};

export const createNotification = async (recipientId, type, content) => {
  const response = await api.post('/api/notifications', { recipientId, type, content });
  return response.data;
};

export default api;
