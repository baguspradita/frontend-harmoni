import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCalendar, HiSparkles } from "react-icons/hi";
import { packages, packageCategories } from "../data/packages";
import AdminSidebar from "../components/AdminSidebar";
import DashboardTab from "../components/admin/DashboardTab";
import PackagesTab from "../components/admin/PackagesTab";
import CategoriesTab from "../components/admin/CategoriesTab";
import TestimonialsTab from "../components/admin/TestimonialsTab";
import { testimonials } from "../data/testimonials";
import GalleryTab from "../components/admin/GalleryTab";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════════════
// 📥 IMPORT SERVICES - Mengambil services untuk API calls
// ═══════════════════════════════════════════════════════════════
import { packageService } from "../services/packageService";
import { categoriesService } from "../services/categoriesService";
import { testimonialsService } from "../services/testimonialsService";
import { galleryService } from "../services/galleryService";
import { authService } from "../services/authService";

// ═══════════════════════════════════════════════════════════════
// 🏢 ADMIN COMPONENT - Main dashboard untuk admin
// ═══════════════════════════════════════════════════════════════
// Component ini:
// 1. Verify token saat mount (protected page)
// 2. Fetch data dari backend (packages, categories, testimonials, gallery)
// 3. Manage state untuk semua CRUD operations
// 4. Render tabs (Dashboard, Packages, Categories, Testimonials, Gallery)

