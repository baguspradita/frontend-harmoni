import { motion } from "framer-motion";

export default function SectionTitle({ subtitle, title, description, centered = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`${centered ? "text-center" : ""} mb-3xl`}
    >
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="font-inter text-sm font-bold text-secondary uppercase tracking-[0.2em] mb-md"
        >
          {subtitle}
        </motion.p>
      )}

      <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl md:text-5xl text-dark mb-lg leading-tight">
        {title}
      </h2>

      {centered && (
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-lg"
        />
      )}

      {description && (
        <p className="font-inter text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
