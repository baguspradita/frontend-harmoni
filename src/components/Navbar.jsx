import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logoImg from "../assets/logo.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Paket Wisata", path: "/packages" },
    { name: "Galeri", path: "/gallery" },
  ];

  const isActive = (path) => location.pathname === path;
  const isTransparentPage = ["/", "/packages", "/gallery"].includes(location.pathname);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isTransparentPage 
          ? "bg-white/90 backdrop-blur-lg shadow-soft py-md" 
          : "bg-transparent py-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-lg">
        <div className="flex justify-between items-center relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-md group z-10">
            <div className="relative overflow-hidden rounded-lg">
              <img 
                src={logoImg} 
                alt="Harmoni Travel Logo" 
                className="h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className={`font-poppins font-bold text-xl transition-colors duration-500 ${
              scrolled || !isTransparentPage ? "text-primary" : "text-white"
            }`}>
              Harmoni
            </span>
          </Link>

          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-inter text-sm font-semibold transition-all duration-300 relative py-2 ${
                  isActive(item.path)
                    ? (scrolled || !isTransparentPage ? "text-primary" : "text-white")
                    : (scrolled || !isTransparentPage ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white")
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      scrolled || !isTransparentPage ? "bg-primary" : "bg-white"
                    }`}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle / Right Placeholder */}
          <div className="flex items-center z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden text-2xl transition-colors duration-300 ${
                scrolled || !isTransparentPage ? "text-slate-900" : "text-white"
              }`}
            >
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
            
            {/* Desktop Right Placeholder (to keep spacing if needed, but absolute centering handles it) */}
            <div className="hidden md:block w-[120px]"></div> 
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-lg pb-xl"
            >
              <div className="flex flex-col gap-md p-md bg-white rounded-2xl shadow-xl border border-gray-100 mt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`font-inter text-sm font-semibold py-4 px-lg rounded-xl transition-all ${
                      isActive(item.path)
                        ? "text-primary bg-primary/5"
                        : "text-slate-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <a
                  href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-lg py-4 font-inter font-bold text-sm text-white bg-primary hover:bg-primary/90 rounded-xl text-center transition-all shadow-lg shadow-primary/20"
                >
                  Konsultasi via WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
