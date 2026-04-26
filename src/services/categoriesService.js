import api from './api';

const parseResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data?.categories && Array.isArray(data.categories)) {
    return data.categories;
  }
  if (data?.result && Array.isArray(data.result)) {
    return data.result;
  }
  return [];
};

const normalizeCategories = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(cat => ({
    id: cat.id || cat._id,
    name: cat.name || cat.title || 'No Name',
    slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || '',
  }));
};

export const categoriesService = {
  getAll: async () => {
    try {
      console.log('📥 Fetching categories from API...');
      const response = await api.get('/categories');
      const parsedData = parseResponse(response.data);
      const normalized = normalizeCategories(parsedData);
      console.log('✅ Normalized categories:', normalized);
      return normalized;
    } catch (error) {
      console.error('❌ getAll error:', error);
      return [];
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
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};