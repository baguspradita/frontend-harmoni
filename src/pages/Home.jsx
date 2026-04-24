import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import SectionTitle from "../components/SectionTitle";
import PackageCard from "../components/PackageCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import { packageService } from "../services/packageService";
import { testimonialsService } from "../services/testimonialsService";
import {
  HiGlobeAlt,
  HiShieldCheck,
  HiLightningBolt,
  HiUserGroup,
} from "react-icons/hi";

export default function Home() {
  // ========== STATE ==========
  // Packages
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [packagesError, setPackagesError] = useState('');

  // Testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState('');

  // ========== STATIC DATA ==========
  // ✅ TAMBAH: Features array yang hilang
  const features = [
    {
      icon: HiGlobeAlt,
      title: "Destinasi Terpilih",
      description:
        "Akses ke destinasi wisata terbaik di seluruh Indonesia dengan pengalaman unik.",
    },
    {
      icon: HiShieldCheck,
      title: "Terpercaya & Aman",
      description:
        "Asuransi perjalanan lengkap dan panduan profesional bersertifikat.",
    },
    {
      icon: HiLightningBolt,
      title: "Fleksibel & Cepat",
      description:
        "Proses booking mudah dan dapat disesuaikan dengan kebutuhan Anda.",
    },
    {
      icon: HiUserGroup,
      title: "Tim Berpengalaman",
      description:
        "Tim profesional yang siap membantu 24/7 untuk pengalaman terbaik.",
    },
  ];

  // ========== FETCH DATA ==========
  useEffect(() => {
    // ✅ TAMBAH: Fetch Packages
    const fetchPackages = async () => {
      try {
        setPackagesLoading(true);
        console.log('📥 Fetching packages...');
        const data = await packageService.getAll();

        // Handle response format
        const packageList = Array.isArray(data) ? data : data?.data || [];
        setPackages(packageList);

        console.log('✅ Packages loaded successfully:', packageList.length, 'items');
      } catch (err) {
        const errorMsg = typeof err === 'string' ? err : err?.message || 'Gagal memuat paket wisata';
        setPackagesError(errorMsg);
        console.error('❌ Packages error:', errorMsg);
        setPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    };

    // Fetch Testimonials
    const fetchTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        console.log('📥 Fetching testimonials...');

        const data = await testimonialsService.getAll();

        // 🔍 DEBUG LENGKAP
        console.log('=== TESTIMONIAL DEBUG ===');
        console.log('1️⃣ Raw API Response:', data);
        console.log('2️⃣ Type:', typeof data);
        console.log('3️⃣ Is Array?:', Array.isArray(data));
        console.log('4️⃣ Length:', data?.length);
        if (data && data.length > 0) {
          console.log('5️⃣ First Item:', data[0]);
        }
        console.log('========================');

        // Validasi array
        const testimonialList = Array.isArray(data) ? data : [];

        console.log('6️⃣ Final testimonialList:', testimonialList);
        console.log('7️⃣ Final Length:', testimonialList.length);

        setTestimonials(testimonialList);
        console.log('✅ Testimonials loaded successfully:', testimonialList.length, 'items');
      } catch (err) {
        const errorMsg = typeof err === 'string' ? err : err?.message || 'Gagal memuat testimoni';
        setTestimonialsError(errorMsg);
        console.error('❌ Testimonials error:', errorMsg);
        setTestimonials([]);
      } finally {
        setTestimonialsLoading(false);
      }
    };

    // ✅ Call both fetch functions
    fetchPackages();
    fetchTestimonials();
  }, []); // Empty dependency array = fetch sekali saat mount

  // Ambil 3 paket featured dari data yang diload
  const featuredPackages = packages.slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Why Choose Us */}
      <section className="py-4xl bg-neutral">
        <div className="max-w-7xl mx-auto px-lg">
          <SectionTitle
            title="Mengapa Memilih Harmoni Travel?"
            description="Kami berkomitmen memberikan pengalaman wisata terbaik dengan standar kualitas tinggi"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2xl mt-3xl">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-xl text-center hover:shadow-medium transition-all duration-300"
                >
                  <div className="mx-auto mb-lg">
                    <Icon className="w-12 h-12 text-secondary mx-auto" />
                  </div>
                  <h3 className="font-poppins font-bold text-dark mb-md">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-4xl bg-white">
        <div className="max-w-7xl mx-auto px-lg">
          <SectionTitle
            title="Paket Wisata Terfavorit"
            description="Jelajahi koleksi paket wisata terbaik kami yang telah dipercaya ribuan wisatawan"
          />

          {/* Loading State */}
          {packagesLoading && (
            <div className="mt-3xl text-center py-8">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Memuat paket wisata...</p>
            </div>
          )}

          {/* Error State */}
          {packagesError && !packagesLoading && (
            <div className="mt-3xl p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p>{packagesError}</p>
            </div>
          )}

          {/* Packages Grid */}
          {!packagesLoading && !packagesError && (
            <>
              {featuredPackages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl mt-3xl">
                  {featuredPackages.map((pkg, index) => (
                    <PackageCard key={pkg.id} package={pkg} index={index} />
                  ))}
                </div>
              ) : (
                <div className="mt-3xl text-center py-8 text-gray-600">
                  <p>Tidak ada paket wisata yang tersedia</p>
                </div>
              )}
            </>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-3xl"
          >
            <a
              href="/packages"
              className="inline-block px-2xl py-lg font-inter font-bold text-primary bg-neutral rounded-lg hover:bg-opacity-70 transition-all duration-300"
            >
              Lihat Semua Paket →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-4xl bg-neutral">
        <div className="max-w-7xl mx-auto px-lg">
          <SectionTitle
            title="Testimoni dari Pengunjung Kami"
            description="Ribuan wisatawan telah merasakan pengalaman luar biasa bersama kami"
          />

          {/* Loading State */}
          {testimonialsLoading && (
            <div className="mt-3xl text-center py-8">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-600">Memuat testimoni...</p>
            </div>
          )}

          {/* Error State */}
          {testimonialsError && !testimonialsLoading && (
            <div className="mt-3xl p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              <p>{testimonialsError}</p>
            </div>
          )}

          {/* Testimonials Carousel */}
          {!testimonialsLoading && !testimonialsError && (
            <div className="mt-3xl">
              {testimonials.length > 0 ? (
                <TestimonialCarousel testimonials={testimonials} />
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <p>Tidak ada testimoni yang tersedia</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-4xl text-white relative overflow-hidden"
        style={{
          backgroundImage: "url('/background-tour.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto text-center px-lg"
        >
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl mb-lg text-secondary">
            Siap untuk Petualangan?
          </h2>
          <p className="font-inter text-lg text-gray-200 mb-2xl">
            Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran
            terbaik untuk liburan impian Anda.
          </p>

          <a
            href="https://wa.me/6288227250909?text=Saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-2xl py-lg font-inter font-bold text-lg text-primary bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-medium hover:shadow-lg"
          >
            Konsultasi Gratis via WhatsApp
          </a>
        </motion.div>
      </motion.section>
    </div>
  );
}