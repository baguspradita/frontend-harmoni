import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HiCalendar, HiUser, HiArrowRight } from "react-icons/hi";

export default function BlogCard({ blog, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 group flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-lg left-lg">
          <span className="inline-block px-lg py-sm bg-secondary text-primary font-inter font-semibold text-xs rounded-full">
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-xl flex flex-col flex-grow">
        <h3 className="font-poppins font-bold text-lg text-dark mb-md line-clamp-2">
          {blog.title}
        </h3>

        <p className="font-inter text-sm text-gray-600 mb-xl line-clamp-3 flex-grow">
          {blog.excerpt}
        </p>

        {/* Meta */}
        <div className="space-y-md border-t border-gray-100 pt-xl mb-xl">
          <div className="flex items-center gap-lg text-xs text-gray-500 font-inter">
            <div className="flex items-center gap-sm">
              <HiCalendar className="w-4 h-4" />
              {new Date(blog.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <span>•</span>
            <span>{blog.readTime}</span>
          </div>
          <div className="flex items-center gap-sm text-xs text-primary font-inter font-semibold">
            <HiUser className="w-4 h-4" />
            {blog.author}
          </div>
        </div>

        {/* Read More Button */}
        <Link
          to={`/blog/${blog.slug}`}
          className="inline-flex items-center gap-md font-inter font-semibold text-sm text-primary hover:text-secondary transition-colors"
        >
          Baca Selengkapnya
          <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
