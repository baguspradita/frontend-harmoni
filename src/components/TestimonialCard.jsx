import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";

export default function TestimonialCard({ testimonial, index }) {
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
        {[...Array(testimonial.rating)].map((_, i) => (
          <HiStar key={i} className="text-secondary w-5 h-5" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="font-inter text-gray-600 mb-xl italic leading-relaxed">
        "{testimonial.text}"
      </p>

      {/* Divider */}
      <div className="border-b border-gray-200 mb-lg"></div>

      {/* Author Info */}
      <div className="flex items-center gap-lg">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="font-poppins font-bold text-secondary text-sm">
            {testimonial.name}
          </p>
          <p className="font-inter text-xs text-gray-500">{testimonial.title}</p>
          <p className="font-inter text-xs text-primary font-semibold mt-sm">
            {testimonial.package}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
