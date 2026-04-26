import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiCheckCircle } from "react-icons/hi";

export default function AdminPackageDetailModal({ package: pkg, isOpen, onClose }) {
  if (!pkg) return null;

  const finalHighlights = pkg.highlights || 
    (pkg.highlight_utama ? pkg.highlight_utama.split(',').map(h => h.trim()) : []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 flex items-center justify-between">
                <h2 className="font-outfit font-bold text-2xl text-white">Detail Paket</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <HiX className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Image */}
                {pkg.image && (
                  <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-200 mb-6">
                    <img
                      src={pkg.image}
                      alt={pkg.title || pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Judul & Kategori */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Paket</p>
                    <p className="font-outfit font-bold text-xl text-slate-900">
                      {pkg.title || pkg.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori</p>
                    <p className="font-semibold text-lg text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg inline-block">
                      {pkg.category}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* Harga & Durasi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Harga</p>
                    <p className="font-poppins font-bold text-2xl text-secondary">
                      Rp {pkg.price}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Durasi</p>
                    <p className="font-bold text-lg text-slate-900">
                      {pkg.durasi || pkg.duration || "-"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200" />

                {/* Deskripsi */}
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Deskripsi</p>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg">
                    {pkg.description || "-"}
                  </p>
                </div>

                {/* Highlights */}
                {finalHighlights.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Highlight Utama</p>
                    <div className="space-y-2">
                      {finalHighlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                          <HiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Included */}
                {pkg.included && pkg.included.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Fasilitas Termasuk</p>
                    <div className="space-y-2">
                      {pkg.included.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 bg-blue-50 p-3 rounded-lg">
                          <HiCheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-full mt-6 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}