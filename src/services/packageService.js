import api from './api';

// ✅ Helper function untuk handle berbagai format response
const parseResponse = (data) => {
  // Format 1: Array langsung
  if (Array.isArray(data)) {
    console.log('✅ Response format: Array langsung');
    return data;
  }

  // Format 2: { data: [...] }
  if (data?.data && Array.isArray(data.data)) {
    console.log('✅ Response format: { data: [...] }');
    return data.data;
  }

  // Format 3: { packages: [...] }
  if (data?.packages && Array.isArray(data.packages)) {
    console.log('✅ Response format: { packages: [...] }');
    return data.packages;
  }

  // Format 4: { result: [...] }
  if (data?.result && Array.isArray(data.result)) {
    console.log('✅ Response format: { result: [...] }');
    return data.result;
  }

  // Format 5: Fallback ke response.data apa pun
  console.log('⚠️ Response format tidak dikenali, menggunakan data mentah:', data);
  return data;
};

export const packageService = {
  // Ambil semua packages
  getAll: async () => {
    try {
      const response = await api.get('/packages');
      const parsedData = parseResponse(response.data);
      return parsedData;
    } catch (error) {
      const errorMessage = error.message || 'Gagal memuat paket wisata';
      console.error('❌ getAll error:', errorMessage);
      throw errorMessage;
    }
  },

  // Ambil package berdasarkan ID
  getById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Gagal memuat paket dengan ID ${id}`;
      console.error('❌ getById error:', errorMessage);
      throw errorMessage;
    }
  },

  // Buat package baru (admin only)
  create: async (data) => {
    try {
      const response = await api.post('/packages', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || 'Gagal membuat paket baru';
      console.error('❌ create error:', errorMessage);
      throw errorMessage;
    }
  },

  // Update package (admin only)
  update: async (id, data) => {
    try {
      const response = await api.put(`/packages/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Gagal update paket dengan ID ${id}`;
      console.error('❌ update error:', errorMessage);
      throw errorMessage;
    }
  },

  // Hapus package (admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.message || `Gagal hapus paket dengan ID ${id}`;
      console.error('❌ delete error:', errorMessage);
      throw errorMessage;
    }
  },
};