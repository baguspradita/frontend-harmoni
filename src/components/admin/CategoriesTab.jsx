import { motion, AnimatePresence } from "framer-motion";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiX,
} from "react-icons/hi";

export default function CategoriesTab({
  categoryList,
  showCatForm,
  setShowCatForm,
  editingCatId,
  setEditingCatId,
  catFormData,
  setCatFormData,
  handleCatInputChange,
  handleCatSubmit,
  handleCatEdit,
  handleCatDelete,
}) {
  return (
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
              <h3 className="font-outfit font-bold text-slate-900">
                {editingCatId ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => {
                  setShowCatForm(false);
                  setEditingCatId(null);
                  setCatFormData({ name: "", slug: "" });
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCatSubmit} className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-grow space-y-4 w-full">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Category Name
                  </label>
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
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">
                    Slug (Auto-generated)
                  </label>
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
                <button
                  type="submit"
                  className="flex-grow px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs"
                >
                  {editingCatId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCatForm(false);
                    setEditingCatId(null);
                    setCatFormData({ name: "", slug: "" });
                  }}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
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
                  ID
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Category Name
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Slug
                </th>
                <th className="pl-4 pr-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
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
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {cat.slug}
                    </span>
                  </td>
                  <td className="pl-4 pr-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCatEdit(cat)}
                        className="p-1.5 hover:bg-white hover:border-slate-300 border border-transparent rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        <HiPencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCatDelete(cat.id)}
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
    </motion.div>
  );
}
