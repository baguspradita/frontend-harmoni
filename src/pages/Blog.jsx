import { useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "../components/BlogCard";
import { blogs } from "../data/blog";
import { HiSearch } from "react-icons/hi";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Adventure", "Budaya", "Pantai"];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary to-blue-900 text-white py-3xl"
      >
        <div className="max-w-7xl mx-auto px-lg text-center">
          <p className="font-inter text-lg font-semibold text-secondary mb-lg">
            Artikel & Tips
          </p>
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl mb-xl">
            Blog Wisata
          </h1>
          <p className="font-inter text-lg text-gray-200 max-w-2xl mx-auto">
            Baca artikel menarik dan tips bermanfaat untuk perjalanan Anda
          </p>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <section className="py-3xl">
        <div className="max-w-7xl mx-auto px-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3xl"
          >
            {/* Search Bar */}
            <div className="relative mb-2xl">
              <HiSearch className="absolute left-lg top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-3xl pr-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-md">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-lg py-md font-inter font-semibold rounded-lg transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-medium"
                      : "bg-neutral text-dark hover:bg-opacity-70"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-inter text-gray-600 mb-2xl"
          >
            Menampilkan {filteredBlogs.length} artikel
          </motion.p>

          {/* Blog Grid */}
          {filteredBlogs.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl"
            >
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <BlogCard blog={blog} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-3xl"
            >
              <p className="font-inter text-gray-600 text-lg mb-lg">
                Tidak ada artikel yang cocok dengan pencarian Anda.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                }}
                className="px-lg py-md font-inter font-semibold text-primary hover:text-secondary transition-colors"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
