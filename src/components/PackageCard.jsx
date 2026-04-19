import { motion } from "framer-motion";
import { HiCheckCircle, HiStar } from "react-icons/hi";

export default function PackageCard({ package: pkg, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg shadow-soft hover:shadow-medium overflow-hidden transition-all duration-300 group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-lg left-lg">
          <span className="inline-block px-lg py-md bg-secondary text-primary font-inter font-semibold text-xs rounded-full">
            {pkg.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-xl">
        <h3 className="font-poppins font-bold text-lg text-dark mb-md line-clamp-2">
          {pkg.title}
        </h3>

        <p className="font-inter text-sm text-gray-600 mb-xl line-clamp-2">
          {pkg.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-md mb-xl text-sm text-dark font-inter">
          <span>📅</span>
          {pkg.duration}
        </div>

        {/* Highlights */}
        <div className="mb-xl">
          <p className="font-inter text-xs text-gray-500 uppercase tracking-wide mb-md font-semibold">
            Highlight Utama
          </p>
          <div className="space-y-sm">
            {pkg.highlights.slice(0, 2).map((highlight, i) => (
              <div key={i} className="flex items-center gap-md text-sm">
                <HiCheckCircle className="text-accent w-4 h-4 flex-shrink-0" />
                <span className="font-inter text-gray-600">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-xl border-t border-gray-100">
          <div>
            <p className="font-inter text-xs text-gray-500 mb-sm">Mulai dari</p>
            <p className="font-poppins font-bold text-lg text-primary">
              Rp {pkg.price}
            </p>
          </div>
          <a
            href={`https://wa.me/6288227250909?text=Saya%20ingin%20booking%20paket%20${encodeURIComponent(
              pkg.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-lg py-md font-inter font-semibold text-sm text-white bg-primary hover:bg-opacity-90 rounded-lg transition-all duration-300 hover:shadow-medium"
          >
            Pesan
          </a>
        </div>
      </div>
    </motion.div>
  );
}
