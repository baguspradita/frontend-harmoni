import api from './api';

// ✅ Helper function untuk handle berbagai format response
const parseResponse = (data) => {
  if (Array.isArray(data)) {
    console.log('✅ Response format: Array langsung');
    return data;
  }
  if (data?.data && Array.isArray(data.data)) {
    console.log('✅ Response format: { data: [...] }');
    return data.data;
  }
  if (data?.packages && Array.isArray(data.packages)) {
    console.log('✅ Response format: { packages: [...] }');
    return data.packages;
  }
  if (data?.result && Array.isArray(data.result)) {
    console.log('✅ Response format: { result: [...] }');
    return data.result;
  }
  console.log('⚠️ Response format tidak dikenali:', data);
  return data;
};

// ✅ Normalisasi data package ke format yang konsisten
const normalizePackages = (data) => {
  if (!Array.isArray(data)) {
    console.warn('⚠️ Data bukan array:', data);
    return [];
  }

  console.log(`📦 Normalizing ${data.length} packages...`);

  return data.map((pkg, index) => {
    // DEBUGGING: Log semua fields yang ada
    console.log(`\n🔍 Package #${index + 1} - Semua Fields:`, Object.keys(pkg));
    console.log(`📋 Full Data:`, pkg);

    // Ambil category dari berbagai sumber yang mungkin
    let category = 'Uncategorized';
    let categorySource = 'default';

    // Opsi 1: category adalah object dengan field name (PRIORITAS TERTINGGI)
    if (pkg.category && typeof pkg.category === 'object' && pkg.category.name) {
      category = pkg.category.name;
      categorySource = 'pkg.category.name (object)';
    }
    // Opsi 2: category langsung (string)
    else if (pkg.category && typeof pkg.category === 'string' && pkg.category.trim() !== '') {
      category = pkg.category;
      categorySource = 'pkg.category (string)';
    }
    // Opsi 3: Cari di categoryName field
    else if (pkg.categoryName && pkg.categoryName.trim() !== '') {
      category = pkg.categoryName;
      categorySource = 'pkg.categoryName';
    }
    // Opsi 4: Cari di region field
    else if (pkg.region && typeof pkg.region === 'string' && pkg.region.trim() !== '') {
      category = pkg.region;
      categorySource = 'pkg.region';
    }
    // Opsi 5: Cari di region sebagai object
    else if (pkg.region && typeof pkg.region === 'object') {
      category = pkg.region.name || pkg.region.title || 'Uncategorized';
      categorySource = 'pkg.region.name (object)';
    }
    // Opsi 6: Cari di destination atau tour_type
    else if (pkg.destination && pkg.destination.trim() !== '') {
      category = pkg.destination;
      categorySource = 'pkg.destination';
    }
    else if (pkg.tour_type && pkg.tour_type.trim() !== '') {
      category = pkg.tour_type;
      categorySource = 'pkg.tour_type';
    }

    const normalized = {
      id: pkg.id || pkg._id,
      title: pkg.title || pkg.name || 'No Title',
      category: category,
      categorySource: categorySource, // Debug info
      price: pkg.price,
      duration: pkg.duration || pkg.durasi || '0 Hari',
      durasi: pkg.durasi || pkg.duration || '0 Hari',
      description: pkg.description || pkg.desc || '',
      image: pkg.image || pkg.photo || '',
      highlight_utama: pkg.highlight_utama || (Array.isArray(pkg.highlights) ? pkg.highlights.join(', ') : ''),
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    };

    console.log(`✅ #${index + 1} Category: "${category}" (from: ${categorySource})`);
    return normalized;
  });
};

export const packageService = {
  // Ambil semua packages
  getAll: async () => {
    try {
      console.log('📥 Fetching packages from API...');
      const response = await api.get('/packages');
      console.log('📦 Raw API response:', response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const firstPkg = response.data[0];
        console.log('\n🔴🔴🔴 FIRST PACKAGE DETAIL 🔴🔴🔴');
        console.log('Fields:', Object.keys(firstPkg));
        console.table(firstPkg);
        
        // Show each field with value
        console.log('\n📋 EACH FIELD WITH VALUE:');
        Object.keys(firstPkg).forEach(key => {
          console.log(`  ${key}: ${JSON.stringify(firstPkg[key])}`);
        });
      }

      const parsedData = parseResponse(response.data);
      const normalized = normalizePackages(parsedData);

      console.log('✅ Normalized packages:', normalized);
      return normalized;
    } catch (error) {
      const errorMessage = error.message || 'Gagal memuat paket wisata';
      console.error('❌ getAll error:', errorMessage, error);
      throw errorMessage;
    }
  },

  // Ambil package berdasarkan ID
  getById: async (id) => {
    try {
      const response = await api.get(`/packages/${id}`);
      return normalizePackages([response.data])[0];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/packages', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/packages/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/packages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};