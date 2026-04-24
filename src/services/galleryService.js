import api from './api';

// ✅ Helper function untuk handle berbagai format response
const parseResponse = (data) => {
  // Format 1: Array langsung
  if (Array.isArray(data)) {
    return data;
  }

  // Format 2: { data: [...] }
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }

  // Format 3: { gallery: [...] }
  if (data?.gallery && Array.isArray(data.gallery)) {
    return data.gallery;
  }

  // Format 4: { result: [...] }
  if (data?.result && Array.isArray(data.result)) {
    return data.result;
  }

  return data;
};

export const galleryService = {
  getAll: async () => {
    try {
      const response = await api.get('/gallery');
      const parsedData = parseResponse(response.data);
      return parsedData;
    } catch (error) {
      const errorMessage = error.message || 'Gagal memuat gallery';
      console.error('❌ getAll error:', errorMessage);
      throw errorMessage;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/api/gallery', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/api/gallery/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/api/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};