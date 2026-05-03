import axios from 'axios';

// ═══════════════════════════════════════════════════════════════
// 🔗 KONFIGURASI AXIOS - HTTP Client untuk komunikasi dengan Backend
// ═══════════════════════════════════════════════════════════════
// Base URL sudah include /api
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('🔗 API Base URL:', API_URL);

// Membuat instance axios dengan konfigurasi standar
const api = axios.create({
  baseURL: API_URL,                         // Base URL untuk semua requests
  headers: {
    'Content-Type': 'application/json',     // Format data: JSON
  },
  timeout: 10000,                           // Maksimal tunggu response 10 detik
});

// ═══════════════════════════════════════════════════════════════
// 📤 REQUEST INTERCEPTOR - Menambahkan Token ke Header
// ═══════════════════════════════════════════════════════════════
// Fungsi ini dijalankan SEBELUM setiap request dikirim ke backend
api.interceptors.request.use(
  (config) => {
    // 1. Ambil token dari localStorage
    //    Token disimpan saat user login
    const token = localStorage.getItem('authToken');
    
    // 2. Jika token ada, tambahkan ke Authorization header
    //    Format: Authorization: Bearer <token>
    //    Backend akan mengecek token ini untuk verify user
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 3. Log request untuk debugging (lihat di browser console)
    //    Membantu tracking apa requests yang dikirim
    console.log('📤 Request:', config.method.toUpperCase(), config.baseURL + config.url);
    
    // 4. Return config yang sudah di-update dengan token
    //    Tanpa ini, request tidak akan dikirim
    return config;
  },
  
  // Error handler untuk request interceptor
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════
// ✅ RESPONSE INTERCEPTOR - Menangani Response & Error dari Backend
// ═══════════════════════════════════════════════════════════════
// Fungsi ini dijalankan SETELAH menerima response dari backend
api.interceptors.response.use(
  // Success handler - Response 2xx status code
  (response) => {
    // 1. Log successful response
    console.log('✅ Response:', response.status, 'Data:', response.data);
    
    // 2. Return response apa adanya
    //    Component akan menerima response.data untuk digunakan
    return response;
  },
  
  // Error handler - Response error atau network error
  (error) => {
    // 1. LOG SEMUA DETAIL ERROR untuk debugging
    //    Membantu identifikasi masalah apa yang terjadi
    console.error('❌ Response Error:', {
      status: error.response?.status,       // HTTP status code (401, 404, 500, dll)
      message: error.message,               // Error message dari axios
      url: error.config?.url,               // URL yang diakses
      data: error.response?.data,           // Response data dari backend
      fullError: error,                     // Full error object
    });

    // ═══════════════════════════════════════════════════════════════
    // 2. HANDLE 401 UNAUTHORIZED - Token Expired atau Invalid
    // ═══════════════════════════════════════════════════════════════
    // Status 401 = user tidak ter-autentikasi (token expired/invalid)
    if (error.response?.status === 401) {
      console.log('⚠️ Token expired atau unauthorized - Logging out...');
      
      // Hapus semua authentication data dari localStorage
      localStorage.removeItem('authToken');         // Hapus token JWT
      localStorage.removeItem('userEmail');         // Hapus email
      localStorage.removeItem('isLoggedIn');        // Hapus flag login
      
      // Redirect user ke halaman login
      window.location.href = '/login';
    }

    // ═══════════════════════════════════════════════════════════════
    // 3. HANDLE NETWORK ERROR / CORS / Connection Refused
    // ═══════════════════════════════════════════════════════════════
    // Error ini terjadi ketika:
    // - Backend tidak running
    // - CORS tidak dikonfigurasi
    // - Firewall memblokir connection
    if (error.message === 'Network Error' && !error.response) {
      console.error('⚠️ NETWORK ERROR atau CORS Issue');
      console.error('📍 Dicoba akses:', error.config?.baseURL + error.config?.url);
      console.error('🔗 Backend URL:', API_URL);
      
      // Update error message untuk user yang lebih informatif
      error.message = `Tidak bisa terhubung ke backend.\n\nPastikan:\n1. Backend berjalan di ${API_URL}\n2. Backend configure CORS untuk allow request dari ${window.location.origin}\n3. Tidak ada firewall yang block connection`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 4. HANDLE CORS ERROR
    // ═══════════════════════════════════════════════════════════════
    // CORS (Cross-Origin Resource Sharing) error = backend reject request dari domain ini
    if (error.code === 'CORS_ERROR' || error.message.includes('CORS')) {
      console.error('⚠️ CORS ERROR - Backend tidak mengizinkan request');
      error.message = `CORS Error: Backend tidak mengizinkan request dari ${window.location.origin}\n\nBackend perlu configure CORS.`;
    }

    // ═══════════════════════════════════════════════════════════════
    // 5. HANDLE TIMEOUT ERROR
    // ═══════════════════════════════════════════════════════════════
    // Timeout = request sudah menunggu 10 detik tapi backend belum respond
    if (error.code === 'ECONNABORTED') {
      console.error('⚠️ Request Timeout');
      error.message = 'Request timeout. Backend tidak merespon dalam 10 detik.';
    }

    // Reject promise agar component bisa catch error ini
    return Promise.reject(error);
  }
);

export default api;