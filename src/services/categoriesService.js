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

  // Format 3: { categories: [...] }
  if (data?.categories && Array.isArray(data.categories)) {
    return data.categories;
  }

  // Format 4: { result: [...] }
  if (data?.result && Array.isArray(data.result)) {
    return data.result;
  }

  return data;
};

export const categoriesService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      const parsedData = parseResponse(response.data);
      return parsedData;
    } catch (error) {
      const errorMessage = error.message || 'Gagal memuat kategori';
      console.error('❌ getAll error:', errorMessage);
      throw errorMessage;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/api/categories', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/api/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};