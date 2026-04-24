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

  // Format 3: { testimonials: [...] }
  if (data?.testimonials && Array.isArray(data.testimonials)) {
    return data.testimonials;
  }

  // Format 4: { result: [...] }
  if (data?.result && Array.isArray(data.result)) {
    return data.result;
  }

  return [];
};

// ✅ Helper function untuk normalize field data
const normalizeTestimonial = (item) => {
  return {
    id: item.id || item._id || Math.random(),
    // ✅ MAP FIELD YANG BENAR: customer_name
    name: 
      item.customer_name || 
      item.name || 
      item.full_name || 
      item.user_name ||
      'Anonymous',
    // ✅ MAP FIELD YANG BENAR: massage (dari database)
    text: 
      item.massage ||
      item.message ||
      item.text || 
      item.description ||
      item.comment ||
      item.review ||
      'Great experience!',
    // ✅ Rating
    rating: parseInt(item.rating || item.score || item.stars || 5),
  };
};

export const testimonialsService = {
  getAll: async () => {
    try {
      const response = await api.get('/testimonials');
      const parsedData = parseResponse(response.data);
      
      // ✅ Normalize setiap testimonial
      const normalizedData = parsedData.map(normalizeTestimonial);
      
      console.log('✅ Testimonials loaded successfully:', normalizedData.length, 'items');
      console.log('📋 Normalized data:', normalizedData);
      return normalizedData;
    } catch (error) {
      const errorMessage = error.message || 'Gagal memuat testimoni';
      console.error('❌ getAll error:', errorMessage);
      throw errorMessage;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/testimonials/${id}`);
      const normalized = normalizeTestimonial(response.data);
      return normalized;
    } catch (error) {
      const errorMessage = error.message || `Gagal memuat testimoni dengan ID ${id}`;
      console.error('❌ getById error:', errorMessage);
      throw errorMessage;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/testimonials', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Gagal membuat testimoni baru';
      console.error('❌ create error:', errorMessage);
      throw errorMessage;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/testimonials/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Gagal update testimoni dengan ID ${id}`;
      console.error('❌ update error:', errorMessage);
      throw errorMessage;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Gagal hapus testimoni dengan ID ${id}`;
      console.error('❌ delete error:', errorMessage);
      throw errorMessage;
    }
  },
};