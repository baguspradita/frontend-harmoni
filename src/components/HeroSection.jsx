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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                type: "spring",
                damping: 25,
                stiffness: 100,
                duration: 0.8 
            },
        },
    };

    return (
        <section className="relative bg-slate-900 min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={heroBg}
                    alt="Hero Background"
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
            </div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
                />
                <motion.div 
                    animate={{ 
                        y: [0, 30, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-5xl mx-auto px-lg text-white text-center"
            >
                <motion.h1
                    variants={itemVariants}
                    className="font-poppins font-extrabold text-5xl sm:text-7xl md:text-8xl leading-tight mb-xl"
                >
                    Pengalaman Wisata <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tak Terlupakan</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="font-inter text-lg md:text-xl text-gray-200 mb-3xl max-w-2xl mx-auto leading-relaxed opacity-90"
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
                        className="group relative inline-flex items-center gap-md px-2xl py-lg font-inter font-bold text-base text-secondary bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-primary/20"
                    >
                        Lihat Paket Wisata
                        <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <a
                        href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-md px-2xl py-lg font-inter font-bold text-base text-white border-2 border-white/30 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                        Konsultasi Gratis
                        <HiArrowRight />
                    </a>
                </motion.div>
            </motion.div>

            

            
        </section>
    );
}
