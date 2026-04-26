import { motion } from "framer-motion";
import { HiPlus, HiTrash, HiPencil, HiSearch } from "react-icons/hi";

export default function TestimonialsTab({
  testimonialList,
  filteredTestimonials,
  searchQuery,
  setSearchQuery,
  showForm,
  setShowForm,
  formData,
  handleInputChange,
  handleSubmit,
  handleEdit,
  handleDelete,
  handleCancel,
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header dengan Search & Add Button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl">
            <HiSearch className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ulasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all"
        >
          <HiPlus className="w-5 h-5" />
          Tambah Ulasan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div className="bg-white p-6 rounded-2xl border border-slate-200 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              />
              <select
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="px-4 py-2 border border-slate-200 rounded-lg bg-white cursor-pointer"
              >
                <option value="">Pilih Rating</option>
                <option value="1">⭐ 1 - Buruk</option>
                <option value="2">⭐⭐ 2 - Kurang</option>
                <option value="3">⭐⭐⭐ 3 - Cukup</option>
                <option value="4">⭐⭐⭐⭐ 4 - Bagus</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 - Sangat Bagus</option>
              </select>
            </div>
            <textarea
              placeholder="Ulasan"
              name="text"
              value={formData.text}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg h-24"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      <div className="space-y-4">
        {filteredTestimonials.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-start"
          >
            <div className="flex-1">
              <p className="font-bold text-slate-900">{test.name}</p>
              <p className="text-slate-600 text-sm my-2">"{test.text}"</p>
              <div className="flex gap-1">
                {[...Array(test.rating)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(test)}
                className="p-2 hover:bg-blue-100 rounded-lg transition-all"
              >
                <HiPencil className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(test.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition-all"
              >
                <HiTrash className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}