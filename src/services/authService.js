import api from './api';

// ═══════════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION SERVICE - Mengelola JWT Token & User Session
// ═══════════════════════════════════════════════════════════════
// Service ini bertanggung jawab untuk:
// - Login/Logout
// - Verify token
// - Cek session expiry
// - Manage localStorage untuk authentication

export const authService = {
  
  // ═══════════════════════════════════════════════════════════════
  // 📝 LOGIN - Kirim email & password ke backend
  // ═══════════════════════════════════════════════════════════════
  login: async (credentials) => {
    try {
      // 1. Kirim credentials (email & password) ke backend
      //    Backend akan validate dan return JWT token jika valid
      const response = await api.post('/auth/login', credentials);
      
      // 2. Return response yang berisi token dan user data
      //    Component akan handle menyimpan token ke localStorage
      return response.data;
    } catch (error) {
      // Throw error untuk di-handle di component (Login.jsx)
      throw error.response?.data || error.message;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 📝 REGISTER - Daftar user baru
  // ═══════════════════════════════════════════════════════════════
  register: async (userData) => {
    try {
      // 1. Kirim data user baru ke backend
      //    Backend akan validate dan buat user di database
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🚪 LOGOUT - Logout user & bersihkan session
  // ═══════════════════════════════════════════════════════════════
  logout: async () => {
    try {
      // 1. Panggil API logout dari backend
      //    Backend akan invalidate session jika perlu
      await api.post('/auth/logout');
    } catch (error) {
      // Tetap lanjut logout meskipun API call gagal
      // (mungkin token sudah expired atau network error)
      console.error('Logout error:', error);
    } finally {
      // 2. SELALU hapus semua authentication data dari localStorage
      //    finally block = dijalankan baik success atau error
      localStorage.removeItem('authToken');         // JWT token
      localStorage.removeItem('userEmail');         // Email user
      localStorage.removeItem('userData');          // Profile user
      localStorage.removeItem('rememberedEmail');   // Remember me checkbox
      localStorage.removeItem('isLoggedIn');        // Login flag
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ✅ IS LOGGED IN - Cek apakah user sedang login
  // ═══════════════════════════════════════════════════════════════
  // Digunakan untuk protected routes & conditional rendering
  isLoggedIn: () => {
    // 1. Cek apakah token ada di localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('❌ No token found');
      return false; // Tidak ada token = belum login
    }
    
    // 2. Bonus: Cek apakah token sudah expired
    //    Token yang expired = tidak valid
    if (authService.isTokenExpired()) {
      console.warn('⚠️ Token sudah expired');
      authService.logout();  // Logout otomatis jika expired
      return false;
    }
    
    // 3. Token ada dan belum expired = user login
    return true;
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔑 GET TOKEN - Ambil token dari localStorage
  // ═══════════════════════════════════════════════════════════════
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // ═══════════════════════════════════════════════════════════════
  // 👤 GET USER DATA - Ambil profile user dari localStorage
  // ═══════════════════════════════════════════════════════════════
  getUserData: () => {
    // 1. Ambil userData string dari localStorage
    const userData = localStorage.getItem('userData');
    
    // 2. Parse JSON ke object, atau return null jika tidak ada
    return userData ? JSON.parse(userData) : null;
  },

  // ═══════════════════════════════════════════════════════════════
  // ⏰ IS TOKEN EXPIRED - Cek apakah token sudah kadaluarsa
  // ═══════════════════════════════════════════════════════════════
  // JWT punya field 'exp' (expiry time) yang bisa di-decode
  // Tidak perlu verifikasi dengan backend untuk cek ini
  isTokenExpired: () => {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem('authToken');
    if (!token) return true; // Tidak ada token = considered expired
    
    try {
      // ─────────────────────────────────────────────
      // JWT FORMAT: header.payload.signature
      // Contoh: eyJhbGc.eyJleHA.QVFBQQ
      // ─────────────────────────────────────────────
      
      // 2. Decode JWT payload
      //    Split token by '.' dan ambil bagian tengah (payload)
      //    atob() = decode base64
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 3. Ambil waktu sekarang dalam seconds (tidak milliseconds)
      const currentTime = Date.now() / 1000;
      
      // 4. Log untuk debugging
      console.log('🔍 Token expiry check:', {
        exp: new Date(payload.exp * 1000),  // Convert ke readable date
        now: new Date(),
        expired: payload.exp < currentTime
      });

      // 5. Return true jika token expired (exp < current time)
      return payload.exp < currentTime;
    } catch (error) {
      // Jika gagal decode = anggap token invalid
      console.error('❌ Gagal decode token:', error);
      return true;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // 🔒 VERIFY TOKEN - Verify token dengan backend
  // ═══════════════════════════════════════════════════════════════
  // Ini lebih aman daripada decode local
  // Backend akan verify signature & database state
  verifyToken: async () => {
    try {
      // 1. Ambil token dari localStorage
      const token = localStorage.getItem('authToken');
      if (!token) return false; // Tidak ada token = invalid
      
      // 2. Kirim request ke backend /auth/verify
      //    api.js akan automatically add Bearer token di header
      const response = await api.get('/auth/verify');
      
      // 3. Return true jika response status 200 (success)
      return response.status === 200;
    } catch (error) {
      // Backend return error = token invalid
      console.error('❌ Token verification failed:', error);
      return false;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ⏱️ GET TOKEN EXPIRY TIME - Ambil waktu expiry token (milliseconds)
  // ═══════════════════════════════════════════════════════════════
  getTokenExpiryTime: () => {
    // 1. Ambil token dari localStorage
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      // 2. Decode JWT payload seperti sebelumnya
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // 3. Return exp dalam milliseconds (× 1000)
      //    exp dari JWT dalam seconds, kita convert ke milliseconds
      return payload.exp * 1000;
    } catch (error) {
      console.error('❌ Gagal decode token:', error);
      return null;
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // ⏳ GET SESSION TIME REMAINING - Hitung sisa waktu session
  // ═══════════════════════════════════════════════════════════════
  // Digunakan untuk menampilkan countdown timer di sidebar
  getSessionTimeRemaining: () => {
    // 1. Ambil waktu expiry token
    const expiryTime = authService.getTokenExpiryTime();
    if (!expiryTime) return null;
    
    // 2. Hitung sisa waktu: expiry time - waktu sekarang
    const now = Date.now();
    const timeRemaining = expiryTime - now;
    
    // 3. Jika negative = sudah expired
    if (timeRemaining < 0) return null;
    
    // 4. Convert milliseconds ke hours & minutes
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));  // 1 jam = 1000ms × 60 × 60
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));  // Remaining minutes
    
    // 5. Return object dengan breakdown waktu
    return { hours, minutes, totalMs: timeRemaining };
  },
};