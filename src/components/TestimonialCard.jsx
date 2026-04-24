import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";

export default function TestimonialCard({ testimonial, index }) {
  // ✅ Fallback values
  const {
    name = "Anonymous",
    rating = 5,
    text = "Great experience!",
  } = testimonial || {};

  // ✅ Sanitize rating (ensure 1-5)
  const safeRating = Math.min(Math.max(parseInt(rating) || 5, 1), 5);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg shadow-soft p-xl hover:shadow-medium transition-all duration-300"
    >
      {/* Rating */}
      <div className="flex gap-sm mb-lg">
        {[...Array(safeRating)].map((_, i) => (
          <HiStar key={i} className="text-secondary w-5 h-5 fill-secondary" />
        ))}
        {[...Array(5 - safeRating)].map((_, i) => (
          <HiStar key={`empty-${i}`} className="text-gray-300 w-5 h-5" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="font-inter text-gray-600 mb-xl italic leading-relaxed line-clamp-4">
        "{text}"
      </p>

      {/* Author Name */}
      <p className="font-poppins font-bold text-secondary text-sm">
        - {name}
      </p>
    </motion.div>
  );
}