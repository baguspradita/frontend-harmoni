import { motion } from "framer-motion";
import { HiCheckCircle, HiStar, HiEye } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function PackageCard({ package: pkg, index }) {
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  const [showIncluded, setShowIncluded] = useState(false);

  // Mock rating data - bisa di-update dari backend
  const rating = 4.8;
  const reviews = 128;
  const maxHighlights = 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg shadow-soft hover:shadow-medium overflow-hidden transition-all duration-300 group h-full flex flex-col"
    >
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Gradient Overlay untuk kontras lebih baik */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        

        
      </div>

      {/* Content */}
      <div className="p-xl flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-poppins font-bold text-lg text-dark mb-md line-clamp-2">
          {pkg.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-md mb-lg">
          <div className="flex items-center gap-xs">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "text-accent fill-accent"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-inter text-sm text-dark font-semibold">{rating}</span>
          <span className="font-inter text-xs text-gray-500">({reviews} ulasan)</span>
        </div>

        {/* Description */}
        <p className="font-inter text-sm text-gray-600 mb-lg line-clamp-2">
          {pkg.description}
        </p>

        {/* Duration & Facilities */}
        <div className="space-y-md mb-lg">
          <div className="flex items-center gap-md text-sm text-dark font-inter">
            <span>📅</span>
            <span className="font-semibold">{pkg.duration}</span>
          </div>
         
        </div>

        {/* Highlights Section */}
        <div className="mb-lg">
          <p className="font-inter text-xs text-gray-500 uppercase tracking-wide mb-md font-semibold">
            Highlight Utama
          </p>
          <div className="space-y-sm">
            {pkg.highlights
              .slice(0, showAllHighlights ? pkg.highlights.length : maxHighlights)
              .map((highlight, i) => (
                <div key={i} className="flex items-center gap-md text-sm">
                  <HiCheckCircle className="text-accent w-4 h-4 flex-shrink-0" />
                  <span className="font-inter text-gray-600">{highlight}</span>
                </div>
              ))}
          </div>

          {/* Show More Highlights */}
          {pkg.highlights.length > maxHighlights && (
            <button
              onClick={() => setShowAllHighlights(!showAllHighlights)}
              className="mt-md font-inter text-xs text-primary font-semibold hover:text-accent transition-colors"
            >
              {showAllHighlights
                ? "Tampilkan lebih sedikit"
                : `+${pkg.highlights.length - maxHighlights} lagi`}
            </button>
          )}
        </div>

        {/* Included Items - Expandable */}
        {pkg.included && (
          <div className="mb-lg border-t border-gray-100 pt-lg">
            <button
              onClick={() => setShowIncluded(!showIncluded)}
              className="flex items-center justify-between w-full font-inter text-sm font-semibold text-dark hover:text-primary transition-colors"
            >
              <span>Fasilitas</span>
              <span className="text-lg">{showIncluded ? "−" : "+"}</span>
            </button>

            {showIncluded && (
              <div className="mt-md space-y-sm">
                {pkg.included.map((item, i) => (
                  <div key={i} className="flex items-center gap-md text-sm">
                    <HiCheckCircle className="text-success w-4 h-4 flex-shrink-0" />
                    <span className="font-inter text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price & Button - Sticky at Bottom */}
        <div className="flex items-center justify-between gap-lg pt-lg border-t border-gray-100 mt-auto">
          <div>
            <p className="font-inter text-xs text-gray-500 mb-sm">Mulai dari</p>
            <p className="font-poppins font-bold text-xl text-secondary">
              Rp {pkg.price}
            </p>
            <p className="font-inter text-xs text-gray-500 mt-xs">per orang</p>
          </div>

          {/* Improved CTA Button */}
          <a
            href={`https://wa.me/6288227250909?text=Saya%20ingin%20booking%20paket%20${encodeURIComponent(
              pkg.title
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-md px-lg py-md font-inter font-semibold text-sm text-white bg-success hover:bg-opacity-90 active:scale-95 rounded-lg transition-all duration-300 hover:shadow-medium whitespace-nowrap"
            aria-label={`Pesan paket ${pkg.title} via WhatsApp`}
          >
            <FaWhatsapp className="w-4 h-4" />
            Pesan
          </a>
        </div>
      </div>
    </motion.div>
  );
}