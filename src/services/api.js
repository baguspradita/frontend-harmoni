import axios from 'axios';

// 🔗 Backend API URL Configuration (Vite uses import.meta.env)
// Base URL sudah include /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// REQUEST INTERCEPTOR - Tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle response dan error
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, 'Data:', response.data);
    return response;
  },
  (error) => {
    // Log detail error
    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
      fullError: error,
    });

    // Handle 401 - Token Expired
    if (error.response?.status === 401) {
      console.log('⚠️ Token expired atau unauthorized');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }

    // Handle Network Error / CORS / Connection Refused
    if (error.message === 'Network Error' && !error.response) {
      console.error('⚠️ NETWORK ERROR atau CORS Issue');
      console.error('📍 Dicoba akses:', error.config?.baseURL + error.config?.url);
      console.error('🔗 Backend URL:', API_URL);
      error.message = `Tidak bisa terhubung ke backend.\n\nPastikan:\n1. Backend berjalan di ${API_URL}\n2. Backend configure CORS untuk allow request dari ${window.location.origin}\n3. Tidak ada firewall yang block connection`;
    }

    // Handle CORS error (biasanya manifests as Network Error)
    if (error.code === 'CORS_ERROR' || error.message.includes('CORS')) {
      console.error('⚠️ CORS ERROR - Backend tidak mengizinkan request');
      error.message = `CORS Error: Backend tidak mengizinkan request dari ${window.location.origin}\n\nBackend perlu configure CORS.`;
    }

    // Handle Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⚠️ Request Timeout');
      error.message = 'Request timeout. Backend tidak merespon.';
    }

    return Promise.reject(error);
  }
);

export default api;