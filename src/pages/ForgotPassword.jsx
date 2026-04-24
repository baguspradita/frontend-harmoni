import { useState } from "react";
import { motion } from "framer-motion";
import { HiMail, HiArrowNarrowLeft, HiCheckCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulasi pengiriman email reset password
    if (email === "admin@harmoni.com") {
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    } else {
      setTimeout(() => {
        setError("Email tidak ditemukan. Gunakan: admin@harmoni.com");
        setIsLoading(false);
      }, 1000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            {/* Success Header */}
            <div className="relative h-24 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative"
              >
                <HiCheckCircle className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            {/* Success Content */}
            <div className="p-8 md:p-10">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-outfit font-bold text-slate-900 mb-3">
                  Email Terkirim!
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Kami telah mengirimkan link reset password ke email Anda. Silakan cek email dan ikuti instruksi untuk mereset password.
                </p>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-8">
                  <p className="text-indigo-900 font-medium text-sm">{email}</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-sm uppercase tracking-widest"
                  >
                    Kembali ke Login
                  </button>
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    className="w-full py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all duration-300 text-sm uppercase tracking-widest"
                  >
                    Coba Email Lain
                  </button>
                </div>
              </motion.div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-xs text-slate-600">
                  Tidak menerima email? Cek folder spam atau hubungi support.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header Section */}
          <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="relative text-center"
            >
              <h1 className="text-3xl font-outfit font-bold text-white">Reset Password</h1>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-outfit font-bold text-slate-900 mb-2">
                Lupa Password?
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                Masukkan email admin Anda dan kami akan mengirimkan link untuk mereset password.
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-700 text-xs font-medium">{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@harmoni.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400"
                    required
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim Link Reset"
                )}
              </motion.button>
            </form>

            {/* Back to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors group"
              >
                <HiArrowNarrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Login
              </button>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="px-8 md:px-10 py-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              © 2024 Harmoni Travel. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CSS untuk animasi blob */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}