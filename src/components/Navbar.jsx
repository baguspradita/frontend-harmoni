import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logoImg from "../assets/logo.jpeg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Paket Wisata", path: "/packages" },
    { name: "Galeri", path: "/gallery" },
    { name: "Kontak", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-soft"
    >
      <div className="max-w-7xl mx-auto px-lg py-lg">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-md">
            <img 
              src={logoImg} 
              alt="Harmoni Travel Logo" 
              className="h-10 w-auto object-contain rounded-lg shadow-soft hover:shadow-medium transition-all"
            />
            <span className="font-poppins font-bold text-lg text-primary hidden sm:inline">
              Harmoni Travel
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-inter text-sm font-medium transition-colors duration-300 relative ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-dark hover:text-primary"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block px-lg py-md font-inter font-semibold text-sm text-white bg-primary hover:bg-opacity-90 rounded-lg transition-all duration-300 hover:shadow-medium"
          >
            Konsultasi
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-dark text-2xl"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-lg border-t border-gray-200"
          >
            <div className="flex flex-col gap-md py-lg">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-inter text-sm font-medium py-md px-lg rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "text-white bg-primary"
                      : "text-dark hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-lg py-md font-inter font-semibold text-sm text-white bg-primary hover:bg-opacity-90 rounded-lg text-center transition-all"
              >
                Konsultasi via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
