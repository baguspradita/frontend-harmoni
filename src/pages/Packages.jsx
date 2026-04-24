import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "../components/SectionTitle";
import PackageCard from "../components/PackageCard";
import { packageService } from "../services/packageService";
import { categoriesService } from "../services/categoriesService";


export default function Packages() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [packageList, setPackageList] = useState([]);
  const [categoryList, setCategoryList] = useState([{ id: 'all', name: "Semua", slug: "semua" }]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [pkgs, cats] = await Promise.all([
          packageService.getAll(),
          categoriesService.getAll()
        ]);
        
        setPackageList(pkgs);
        // Gabungkan kategori "Semua" dengan kategori dari API
        setCategoryList([{ id: 'all', name: "Semua", slug: "semua" }, ...cats]);
        setIsLoading(false);
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setError("Gagal memuat data paket wisata. Silakan coba beberapa saat lagi.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPackages =
    activeCategory === "Semua"
      ? packageList
      : packageList.filter((pkg) => pkg.category === activeCategory);

  return (
    <div className="min-h-screen bg-transparent">

      {/* Banner dengan Logo - Full */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          backgroundImage: "url('/logo.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
        }}
        className="py-8xl"
      >
      </motion.section>

      {/* Text Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white py-3xl"
      >
        <div className="max-w-7xl mx-auto px-lg text-center">
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl mb-xl text-primary">
            Paket Wisata Lengkap
          </h1>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih dari berbagai paket wisata terbaik yang telah kami siapkan
            khusus untuk Anda
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-x1 bg-white">
        <div className="max-w-7xl mx-auto px-lg">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-md justify-center mb-3xl"
          >
            {categoryList.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.name)}
                className={`px-xl py-md font-inter font-semibold rounded-lg transition-all duration-300 ${activeCategory === category.name
                  ? "bg-primary text-white shadow-medium"
                  : "bg-neutral text-dark hover:bg-opacity-70"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-3xl">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-inter text-gray-500 font-medium">Memuat paket wisata...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-3xl">
              <p className="font-inter text-red-500 text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg font-bold"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Packages Grid */}
          {!isLoading && !error && (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl"
            >
              <AnimatePresence>
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PackageCard package={pkg} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredPackages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-3xl"
            >
              <p className="font-inter text-gray-600 text-lg">
                Tidak ada paket wisata untuk kategori ini.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-3xl bg-neutral"
      >
        <div className="max-w-3xl mx-auto text-center px-lg">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl text-dark mb-lg">
            Tidak menemukan paket yang Anda cari?
          </h2>
          <p className="font-inter text-gray-600 mb-2xl">
            Hubungi tim kami untuk membuat paket wisata custom sesuai kebutuhan
            Anda.
          </p>
          <a
            href="https://wa.me/6288227250909?text=Saya%20ingin%20konsultasi%20paket%20custom"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2xl py-lg font-inter font-bold text-white bg-primary rounded-lg hover:bg-opacity-90 transition-all duration-300"
          >
            Konsultasi Paket Custom
          </a>
        </div>
      </motion.section>
    </div>
  );
}