export default function Admin() {
  const navigate = useNavigate();

  // ═══════════════════════════════════════════════════════════════
  // 🔐 VERIFY TOKEN ON MOUNT - Cek user authenticated saat component load
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        // 1. Verify token dengan backend
        //    Ini adalah security check untuk ensure user login
        const isValid = await authService.verifyToken();
        
        // 2. Jika token invalid, logout dan redirect ke login
        if (!isValid) {
          console.log('⚠️ Token tidak valid, logout...');
          authService.logout();
          navigate("/login");
          return;
        }
        
        // 3. Jika token valid, fetch semua data yang diperlukan
        fetchData();
      } catch (error) {
        console.error('❌ Error verifying token:', error);
        // Error saat verify = logout
        navigate("/login");
      }
    };

    // Jalankan verification saat component mount
    verifyAndFetch();
  }, [navigate]);

  // ═══════════════════════════════════════════════════════════════
  // 📊 STATE INITIALIZATION - Semua state untuk admin dashboard
  // ═══════════════════════════════════════════════════════════════
  
  // UI State - Tab yang sedang aktif
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Data State - Data dari API yang ditampilkan di UI
  const [packageList, setPackageList] = useState([]);         // Semua packages
  const [categoryList, setCategoryList] = useState([]);       // Semua categories
  const [testimonialList, setTestimonialList] = useState([]); // Semua testimonials
  const [galleryList, setGalleryList] = useState([]);         // Semua gallery items
  
  // Form State - Packages form
  const [showForm, setShowForm] = useState(false);            // Show/hide form
  const [editingId, setEditingId] = useState(null);           // ID yang sedang di-edit (null = create baru)
  const [searchQuery, setSearchQuery] = useState("");         // Search filter
  
  // Form State - Categories form
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  
  // Form State - Testimonials form
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
  const [searchTestQuery, setSearchTestQuery] = useState("");
  
  // Form State - Gallery form
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [searchGalleryQuery, setSearchGalleryQuery] = useState("");

  // Form Data State - Package form data
  const [formData, setFormData] = useState({
    title: "",                // Nama package
    category: "",             // Category ID
    price: "",                // Harga
    durasi: "",               // Durasi perjalanan
    description: "",          // Deskripsi
    image: "",                // URL gambar
    highlight_utama: "",      // Highlight utama
  });

  // Form Data State - Categories form data
  const [catFormData, setCatFormData] = useState({ 
    name: "",  // Nama category
    slug: ""   // Slug untuk URL
  });
  
  // Form Data State - Testimonials form data
  const [testFormData, setTestFormData] = useState({
    name: "",          // Nama orang yang testimonial
    title: "",         // Title/posisi
    image: "",         // Foto
    package: "",       // Package yang di-review
    rating: 5,         // Rating 1-5
    text: ""           // Teks testimonial
  });
  
  // Form Data State - Gallery form data
  const [galleryFormData, setGalleryFormData] = useState({
    title: "",         // Judul foto
    category: "",      // Category foto
    image: "",         // URL gambar
    description: ""    // Deskripsi
  });

  // ═══════════════════════════════════════════════════════════════
  // 🎯 GET CATEGORY NAME - Map categoryId ke category name
  // ═══════════════════════════════════════════════════════════════
  // MASALAH: Backend return categoryId (angka), tapi UI butuh category name (string)
  // SOLUSI: Function ini map ID ke nama dengan mencari di categoryList
  //
  // FLOW:
  // 1. Package dari backend: { id: 1, name: "Bali", categoryId: 2 }
  // 2. Category dari backend: { id: 2, name: "Yogyakarta" }
  // 3. Function ini: categoryId 2 → "Yogyakarta"
  // 4. PackagesTab show: "Yogyakarta" di table
  
  const getCategoryName = (categoryId, categoryList) => {
    // 1. VALIDASI - Cek input tidak null/undefined
    if (!categoryId || !categoryList || categoryList.length === 0) {
      console.warn('⚠️ getCategoryName: Missing categoryId or categoryList');
      return 'Uncategorized'; // Default jika data tidak lengkap
    }
    
    // 2. CONVERT KE NUMBER - categoryId bisa string atau number
    //    Database bisa return categoryId sebagai "2" (string) atau 2 (number)
    //    Convert ke number untuk consistent comparison
    const idNum = Number(categoryId);
    console.log(
      `🔍 getCategoryName: Looking for categoryId=${idNum} in`, 
      categoryList.map(c => ({ id: c.id, name: c.name }))
    );
    
    // 3. FIND - Cari category dengan ID yang match
    //    categoryList.find() return category object atau undefined
    const found = categoryList.find(cat => {
      // Convert category ID juga ke number untuk matching
      const catIdNum = Number(cat.id);
      return catIdNum === idNum;
    });
    
    // 4. LOG RESULT - Debug logging
    console.log(
      `📌 getCategoryName result: "${found?.name || 'Uncategorized'}" (found: ${found ? 'YES' : 'NO'})`
    );
    
    // 5. RETURN - Return category name atau 'Uncategorized' jika tidak ketemu
    return found?.name || 'Uncategorized';
  };

  // ═══════════════════════════════════════════════════════════════
  // 🔄 FETCH DATA - Ambil semua data dari backend APIs
  // ═══════════════════════════════════════════════════════════════
  // Function ini coordinate semua API calls dan update state
  // FLOW:
  // 1. Fetch categories DULU (diprioritaskan)
  // 2. Fetch packages
  // 3. Map categoryId → category name (di Admin component, bukan di service)
  // 4. Fetch testimonials & gallery paralel dengan Promise.all()
  // 5. Set state dengan data yang sudah clean
  
  const fetchData = async () => {
    try {
      console.log('🔄 Fetching data from APIs...');

      // ─────────────────────────────────────────────────────────────
      // STEP 1: Fetch Categories (PRIORITAS TINGGI)
      // ─────────────────────────────────────────────────────────────
      // Categories di-fetch dulu karena digunakan untuk mapping package categories
      const cats = await categoriesService.getAll();
      console.log('✅ Categories loaded:', cats);
      console.log(
        '📊 Categories struktur:', 
        cats.map(c => ({ id: c.id, idType: typeof c.id, name: c.name }))
      );

      // ─────────────────────────────────────────────────────────────
      // STEP 2: Fetch Packages
      // ─────────────────────────────────────────────────────────────
      // Package berisi categoryId (angka), bukan category name
      const pkgsRaw = await packageService.getAll();
      console.log('📦 Packages raw:', pkgsRaw);
      
      // Debug: Lihat struktur package pertama
      if (pkgsRaw.length > 0) {
        const firstPkg = pkgsRaw[0];
        console.log('🔍 FIRST PACKAGE DEBUG:', {
          id: firstPkg.id,
          name: firstPkg.name,
          categoryId: firstPkg.categoryId,
          categoryIdType: typeof firstPkg.categoryId,
          allFields: Object.keys(firstPkg)
        });
      }

      // ─────────────────────────────────────────────────────────────
      // STEP 3: MAPPING - categoryId → category name
      // ─────────────────────────────────────────────────────────────
      // Transformasi packages: tambah field 'category' dengan nama dari categoryId
      const pkgsWithCategory = pkgsRaw.map((pkg, idx) => {
        // Gunakan getCategoryName() untuk convert categoryId ke nama
        const categoryName = getCategoryName(pkg.categoryId, cats);
        
        // Debug untuk package pertama
        if (idx === 0) {
          console.log(`🔍 MAPPING DEBUG - Package #1:`, {
            categoryId: pkg.categoryId,
            categoryList: cats,
            foundCategory: cats.find(c => c.id === pkg.categoryId),
            resultName: categoryName
          });
        }
        
        // Return package dengan category name ditambahkan
        return {
          ...pkg,                      // Spread: ambil semua field dari pkg
          category: categoryName        // Override: tambah field category dengan nama
        };
      });
      
      console.log('✅ Packages with category:', pkgsWithCategory);

      // ─────────────────────────────────────────────────────────────
      // STEP 4: Fetch Testimonials & Gallery PARALEL
      // ─────────────────────────────────────────────────────────────
      // Promise.all() = fetch 2 API calls secara concurrent (lebih cepat)
      // Menunggu kedua request selesai baru lanjut
      const [tests, gal] = await Promise.all([
        testimonialsService.getAll(),
        galleryService.getAll()
      ]);

      console.log('✅ Data fetched successfully');
      console.log('📦 Packages:', pkgsWithCategory);
      console.log('📂 Categories:', cats);
      console.log('💬 Testimonials:', tests);
      console.log('🖼️ Gallery Items:', gal);

      // ─────────────────────────────────────────────────────────────
      // STEP 5: Update State dengan data yang sudah clean
      // ─────────────────────────────────────────────────────────────
      // State ini akan di-trigger re-render dan component akan update dengan data baru
      setPackageList(pkgsWithCategory);  // Gunakan yang sudah dimapping (bukan pkgsRaw)!
      setCategoryList(cats || []);
      setTestimonialList(tests || []);
      setGalleryList(gal || []);

    } catch (err) {
      // ─────────────────────────────────────────────────────────────
      // ERROR HANDLING - Fallback ke data lokal jika API gagal
      // ─────────────────────────────────────────────────────────────
      console.error("❌ Gagal memuat data:", err);
      
      // Jika API call gagal, gunakan data lokal dari imports
      // Data lokal sudah ada di atas (dari data/packages.js, data/testimonials.js)
      setPackageList(packages);
      setCategoryList(packageCategories.filter(c => c.slug !== "semua"));
      setTestimonialList(testimonials);
    }
  };









  // ============ PACKAGES HANDLERS ============
  const filteredPackages = packageList.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mapping frontend fields to backend fields
    const payload = {
      name: formData.title,
      category: formData.category,
      price: parseInt(formData.price),
      durasi: formData.durasi,
      description: formData.description,
      image: formData.image,
      highlight_utama: formData.highlight_utama
    };

    try {
      if (editingId) {
        await packageService.update(editingId, payload);
      } else {
        await packageService.create(payload);
      }
      fetchData(); // Refresh data
      handleCancel();
      setShowForm(false);
    } catch (err) {
      alert("Gagal menyimpan data: " + err);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title || pkg.name, category: pkg.category, price: pkg.price,
      durasi: pkg.durasi || pkg.duration, description: pkg.description, image: pkg.image,
      highlight_utama: pkg.highlight_utama || (pkg.highlights ? pkg.highlights.join(', ') : ""),
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      try {
        await packageService.delete(id);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data: " + err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", category: "", price: "", durasi: "", description: "", image: "", highlight_utama: "" });
  };

  // ============ CATEGORY HANDLERS ============
  const handleCatInputChange = (e) => {
    const { name, value } = e.target;
    setCatFormData(prev => ({
      ...prev,
      [name]: value,
      slug: name === "name" ? value.toLowerCase().replace(/ /g, "-") : prev.slug
    }));
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: catFormData.name,
        slug: catFormData.slug
      };

      if (editingCatId) {
        // Update category
        await categoriesService.update(editingCatId, payload);
        console.log('✅ Category updated successfully');
      } else {
        // Create new category
        await categoriesService.create(payload);
        console.log('✅ Category created successfully');
      }

      fetchData(); // Refresh data dari API
      setEditingCatId(null);
      setCatFormData({ name: "", slug: "" });
      setShowCatForm(false);
    } catch (err) {
      alert("❌ Gagal menyimpan kategori: " + err);
      console.error("Category submit error:", err);
    }
  };

  const handleCatEdit = (cat) => {
    setCatFormData({ name: cat.name, slug: cat.slug });
    setEditingCatId(cat.id);
    setShowCatForm(true);
  };

  const handleCatDelete = async (id) => {
    if (window.confirm("Hapus kategori ini?")) {
      try {
        await categoriesService.delete(id);
        console.log('✅ Category deleted successfully');
        fetchData(); // Refresh data dari API
      } catch (err) {
        alert("❌ Gagal menghapus kategori: " + err);
        console.error("Category delete error:", err);
      }
    }
  };

  // ============ TESTIMONIALS HANDLERS ============
  const filteredTestimonials = testimonialList.filter(test =>
    test.name.toLowerCase().includes(searchTestQuery.toLowerCase()) ||
    test.package.toLowerCase().includes(searchTestQuery.toLowerCase())
  );

  // ============ GALLERY HANDLERS ============
  // Filter gallery berdasarkan search query
  const filteredGallery = galleryList.filter(item =>
    item.title.toLowerCase().includes(searchGalleryQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchGalleryQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchGalleryQuery.toLowerCase())
  );



  // ============ GALLERY HANDLERS ============
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGalleryId) {
        // UPDATE
        await galleryService.update(editingGalleryId, galleryFormData);
        console.log('✅ Gallery updated successfully');
      } else {
        // CREATE
        await galleryService.create(galleryFormData);
        console.log('✅ Gallery created successfully');
      }

      // Refresh data
      fetchData();

      // Reset form
      setGalleryFormData({ title: "", category: "", image: "", description: "" });
      setShowGalleryForm(false);
      setEditingGalleryId(null);
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Gagal menyimpan gallery');
    }
  };

  const handleGalleryEdit = (item) => {
    setGalleryFormData({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description
    });
    setEditingGalleryId(item.id);
    setShowGalleryForm(true);
  };

  const handleGalleryDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus gallery ini?')) {
      try {
        await galleryService.delete(id);
        console.log('✅ Gallery deleted successfully');
        fetchData(); // Refresh data
      } catch (error) {
        console.error('❌ Error:', error);
        alert('Gagal menghapus gallery');
      }
    }
  };

  const handleGalleryInputChange = (e) => {
    const { name, value } = e.target;
    setGalleryFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGalleryCancel = () => {
    setGalleryFormData({ title: "", category: "", image: "", description: "" });
    setShowGalleryForm(false);
    setEditingGalleryId(null);
  };

  const handleTestSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Konversi rating ke integer
      const ratingValue = parseInt(testFormData.rating) || 5;

      if (editingTestId) {
        // UPDATE
        const payload = {
          customer_name: testFormData.name,
          message: testFormData.text,
          rating: ratingValue  // ✅ Integer
        };

        await testimonialsService.update(editingTestId, payload);

        // Update state lokal dengan rating yang sudah dikonversi
        setTestimonialList(prev =>
          prev.map(t => t.id === editingTestId
            ? {
              ...t,
              ...testFormData,
              rating: ratingValue  // ✅ Integer
            }
            : t
          )
        );
        setEditingTestId(null);
        console.log(' Testimoni berhasil diupdate');
      } else {
        // CREATE
        const payload = {
          customer_name: testFormData.name,
          message: testFormData.text,
          rating: ratingValue  // ✅ Integer
        };

        const response = await testimonialsService.create(payload);

        // Tambah ke state lokal
        const newTest = {
          id: response.id || Math.random(),
          name: testFormData.name,
          text: testFormData.text,
          rating: ratingValue  // ✅ Integer
        };
        setTestimonialList(prev => [...prev, newTest]);
        console.log('Testimoni berhasil ditambahkan');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Gagal menyimpan testimoni: ' + error);
    } finally {
      setTestFormData({ name: "", title: "", image: "", package: "", rating: 5, text: "" });
      setShowTestForm(false);
    }
  };

  const handleTestEdit = (test) => {
    setTestFormData({
      name: test.name,
      title: test.title || "",
      image: test.image || "",
      package: test.package || "",
      rating: test.rating,
      text: test.text
    });
    setEditingTestId(test.id);
    setShowTestForm(true);
  };

  const handleTestCancel = () => {
    setShowTestForm(false);
    setEditingTestId(null);
    setTestFormData({ name: "", title: "", image: "", package: "", rating: 5, text: "" });
  };

  const handleTestDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) {
      try {
        await testimonialsService.delete(id);
        setTestimonialList(prev => prev.filter(t => t.id !== id));
        console.log('✅ Testimoni berhasil dihapus');
      } catch (error) {
        console.error('❌ Error:', error);
        alert('Gagal menghapus testimoni: ' + error);
      }
    }
  };

  // ============ HEADER TEXT ============
  const headerText = {
    dashboard: "Dashboard Overview",
    packages: "Package Management",
    categories: "Categories Control",
    testimonials: "Testimonials",
    gallery: "Gallery",
    settings: "Settings"
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter">
      <AdminSidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-grow min-w-0">
        {/* Header Section */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="px-10 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-outfit font-bold text-slate-900 tracking-tight">
                {headerText[currentTab]}
              </h1>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                Harmoni Enterprise Solutions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-500">
                <HiCalendar className="w-4 h-4" />
                <span className="text-[11px] font-bold">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

            </div>
          </div>
        </header>

        <div className="px-10 py-8">
          <AnimatePresence mode="wait">
            {/* Tab Content */}
            {currentTab === "dashboard" && (
              <DashboardTab packageList={packageList} categoryList={categoryList} testimonialList={testimonialList} galleryList={galleryList} />
            )}

            {currentTab === "packages" && (
              <PackagesTab
                packageList={packageList}
                filteredPackages={filteredPackages}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showForm={showForm}
                setShowForm={setShowForm}
                editingId={editingId}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleCancel={handleCancel}
                categoryList={categoryList}
              />
            )}

            {currentTab === "categories" && (
              <CategoriesTab
                categoryList={categoryList}
                showCatForm={showCatForm}
                setShowCatForm={setShowCatForm}
                editingCatId={editingCatId}
                setEditingCatId={setEditingCatId}
                catFormData={catFormData}
                setCatFormData={setCatFormData}
                handleCatInputChange={handleCatInputChange}
                handleCatSubmit={handleCatSubmit}
                handleCatEdit={handleCatEdit}
                handleCatDelete={handleCatDelete}
              />
            )}

            {currentTab === "testimonials" && (
              <TestimonialsTab
                testimonialList={testimonialList}
                filteredTestimonials={filteredTestimonials}
                searchQuery={searchTestQuery}
                setSearchQuery={setSearchTestQuery}
                showForm={showTestForm}
                setShowForm={setShowTestForm}
                editingId={editingTestId}
                formData={testFormData}
                handleInputChange={handleTestInputChange}
                handleSubmit={handleTestSubmit}
                handleEdit={handleTestEdit}
                handleDelete={handleTestDelete}
                handleCancel={handleTestCancel}
              />
            )}

            {/* Coming Soon Tabs */}
            {currentTab === "gallery" && (
              <GalleryTab
                galleryList={galleryList}
                filteredGallery={filteredGallery}
                searchQuery={searchGalleryQuery}
                setSearchQuery={setSearchGalleryQuery}
                showForm={showGalleryForm}
                setShowForm={setShowGalleryForm}
                editingId={editingGalleryId}
                formData={galleryFormData}
                handleInputChange={handleGalleryInputChange}
                handleSubmit={handleGallerySubmit}
                handleEdit={handleGalleryEdit}
                handleDelete={handleGalleryDelete}
                handleCancel={handleGalleryCancel}
              />
            )}

            {["settings"].includes(currentTab) && (
              <motion.div
                key="coming-soon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl border border-slate-200 p-24 flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                  <HiSparkles className="w-8 h-8 text-indigo-200" />
                </div>
                <h3 className="text-xl font-outfit font-bold text-slate-900">Module Under Construction</h3>
                <p className="text-slate-400 text-xs max-w-xs mt-3 leading-relaxed font-medium uppercase tracking-widest">
                  The <span className="text-indigo-600">{currentTab}</span> interface is being optimized.
                </p>
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className="mt-8 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Return Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}