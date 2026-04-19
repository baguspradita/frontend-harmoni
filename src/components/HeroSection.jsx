import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";
import heroBg from "../assets/hero-background.jpg";

export default function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 },
        },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-4xl mx-auto px-lg text-white text-center"
            >
                {/* <motion.p
                    variants={itemVariants}
                    className="font-inter text-lg font-semibold text-secondary mb-lg"
                >
                    Jelajahi Keindahan Indonesia
                </motion.p> */}

                <motion.h1
                    variants={itemVariants}
                    className="font-poppins font-bold text-5xl sm:text-6xl md:text-7xl leading-tight mb-xl text-primary"
                    style={{
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    Pengalaman Wisata <br />
                    <span className="text-primary">Tak Terlupakan</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="font-inter text-lg text-gray-200 mb-3xl max-w-2xl mx-auto leading-relaxed"
                >
                    Nikmati petualangan seru ke destinasi impian Anda dengan paket wisata
                    terpilih, pemandu berpengalaman, dan layanan terbaik.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-lg justify-center items-center"
                >
                    <Link
                        to="/packages"
                        className="inline-flex items-center gap-md px-2xl py-lg font-inter font-bold text-base text-secondary bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-medium"
                    >
                        Lihat Paket Wisata
                        <HiArrowRight />
                    </Link>

                    <a
                        href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-md px-2xl py-lg font-inter font-bold text-base text-white border-2 border-white rounded-lg hover:bg-secondary/10 transition-all duration-300"
                    >
                        Konsultasi Gratis
                        <HiArrowRight />
                    </a>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-lg left-1/2 transform -translate-x-1/2 z-10"
            >
                <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </section>
    );
}
