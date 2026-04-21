import { motion } from "framer-motion";
import { useState } from "react";
import HeroSection from "../components/HeroSection";
import SectionTitle from "../components/SectionTitle";
import PackageCard from "../components/PackageCard";
import TestimonialCarousel from "../components/TestimonialCarousel";
import { packages } from "../data/packages";
import { testimonials } from "../data/testimonials";
import { blogs } from "../data/blog";
import {
  HiGlobeAlt,
  HiShieldCheck,
  HiLightningBolt,
  HiUserGroup,
} from "react-icons/hi";

export default function Home() {
  const featuredPackages = packages.slice(0, 3);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2xl mt-3xl">
            {featuredPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>

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

          <div className="mt-3xl">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
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
