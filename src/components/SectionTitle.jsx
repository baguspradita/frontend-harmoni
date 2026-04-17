import { motion } from "framer-motion";

export default function SectionTitle({ subtitle, title, description, centered = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`${centered ? "text-center" : ""}`}
    >
      {subtitle && (
        <p className="font-inter text-sm font-bold text-secondary uppercase tracking-wide mb-md">
          {subtitle}
        </p>
      )}

      <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-dark mb-lg">
        {title}
      </h2>

      {description && (
        <p className="font-inter text-gray-600 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
