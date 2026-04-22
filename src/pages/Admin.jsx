import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiSearch,
  HiFilter,
  HiCalendar,
  HiPhotograph,
  HiCurrencyDollar,
  HiClock,
  HiX,
  HiSparkles,
  HiTag,
} from "react-icons/hi";
import { packages, packageCategories } from "../data/packages";
import AdminSidebar from "../components/AdminSidebar";

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
    title: "",
    category: "",
    price: "",
    duration: "",
    description: "",
    image: "",
  });

  const [catFormData, setCatFormData] = useState({
    name: "",
    slug: "",
  });

  // Filter packages based on search
  const filteredPackages = packageList.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Form Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setPackageList((prev) =>
        prev.map((pkg) =>
          pkg.id === editingId ? { ...pkg, ...formData } : pkg
        )
      );
      setEditingId(null);
    } else {
      const newPackage = {
        id: Math.max(...packageList.map((p) => p.id), 0) + 1,
        ...formData,
        highlights: [],
        included: [],
      };
      setPackageList((prev) => [...prev, newPackage]);
    }

    setFormData({
      title: "",
      category: "",
      price: "",
      duration: "",
      description: "",
      image: "",
    });
    setShowForm(false);
  };

  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title,
      category: pkg.category,
      price: pkg.price,
      duration: pkg.duration,
      description: pkg.description,
      image: pkg.image,
    });
    setEditingId(pkg.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      setPackageList((prev) => prev.filter((pkg) => pkg.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      title: "",
      category: "",
      price: "",
      duration: "",
      description: "",
      image: "",
    });
  };

  // CATEGORY HANDLERS
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
    if (window.confirm("Hapus kategori ini? Paket dengan kategori ini mungkin perlu disesuaikan.")) {
      setCategoryList(prev => prev.filter(c => c.id !== id));
    }
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
                {currentTab === "dashboard" ? "Dashboard Overview" : 
                 currentTab === "packages" ? "Package Management" : "Control Panel"}
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
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
                <HiSparkles className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        <div className="px-10 py-8">
          <AnimatePresence mode="wait">
            {/* Dashboard Tab */}
            {currentTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total Packages", value: packageList.length, icon: HiOutlineShoppingCart, color: "indigo" },
                    { label: "Active Categories", value: new Set(packageList.map(p => p.category)).size, icon: HiOutlineChartBar, color: "emerald" },
                    { label: "Est. Revenue", value: `$18.4K`, icon: HiCurrencyDollar, color: "amber" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                          <stat.icon className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex items-end justify-between">
                        <h2 className="text-2xl font-outfit font-bold text-slate-900">{stat.value}</h2>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+12.5%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-outfit font-bold text-slate-900 text-sm">Top Performing Packages</h3>
                      <button className="text-[11px] font-bold text-indigo-600 hover:underline tracking-tight">View Analytics</button>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {packageList.slice(0, 4).map((pkg) => (
                        <div key={pkg.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                          <img src={pkg.image} className="w-10 h-10 rounded-lg object-cover grayscale-[20%] hover:grayscale-0 transition-all" alt="" />
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-slate-900 text-xs truncate">{pkg.title}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">{pkg.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900 text-xs">IDR {pkg.price}</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter mt-0.5">High Demand</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
                      <h4 className="font-outfit font-bold text-sm leading-tight relative z-10">System Optimization</h4>
                      <p className="text-white/50 text-[10px] mt-2 leading-relaxed relative z-10">
                        Your dashboard data was last synced 2 minutes ago. Everything is running smoothly.
                      </p>
                      <button className="mt-4 w-full py-2 bg-white text-slate-900 rounded-lg font-bold text-[10px] hover:bg-slate-100 transition-colors relative z-10">
                        Check Updates
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-widest mb-5">System Health</h4>
                      <div className="space-y-5">
                        {[
                          { label: "Server Load", value: 42 },
                          { label: "API Latency", value: 85 },
                          { label: "Error Rate", value: 12 }
                        ].map((item, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-[10px] font-bold uppercase mb-1.5">
                              <span className="text-slate-400">{item.label}</span>
                              <span className="text-slate-900">{item.value}%</span>
                            </div>
                            <div className="h-1 bg-slate-100 rounded-full">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.value}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Packages Management Tab */}
            {currentTab === "packages" && (
              <motion.div
                key="packages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-80 group">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search packages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-xs font-medium text-slate-900 shadow-sm"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-[11px] font-bold">
                      <HiFilter className="w-3.5 h-3.5" />
                      Filters
                    </button>
                    <button 
                      onClick={() => setShowForm(true)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-[11px] font-bold shadow-sm shadow-indigo-500/20"
                    >
                      <HiPlus className="w-4 h-4" />
                      Add Package
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-outfit font-bold text-slate-900">{editingId ? "Update Information" : "Create New Package"}</h3>
                        <button onClick={handleCancel} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><HiX className="w-4 h-4" /></button>
                      </div>

                      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Package Title</label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Category</label>
                              <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 cursor-pointer transition-all shadow-sm"
                              >
                                <option value="" disabled>Select Region</option>
                                {packageCategories
                                  .filter(cat => cat.slug !== "semua")
                                  .map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Duration</label>
                              <input 
                                type="text" 
                                name="duration" 
                                value={formData.duration} 
                                onChange={handleInputChange} 
                                required 
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Price (IDR)</label>
                            <input 
                              type="text" 
                              name="price" 
                              value={formData.price} 
                              onChange={handleInputChange} 
                              required 
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm" 
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Media Source URL</label>
                            <input 
                              type="url" 
                              name="image" 
                              value={formData.image} 
                              onChange={handleInputChange} 
                              required 
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Detailed Description</label>
                            <textarea 
                              name="description" 
                              value={formData.description} 
                              onChange={handleInputChange} 
                              required 
                              rows="4" 
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 resize-none transition-all shadow-sm"
                            ></textarea>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button type="submit" className="flex-grow py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">{editingId ? "Update" : "Publish"}</button>
                            <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                          </div>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="pl-6 pr-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Package Details</th>
                          <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</th>
                          <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                          <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                          <th className="pl-4 pr-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredPackages.map((pkg) => (
                          <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="pl-6 pr-4 py-4">
                              <div className="flex items-center gap-4">
                                <img src={pkg.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                <div>
                                  <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{pkg.title}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{pkg.duration}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{pkg.category}</span>
                            </td>
                            <td className="px-4 py-4 font-bold text-slate-900 text-xs">IDR {pkg.price}</td>
                            <td className="px-4 py-4 text-center">
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
                            </td>
                            <td className="pl-4 pr-6 py-4">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(pkg)} className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><HiPencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(pkg.id)} className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-rose-600 transition-all"><HiTrash className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Categories Management Tab */}
            {currentTab === "categories" && (
              <motion.div
                key="categories"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="relative w-80 group">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search categories..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-xs font-medium text-slate-900 shadow-sm"
                    />
                  </div>
                  <button 
                    onClick={() => setShowCatForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-[11px] font-bold shadow-sm shadow-indigo-500/20"
                  >
                    <HiPlus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>

                <AnimatePresence>
                  {showCatForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="font-outfit font-bold text-slate-900">{editingCatId ? "Edit Category" : "New Category"}</h3>
                        <button onClick={() => {setShowCatForm(false); setEditingCatId(null); setCatFormData({name:"",slug:""})}} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><HiX className="w-4 h-4" /></button>
                      </div>

                      <form onSubmit={handleCatSubmit} className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-grow space-y-4 w-full">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Category Name</label>
                            <input
                              type="text"
                              name="name"
                              value={catFormData.name}
                              onChange={handleCatInputChange}
                              required
                              placeholder="e.g. Bali"
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                            />
                          </div>
                        </div>
                        <div className="flex-grow space-y-4 w-full">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">Slug (Auto-generated)</label>
                            <input
                              type="text"
                              name="slug"
                              value={catFormData.slug}
                              readOnly
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-400 shadow-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 w-full md:w-auto">
                          <button type="submit" className="flex-grow px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs">{editingCatId ? "Update" : "Save"}</button>
                          <button type="button" onClick={() => {setShowCatForm(false); setEditingCatId(null); setCatFormData({name:"",slug:""})}} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs">Cancel</button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="pl-6 pr-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                          <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Name</th>
                          <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Slug</th>
                          <th className="pl-4 pr-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {categoryList.map((cat) => (
                          <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="pl-6 pr-4 py-4 text-xs font-bold text-slate-400">#CAT-0{cat.id}</td>
                            <td className="px-4 py-4">
                              <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{cat.slug}</span>
                            </td>
                            <td className="pl-4 pr-6 py-4">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleCatEdit(cat)} className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-indigo-600 transition-all"><HiPencil className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleCatDelete(cat.id)} className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-rose-600 transition-all"><HiTrash className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
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
                  The <span className="text-indigo-600">{currentTab}</span> interface is being optimized for professional use.
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



