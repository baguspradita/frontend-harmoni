import api from './api';

// ═══════════════════════════════════════════════════════════════
// 📦 PACKAGE SERVICE - Mengelola data paket wisata dari backend
// ═══════════════════════════════════════════════════════════════
// Service ini:
// 1. Fetch packages dari backend (/api/packages)
// 2. Parse response (berbagai format)
// 3. Normalize data (standardisasi field names)
// 4. Handle CRUD operations (Create, Read, Update, Delete)

// ═══════════════════════════════════════════════════════════════
// 🔄 PARSE RESPONSE - Handle berbagai format response dari backend
// ═══════════════════════════════════════════════════════════════
// Backend mungkin return data dalam berbagai format:
// - Array langsung: [...]
// - Wrapped: { data: [...] }
// - Wrapped: { packages: [...] }
// - Wrapped: { result: [...] }
// Function ini handle semua kemungkinan itu
const parseResponse = (data) => {
  // 1. Check apakah data sudah langsung array
  if (Array.isArray(data)) {
    console.log('✅ Response format: Array langsung');
    return data;
  }
  
  // 2. Check format { data: [...] }
  if (data?.data && Array.isArray(data.data)) {
    console.log('✅ Response format: { data: [...] }');
    return data.data;
  }
  
  // 3. Check format { packages: [...] }
  if (data?.packages && Array.isArray(data.packages)) {
    console.log('✅ Response format: { packages: [...] }');
    return data.packages;
  }
  
  // 4. Check format { result: [...] }
  if (data?.result && Array.isArray(data.result)) {
    console.log('✅ Response format: { result: [...] }');
    return data.result;
  }
  
  // 5. Format tidak dikenali, log warning
  console.log('⚠️ Response format tidak dikenali:', data);
  return data;
};

// ═══════════════════════════════════════════════════════════════
// 📋 NORMALIZE PACKAGES - Standardisasi field names
// ═══════════════════════════════════════════════════════════════
// Backend mungkin punya field names berbeda:
// - 'title' atau 'name'
// - 'categoryId' atau 'category'
// - 'durasi' atau 'duration'
// Function ini convert semua ke format standard frontend
//
// ⚠️ PENTING: JANGAN normalize categoryId ke nama!
//    Admin.jsx yang akan handle mapping categoryId → category name
const normalizePackages = (data) => {
  // 1. Validasi: data harus array
  if (!Array.isArray(data)) {
    console.warn('⚠️ Data bukan array:', data);
    return [];
  }

  console.log(`📦 Normalizing ${data.length} packages...`);

  // 2. Loop setiap package dan normalize fieldnya
  return data.map((pkg, index) => {
    // Debug: Log struktur package pertama
    if (index === 0) {
      console.log(`\n🔍 FIRST PACKAGE Fields:`, Object.keys(pkg));
      console.log(`📋 First Package Full Data:`, pkg);
    }

    // 3. Buat object normalized dengan field standard
    const normalized = {
      // Field ID: cek id atau _id (mongoDB biasa pake _id)
      id: pkg.id || pkg._id,
      
      // Field Title: cek title atau name
      title: pkg.title || pkg.name || 'No Title',
      
      // ✅ PRESERVE categoryId - Admin.jsx akan mapping ke nama
      // Jangan convert ke "Uncategorized" atau kategori lain di sini!
      categoryId: pkg.categoryId,
      
      // Field Price: ambil apa adanya
      price: pkg.price,
      
      // Field Duration: cek duration atau durasi
      duration: pkg.duration || pkg.durasi || '0 Hari',
      durasi: pkg.durasi || pkg.duration || '0 Hari',
      
      // Field Description: cek description, desc
      description: pkg.description || pkg.desc || '',
      
      // Field Image: cek image atau photo
      image: pkg.image || pkg.photo || '',
      
      // Field Highlights: join array atau ambil dari field
      highlight_utama: pkg.highlight_utama || 
                       (Array.isArray(pkg.highlights) ? pkg.highlights.join(', ') : ''),
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    };

    // Debug: Log categoryId package pertama
    if (index === 0) {
      console.log(`✅ #1 Normalized (categoryId preserved):`, normalized.categoryId);
    }
    
    return normalized;
  });
};

// ═══════════════════════════════════════════════════════════════
// 🚀 PACKAGE SERVICE OBJECT - Semua method CRUD
// ═══════════════════════════════════════════════════════════════
export const packageService = {
  
  // ─────────────────────────────────────────────────────────────
  // 📥 GET ALL - Ambil semua packages dari backend
  // ─────────────────────────────────────────────────────────────
  getAll: async () => {
    try {
      // 1. Log yang sedang fetch
      console.log('📥 Fetching packages from API...');
      
      // 2. GET request ke /packages
      //    api.js akan automatically add Bearer token di header
      const response = await api.get('/packages');
      console.log('📦 Raw API response:', response.data);
      
      // 3. Debug: Log structure package pertama
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const firstPkg = response.data[0];
        console.log('\n🔴🔴🔴 FIRST PACKAGE DETAIL 🔴🔴🔴');
        console.log('Fields:', Object.keys(firstPkg));
        console.table(firstPkg);
        
        // Show each field dengan value
        console.log('\n📋 EACH FIELD WITH VALUE:');
        Object.keys(firstPkg).forEach(key => {
          console.log(`  ${key}: ${JSON.stringify(firstPkg[key])}`);
        });
      }

      // 4. Parse response (handle berbagai format)
      const parsedData = parseResponse(response.data);
      
      // 5. Normalize data (standardisasi field names)
      const normalized = normalizePackages(parsedData);

      // 6. Log result final
      console.log('✅ Normalized packages:', normalized);
      
      // 7. Return normalized packages ke component
      return normalized;
    } catch (error) {
      // Handle error
      const errorMessage = error.message || 'Gagal memuat paket wisata';
      console.error('❌ getAll error:', errorMessage, error);
      throw errorMessage;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // 🔍 GET BY ID - Ambil package berdasarkan ID
  // ─────────────────────────────────────────────────────────────
  getById: async (id) => {
    try {
      // 1. GET request ke /packages/{id}
      const response = await api.get(`/packages/${id}`);
      
      // 2. Normalize data dan return package single
      //    normalizePackages return array, ambil index [0]
      return normalizePackages([response.data])[0];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ✍️ CREATE - Buat package baru
  // ─────────────────────────────────────────────────────────────
  create: async (data) => {
    try {
      // 1. POST request ke /packages dengan data baru
      //    Backend akan create di database
      const response = await api.post('/packages', data);
      
      // 2. Return response dari backend
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ✏️ UPDATE - Update package yang sudah ada
  // ─────────────────────────────────────────────────────────────
  update: async (id, data) => {
    try {
      // 1. PUT request ke /packages/{id} dengan data update
      //    Backend akan update di database
      const response = await api.put(`/packages/${id}`, data);
      
      // 2. Return response dari backend
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ─────────────────────────────────────────────────────────────
  // 🗑️ DELETE - Hapus package
  // ─────────────────────────────────────────────────────────────
  delete: async (id) => {
    try {
      // 1. DELETE request ke /packages/{id}
      //    Backend akan delete dari database
      const response = await api.delete(`/packages/${id}`);
      
      // 2. Return response dari backend
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};