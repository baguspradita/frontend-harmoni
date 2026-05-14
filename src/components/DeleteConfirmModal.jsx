import { motion, AnimatePresence } from 'framer-motion';
import { MdWarning, MdClose } from 'react-icons/md';

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  itemName,
  isLoading = false 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
            >
              <MdClose size={20} />
            </button>

            {/* Header dengan Icon */}
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <MdWarning className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>

            {/* Description */}
            <div className="mb-6 space-y-2">
              <p className="text-gray-600">{description}</p>
              {itemName && (
                <p className="rounded-lg bg-red-50 p-3 font-semibold text-red-700">
                  {itemName}
                </p>
              )}
            </div>

          

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Menghapus...
                  </>
                ) : (
                  <>Hapus</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}