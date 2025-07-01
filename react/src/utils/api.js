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
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Login failed. Please try again.',
      error: error,
    };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/api/auth/register', { username, email, password });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Registration failed. Please try again.',
      error: error,
    };
  }
};

// User API methods
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch user profile.',
      error: error,
    };
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const response = await api.put(`/api/user/${userId}`, data);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to update user profile.',
      error: error,
    };
  }
};

export const uploadAvatar = async (userId, formData) => {
  try {
    const response = await api.post(`/api/user/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to upload avatar.',
      error: error,
    };
  }
};

// Posts API methods
export const createPost = async (content, imageUrl) => {
  try {
    const response = await api.post('/api/posts', { content, imageUrl });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to create post.',
      error: error,
    };
  }
};

export const getFeed = async () => {
  try {
    const response = await api.get('/api/posts');
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch feed.',
      error: error,
    };
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to like post.',
      error: error,
    };
  }
};

export const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/api/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to add comment.',
      error: error,
    };
  }
};

// Messages API methods
export const sendMessage = async (recipientId, content) => {
  try {
    const response = await api.post('/api/messages', { recipientId, content });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to send message.',
      error: error,
    };
  }
};

export const getMessages = async (chatId) => {
  try {
    const response = await api.get(`/api/messages/${chatId}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch messages.',
      error: error,
    };
  }
};

// Search API methods
export const search = async (query) => {
  try {
    const response = await api.get(`/api/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to search.',
      error: error,
    };
  }
};

// Notifications API methods
export const getNotifications = async () => {
  try {
    const response = await api.get('/api/notifications');
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch notifications.',
      error: error,
    };
  }
};

export const createNotification = async (recipientId, type, content) => {
  try {
    const response = await api.post('/api/notifications', { recipientId, type, content });
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to create notification.',
      error: error,
    };
  }
};

export default api;
