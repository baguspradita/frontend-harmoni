import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Array of Indonesia travel related URLs from Unsplash
        const imageList = [
          "https://images.unsplash.com/photo-1537225228614-b19960eeb4e0?w=400&q=80",
          "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
          "https://images.unsplash.com/photo-1552733407-5d5c46b3da98?w=400&q=80",
          "https://images.unsplash.com/photo-1501572101042-dac3214191ef?w=400&q=80",
          "https://images.unsplash.com/photo-1488646953014-85cb937266d7?w=400&q=80",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
          "https://images.unsplash.com/photo-1584622181054-ca0e70bcb746?w=400&q=80",
          "https://images.unsplash.com/photo-1511576661531-b34d7da5d0bb?w=400&q=80",
          "https://images.unsplash.com/photo-1470252649378-9c29740ff023?w=400&q=80",
          "https://images.unsplash.com/photo-1530521954074-e64f47ba6d0f?w=400&q=80",
        ];

        const processedImages = imageList.map((url, index) => ({
          id: index,
          urls: { regular: url },
          alt_description: `Gambar wisata Indonesia ${index + 1}`,
        }));

        setImages(processedImages);
        setLoading(false);
      } catch (error) {
        console.error("Error loading images:", error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          backgroundImage: "url('/logo.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '400px',
        }}
        className="py-8xl"
      >
      </motion.section>

      {/* Text Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white py-3xl"
      >
        <div className="max-w-7xl mx-auto px-lg text-center">
          <h1 className="font-poppins font-bold text-4xl sm:text-5xl md:text-6xl mb-xl text-dark">
            Galeri Destinasi
          </h1>
          <p className="font-inter text-lg text-gray-600 max-w-2xl mx-auto">
            Lihat keindahan destinasi wisata Indonesia melalui koleksi foto kami
          </p>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <section className="py-4xl">
        <div className="max-w-7xl mx-auto px-lg">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-lg"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(image)}
                  className="relative h-56 bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-lg"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            className="absolute top-lg right-lg text-white hover:text-gray-300 z-51"
          >
            <HiX className="w-8 h-8" />
          </button>

          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={selectedImage.urls.regular}
            alt={selectedImage.alt_description}
            className="max-w-4xl max-h-[80vh] object-contain rounded-lg"
          />
        </motion.div>
      )}
    </div>
  );
}
