import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiPhone,
  HiEnvelope,
  HiLocationMarker,
  HiFacebook,
  HiInstagram,
  HiTwitter,
} from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-primary text-white"
    >
      <div className="max-w-7xl mx-auto px-lg py-4xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3xl mb-3xl">
          {/* Brand */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-md mb-xl">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-primary font-bold">
                ✈
              </div>
              <h3 className="font-poppins font-bold text-xl">Harmoni Travel</h3>
            </div>
            <p className="font-inter text-sm text-gray-300">
              Menghadirkan pengalaman wisata terbaik di seluruh Indonesia dengan
              layanan profesional dan terpercaya.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-poppins font-bold mb-lg text-lg">
              Menu Cepat
            </h4>
            <ul className="space-y-md font-inter text-sm">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="hover:text-secondary transition-colors"
                >
                  Paket Wisata
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-secondary transition-colors"
                >
                  Galeri
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-secondary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h4 className="font-poppins font-bold mb-lg text-lg">
              Hubungi Kami
            </h4>
            <ul className="space-y-md font-inter text-sm">
              <li className="flex items-start gap-md">
                <HiPhone className="mt-1 flex-shrink-0" />
                <span>+62 812 3456 789</span>
              </li>
              <li className="flex items-start gap-md">
                <HiEnvelope className="mt-1 flex-shrink-0" />
                <span>info@harmontravel.com</span>
              </li>
              <li className="flex items-start gap-md">
                <HiLocationMarker className="mt-1 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h4 className="font-poppins font-bold mb-lg text-lg">
              Ikuti Kami
            </h4>
            <div className="flex gap-lg">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <HiFacebook />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <HiInstagram />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-secondary hover:bg-opacity-80 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <HiTwitter />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-2xl"></div>

        {/* Bottom */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center gap-lg font-inter text-sm text-gray-300"
        >
          <p>
            &copy; {currentYear} Harmoni Travel. Semua hak dilindungi.
          </p>
          <div className="flex gap-xl">
            <a href="#" className="hover:text-secondary transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-secondary transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
