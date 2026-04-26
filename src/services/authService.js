import api from './api';

export const authService = {
  // Login dengan email dan password
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      // Response dari backend harus berisi token
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register user baru
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Panggil API logout dari backend
      await api.post('/auth/logout');
    } catch (error) {
      // Tetap lanjut logout meskipun API gagal
      console.error('Logout error:', error);
    } finally {
      // Selalu hapus data local
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userData');
      localStorage.removeItem('rememberedEmail');
    }
  },

  // Cek user sudah login
  isLoggedIn: () => {
    return !!localStorage.getItem('authToken');
  },

  // Ambil token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Ambil data user
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
};