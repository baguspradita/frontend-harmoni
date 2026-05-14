import { useState } from "react";
import AdminPackageDetailModal from "./AdminPackageDetailModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiFilter,
  HiX,
  HiPhotograph,
  HiClock,
  HiCurrencyDollar,
} from "react-icons/hi";

export default function PackagesTab({
  packageList,
  filteredPackages,
  searchQuery,
  setSearchQuery,
  showForm,
  setShowForm,
  editingId,
  formData,
  imageFile,
  imagePreview,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  handleEdit,
  handleDelete,
  handleCancel,
  categoryList,
}) {

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
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
              <h3 className="font-outfit font-bold text-slate-900">
                {editingId ? "Update Information" : "Create New Package"}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Package Title
                  </label>
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
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 cursor-pointer transition-all shadow-sm"
                    >
                      <option value="" disabled>
                        Select Region
                      </option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="durasi"
                      value={formData.durasi}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 3 Hari 2 Malam"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Price (IDR)
                  </label>
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
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Package Image (Upload)
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-slate-300"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-[9px] font-bold">
                        Preview
                      </div>
                    </div>
                  )}
                  
                  {/* File Input */}
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm cursor-pointer file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">
                    {imagePreview ? "Click to change image" : "Select an image file"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Highlight Utama (Pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    name="highlight_utama"
                    value={formData.highlight_utama}
                    onChange={handleInputChange}
                    required
                    placeholder="Borobudur, Prambanan, Malioboro"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Detailed Description
                  </label>
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-grow py-2.5 font-bold rounded-xl text-xs transition-all ${
                      isSubmitting 
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {isSubmitting ? "📤 Uploading..." : editingId ? "Update" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
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
                <th className="pl-6 pr-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Package Details
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Category
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Price
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="pl-4 pr-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="pl-6 pr-4 py-4">
                    <div className="flex items-center gap-4">
                      <img src={pkg.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                          {pkg.title || pkg.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{pkg.durasi || pkg.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {pkg.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-900 text-xs">IDR {pkg.price}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </td>
                  <td className="pl-4 pr-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);        // ← Simpan paket yang diklik
                          setIsDetailOpen(true);           // ← Buka modal
                        }}
                        className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-blue-600 transition-all"
                        title="Lihat Detail"
                      >
                        <HiPhotograph className="w-3.5 h-3.5" />  {/* Icon kamera */}
                      </button>
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-rose-600 transition-all"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal Detail Package */}
      <AdminPackageDetailModal
        package={selectedPackage}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </motion.div>
  );
}
