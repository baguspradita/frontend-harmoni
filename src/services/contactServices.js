import api from './api';

export const contactService = {
  // Ambil semua pesan kontak
  getAll: async () => {
    try {
      const response = await api.get('/contact');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Ambil pesan kontak berdasarkan ID
  getById: async (id) => {
    try {
      const response = await api.get(`/contact/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Kirim pesan kontak (public)
  send: async (data) => {
    try {
      const response = await api.post('/contact', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update pesan kontak
  update: async (id, data) => {
    try {
      const response = await api.put(`/contact/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Hapus pesan kontak
  delete: async (id) => {
    try {
      const response = await api.delete(`/contact/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};