import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiFilter,
  HiX,
  HiPhotograph,
} from "react-icons/hi";

export default function GalleryTab({
  galleryList,
  filteredGallery,
  searchQuery,
  setSearchQuery,
  showForm,
  setShowForm,
  editingId,
  formData,
  imageFile,           // ← TAMBAH
  imagePreview,        // ← TAMBAH
  isSubmitting,       // ← TAMBAH
  handleInputChange,
  handleSubmit,
  handleEdit,
  handleDelete,
  handleCancel,
}) {
  return (
    <motion.div
      key="gallery"
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
            placeholder="Search gallery..."
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
            Add Media
          </button>
        </div>
      </div>

      {/* Form */}
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
                {editingId ? "Edit Media" : "Add New Media"}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm"
                  placeholder="Judul media"
                />
              </div>

              {/* Choose File */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                  📸 Media Image (Upload)
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-[9px] font-bold backdrop-blur-sm">
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
                  required={!editingId}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none text-sm font-medium text-slate-900 transition-all shadow-sm cursor-pointer file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                <p className="text-[9px] text-slate-400 mt-1 ml-1">
                  {imagePreview ? "Click to change image" : "Select an image file (JPG, PNG, WebP)"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm resize-none"
                  placeholder="Deskripsi media..."
                />
              </div>

              <div className="md:col-span-2 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-[11px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm font-bold flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>{editingId ? 'Update' : 'Add'} Media</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.length > 0 ? (
          filteredGallery.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 bg-white rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    <HiPencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">{item.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <HiPhotograph className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 text-sm font-medium">No media found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}