import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiCalendar, HiSparkles } from "react-icons/hi";
import { packages, packageCategories } from "../data/packages";
import AdminSidebar from "../components/AdminSidebar";
import DashboardTab from "../components/admin/DashboardTab";
import PackagesTab from "../components/admin/PackagesTab";
import CategoriesTab from "../components/admin/CategoriesTab";

export default function Admin() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [packageList, setPackageList] = useState(packages);
  const [categoryList, setCategoryList] = useState(packageCategories.filter(c => c.slug !== "semua"));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    title: "", category: "", price: "", duration: "", description: "", image: "",
  });

  const [catFormData, setCatFormData] = useState({ name: "", slug: "" });

  // ============ PACKAGES HANDLERS ============
  const filteredPackages = packageList.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setPackageList(prev => prev.map(pkg => pkg.id === editingId ? { ...pkg, ...formData } : pkg));
      setEditingId(null);
    } else {
      const newPackage = {
        id: Math.max(...packageList.map(p => p.id), 0) + 1,
        ...formData, highlights: [], included: [],
      };
      setPackageList(prev => [...prev, newPackage]);
    }
    setFormData({ title: "", category: "", price: "", duration: "", description: "", image: "" });
    setShowForm(false);
  };

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title, category: pkg.category, price: pkg.price,
      duration: pkg.duration, description: pkg.description, image: pkg.image,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      setPackageList(prev => prev.filter(pkg => pkg.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", category: "", price: "", duration: "", description: "", image: "" });
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

  const handleCatSubmit = (e) => {
    e.preventDefault();
    if (editingCatId) {
      setCategoryList(prev => prev.map(c => c.id === editingCatId ? { ...c, ...catFormData } : c));
      setEditingCatId(null);
    } else {
      const newCat = {
        id: Math.max(...categoryList.map(c => c.id), 0) + 1,
        ...catFormData
      };
      setCategoryList(prev => [...prev, newCat]);
    }
    setCatFormData({ name: "", slug: "" });
    setShowCatForm(false);
  };

  const handleCatEdit = (cat) => {
    setCatFormData({ name: cat.name, slug: cat.slug });
    setEditingCatId(cat.id);
    setShowCatForm(true);
  };

  const handleCatDelete = (id) => {
    if (window.confirm("Hapus kategori ini?")) {
      setCategoryList(prev => prev.filter(c => c.id !== id));
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
              <DashboardTab packageList={packageList} categoryList={categoryList} />
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

            {/* Coming Soon Tabs */}
            {["testimonials", "gallery", "settings"].includes(currentTab) && (
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