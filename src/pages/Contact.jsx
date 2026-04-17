import { motion } from "framer-motion";
import { HiPhone, HiMail, HiLocationMarker, HiCheck } from "react-icons/hi";

export default function Contact() {
  const contactInfo = [
    {
      icon: HiPhone,
      label: "Telepon",
      value: "+62 812 3456 789",
      href: "tel:+628123456789",
    },
    {
      icon: HiMail,
      label: "Email",
      value: "info@harmontravel.com",
      href: "mailto:info@harmontravel.com",
    },
    {
      icon: HiLocationMarker,
      label: "Alamat",
      value: "Jakarta, Indonesia",
      href: "#",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary to-blue-900 text-white py-3xl"
      >
        <div className="max-w-7xl mx-auto px-lg text-center">
          <p className="font-inter text-lg font-semibold text-secondary mb-lg">
            Hubungi Kami
          </p>
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl mb-xl">
            Konsultasi & Pemesanan
          </h1>
          <p className="font-inter text-lg text-gray-200 max-w-2xl mx-auto">
            Hubungi tim kami untuk informasi lebih detail dan melakukan pemesanan
          </p>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-4xl">
        <div className="max-w-7xl mx-auto px-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3xl mb-3xl">
            {/* Contact Info Cards */}
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-2xl bg-neutral rounded-lg hover:shadow-medium transition-all duration-300 group"
                >
                  <div className="flex items-start gap-lg">
                    <div className="p-lg bg-primary text-white rounded-lg group-hover:bg-secondary transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-inter text-sm text-gray-500 uppercase font-semibold mb-md">
                        {info.label}
                      </p>
                      <p className="font-poppins font-bold text-dark text-lg">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3xl">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-poppins font-bold text-3xl text-dark mb-2xl">
                Kirim Pesan
              </h2>

              <form className="space-y-lg">
                <div>
                  <label className="font-inter text-sm font-semibold text-dark block mb-md">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda"
                    className="w-full px-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="font-inter text-sm font-semibold text-dark block mb-md">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    className="w-full px-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="font-inter text-sm font-semibold text-dark block mb-md">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                    className="w-full px-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="font-inter text-sm font-semibold text-dark block mb-md">
                    Paket Wisata yang Diminati
                  </label>
                  <select className="w-full px-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Pilih paket wisata</option>
                    <option>Yogyakarta Heritage</option>
                    <option>Raja Ampat Adventure</option>
                    <option>Lombok Beach Paradise</option>
                    <option>Bromo Sunrise Trek</option>
                    <option>Komodo Island Expedition</option>
                    <option>Ubud Cultural Experience</option>
                  </select>
                </div>

                <div>
                  <label className="font-inter text-sm font-semibold text-dark block mb-md">
                    Pesan
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tuliskan pertanyaan atau permintaan Anda"
                    className="w-full px-lg py-lg font-inter border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-lg py-lg font-inter font-bold text-white bg-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-medium hover:shadow-lg"
                >
                  Kirim Pesan
                </button>
              </form>
            </motion.div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-neutral rounded-lg p-2xl"
            >
              <h2 className="font-poppins font-bold text-3xl text-dark mb-2xl">
                Cara Tercepat Menghubungi Kami
              </h2>

              <div className="space-y-xl mb-2xl">
                <div className="flex gap-lg">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white mt-1">
                    <HiCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-primary mb-md">
                      WhatsApp (Paling Cepat)
                    </p>
                    <p className="font-inter text-gray-600">
                      Chat langsung dengan tim kami untuk response instan dan
                      konsultasi gratis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-lg">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white mt-1">
                    <HiCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-primary mb-md">
                      Telepon
                    </p>
                    <p className="font-inter text-gray-600">
                      Hubungi langsung untuk berbicara dengan tim profesional kami.
                    </p>
                  </div>
                </div>

                <div className="flex gap-lg">
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white mt-1">
                    <HiCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-primary mb-md">
                      Email
                    </p>
                    <p className="font-inter text-gray-600">
                      Kirim email dengan detail kebutuhan Anda untuk penawaran custom.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/628123456789?text=Halo%20Harmoni%20Travel%2C%20saya%20ingin%20berkonsultasi%20tentang%20paket%20wisata"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-lg py-lg font-inter font-bold text-white text-center bg-accent rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-medium"
              >
                Chat via WhatsApp
              </a>

              {/* FAQ */}
              <div className="mt-3xl pt-2xl border-t border-gray-300">
                <h3 className="font-poppins font-bold text-dark mb-lg">
                  Jam Operasional
                </h3>
                <p className="font-inter text-gray-600 mb-md">
                  <span className="font-semibold">Senin - Jumat:</span> 09:00 - 18:00 WIB
                </p>
                <p className="font-inter text-gray-600 mb-md">
                  <span className="font-semibold">Sabtu:</span> 10:00 - 16:00 WIB
                </p>
                <p className="font-inter text-gray-600">
                  <span className="font-semibold">Minggu:</span> Tutup / WhatsApp 24jam
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
