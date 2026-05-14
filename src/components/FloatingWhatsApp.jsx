import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsApp = () => {
  return (
    <motion.a
      href="https://wa.me/6288227250909?text=Halo%20Harmoni%20Travel,%20saya%20ingin%20tanya%20tentang%20paket%20wisata."
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-shadow duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 bg-[#25D366] rounded-full"
      />
      <FaWhatsapp className="w-8 h-8 relative z-10" />
      
      <span className="absolute right-full mr-4 bg-white text-dark text-sm font-semibold py-2 px-4 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-gray-100">
        Butuh bantuan? Chat kami!
      </span>
    </motion.a>
  );
};

export default FloatingWhatsApp;
