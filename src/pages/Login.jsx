import { authService } from '../services/authService';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiGlobeAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logoImg from '../assets/logo.jpeg';


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: email.trim(),
        password
      });

      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isLoggedIn', 'true');

        if (response.user) {
          localStorage.setItem('userData', JSON.stringify(response.user));
        }

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        navigate('/admin');
      }
    } catch (err) {
      const errorMessage = typeof err === 'string'
        ? err
        : err.message || 'Login gagal. Silakan coba lagi.';

      setError(errorMessage);
      console.error('❌ Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center relative z-10"
      >
        {/* Left Side - Brand & Message */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden md:flex flex-col justify-center"
        >
          <div className="mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={logoImg}
                  alt="Harmoni Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-gray-900">Harmoni</h1>
                <p className="text-sm font-inter text-primary font-semibold">Travel & Tour</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl font-poppins font-bold text-gray-900 mb-4 leading-tight">
                Kelola Petualangan <br />
                <span className="text-primary">Perjalanan Anda</span>
              </h2>
              <p className="text-gray-600 font-inter text-lg leading-relaxed mb-8">
                Akses dashboard admin untuk mengelola paket wisata, destinasi, dan pengalaman pelanggan.
              </p>

              {/* Feature List */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-gray-900">Kelola Paket Wisata</p>
                    <p className="text-sm text-gray-500">Tambah, edit, dan hapus paket perjalanan Anda</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-gray-900">Galeri Destinasi</p>
                    <p className="text-sm text-gray-500">Tampilkan keindahan setiap lokasi wisata</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <p className="font-inter font-semibold text-gray-900">Testimoni Pelanggan</p>
                    <p className="text-sm text-gray-500">Kelola ulasan dan pengalaman pengunjung</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full"
        >
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-primary to-blue-700 px-8 py-6 text-center md:hidden">
              <h1 className="text-2xl font-poppins font-bold text-white">Harmoni</h1>
              <p className="text-blue-100 text-xs font-inter mt-1">Admin Dashboard</p>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-2">Masuk Akun Admin</h2>
                <p className="text-gray-600 text-sm font-inter mb-6">Kelola pengalaman wisata Anda dari sini</p>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-xs">!</span>
                  </div>
                  <p className="text-red-700 text-sm font-inter">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-poppins font-semibold text-gray-900 mb-2.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@harmoni.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-inter text-gray-900 placeholder:text-gray-400 transition-all"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-poppins font-semibold text-gray-900 mb-2.5">
                    Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-inter text-gray-900 placeholder:text-gray-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <HiEyeOff className="w-5 h-5" />
                      ) : (
                        <HiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Remember Me & Forgot Password */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-gray-700 font-inter group-hover:text-gray-900 transition-colors">Ingat saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-primary font-inter font-semibold hover:text-blue-700 bg-none border-none cursor-pointer p-0"
                  >
                    Lupa password?
                  </button>
                </motion.div>

                {/* Login Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: isLoading ? 1 : 1.01 }}
                  whileTap={{ scale: isLoading ? 1 : 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary text-white font-poppins font-bold rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sedang memproses...
                    </span>
                  ) : (
                    "Masuk ke Dashboard"
                  )}
                </motion.button>
              </form>


              
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-600 font-inter">
                © 2024 Harmoni Travel & Tour. Semua hak dilindungi.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}