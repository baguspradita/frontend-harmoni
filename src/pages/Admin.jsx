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
import { packageService } from "../services/packageService";
import { categoriesService } from "../services/categoriesService";
import { testimonialsService } from "../services/testimonialsService";



export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") || localStorage.getItem("authToken");
    if (!isLoggedIn) {
      navigate("/login");
    }
    fetchData();
  }, [navigate]);

  // ============ STATE INITIALIZATION ============
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [packageList, setPackageList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [testimonialList, setTestimonialList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
  const [searchTestQuery, setSearchTestQuery] = useState("");
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [searchGalleryQuery, setSearchGalleryQuery] = useState("");

  const [formData, setFormData] = useState({
    title: "", category: "", price: "", durasi: "", description: "", image: "", highlight_utama: "",
  });

  const [catFormData, setCatFormData] = useState({ name: "", slug: "" });
  const [testFormData, setTestFormData] = useState({
    name: "", title: "", image: "", package: "", rating: 5, text: ""
  });
  const [galleryFormData, setGalleryFormData] = useState({
    title: "", category: "", image: "", description: ""
  });

  // ============ GALLERY STATE SETUP ============
  const galleryItems = [
    { id: 1, title: "Raja Ampat Beach", category: "Destinasi", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", description: "Pantai indah dengan terumbu karang yang memukau" },
    { id: 2, title: "Luxury Resort", category: "Hotel", image: "https://images.unsplash.com/photo-1551632786-fc43ea25ad16?w=400&q=80", description: "Resort bintang lima dengan fasilitas lengkap" },
    { id: 3, title: "Diving Adventure", category: "Aktivitas", image: "https://images.unsplash.com/photo-1544551763-92ab472cad5d?w=400&q=80", description: "Petualangan menyelam di kedalaman laut" },
    { id: 4, title: "Traditional Food", category: "Kuliner", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", description: "Makanan tradisional Indonesia yang lezat" },
    { id: 5, title: "Mount Bromo Sunrise", category: "Pemandangan", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", description: "Matahari terbit di puncak gunung Bromo" },
    { id: 6, title: "Waterfall Trek", category: "Aktivitas", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80", description: "Trekking menuju air terjun tersembunyi" }
  ];

  const [galleryList, setGalleryList] = useState(galleryItems);

  // ============ FETCH DATA FUNCTION (SEBELUM useEffect) ============
  const fetchData = async () => {
    try {
      console.log('🔄 Fetching data from APIs...');
      const [pkgs, cats, tests] = await Promise.all([
        packageService.getAll(),
        categoriesService.getAll(),
        testimonialsService.getAll()
      ]);

      console.log('✅ Data fetched successfully');
      console.log('📦 Packages:', pkgs);
      console.log('📂 Categories:', cats);
      console.log('💬 Testimonials:', tests);

      setPackageList(pkgs || []);
      setCategoryList(cats || []);
      setTestimonialList(tests || []);
    } catch (err) {
      console.error("❌ Gagal memuat data:", err);
      // Fallback ke data lokal jika API gagal
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
  const filteredGallery = galleryList.filter(item =>
    item.title.toLowerCase().includes(searchGalleryQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchGalleryQuery.toLowerCase())
  );

  const handleGalleryInputChange = (e) => {
    const { name, value } = e.target;
    setGalleryFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGallerySubmit = (e) => {
    e.preventDefault();
    if (editingGalleryId) {
      setGalleryList(prev => prev.map(item => item.id === editingGalleryId ? { ...item, ...galleryFormData } : item));
      setEditingGalleryId(null);
    } else {
      const newItem = {
        id: Math.max(...galleryList.map(i => i.id), 0) + 1,
        ...galleryFormData
      };
      setGalleryList(prev => [...prev, newItem]);
    }
    setGalleryFormData({ title: "", category: "", image: "", description: "" });
    setShowGalleryForm(false);
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

  const handleGalleryDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus media ini?")) {
      setGalleryList(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleGalleryCancel = () => {
    setShowGalleryForm(false);
    setEditingGalleryId(null);
    setGalleryFormData({ title: "", category: "", image: "", description: "" });
  };

  const handleTestInputChange = (e) => {
    const { name, value } = e.target;
    setTestFormData(prev => ({ ...prev, [name]: value }));
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