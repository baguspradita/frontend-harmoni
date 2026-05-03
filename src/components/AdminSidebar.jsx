import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpeg";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  HiMenuAlt3,
  HiX,
  HiHome,
  HiShoppingBag,
  HiStar,
  HiPhotograph,
  HiCog,
  HiLogout,
  HiChevronRight,
  HiTag,
  HiTicket,
  HiClock
} from "react-icons/hi";



export default function AdminSidebar({ currentTab, onTabChange }) {

  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(null);

  // Update session time setiap menit
  useEffect(() => {
    const updateSessionTime = () => {
      const remaining = authService.getSessionTimeRemaining();
      setSessionTime(remaining);

      // Warn jika kurang dari 5 menit
      if (remaining && remaining.hours === 0 && remaining.minutes < 5) {
        console.warn('⏰ Session akan expired dalam', remaining.minutes, 'menit');
      }
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 60000); // update setiap 1 menit

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    console.log('🚪 Logging out...');
    await authService.logout();
    navigate('/login');
  };

  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: HiHome,
    },
    {
      id: "packages",
      label: "Paket Wisata",
      icon: HiTicket,
    },
    {
      id: "categories",
      label: "Kategori",
      icon: HiTag,
    },
    {
      id: "testimonials",
      label: "Ulasan",
      icon: HiStar,
    },
    {
      id: "gallery",
      label: "Galeri Media",
      icon: HiPhotograph,
    },
  ];

  const user = authService.getUserData();
  const userName = user?.name;
  const userEmail = user?.email;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-6 left-6 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all"
        >
          {isOpen ? <HiX className="w-5 h-5" /> : <HiMenuAlt3 className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-200 z-40 flex flex-col"
      >
        {/* Logo Section */}
        <div className="px-6 py-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-xl tracking-tight text-slate-900">
                Harmoni<span className="text-indigo-600">.</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-3 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Navigasi</p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-500/5"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="dot" className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          {/* Session Timer Display */}
          {sessionTime && (
            <div className="flex items-center gap-2 px-3 py-2 mb-3 bg-blue-50 rounded-lg border border-blue-100">
              <HiClock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-blue-900">
                {sessionTime.hours > 0
                  ? `${sessionTime.hours}h ${sessionTime.minutes}m sisa`
                  : `${sessionTime.minutes}m sisa`
                }
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 p-2 mb-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f1f5f9&color=6366f1&bold=true`}
              alt="Avatar"
              className="w-9 h-9 rounded-lg border border-slate-200"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all font-bold text-xs"
          >
            <HiLogout className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <div className={`hidden lg:block transition-all duration-500 ${isOpen ? "w-72" : "w-0"} flex-shrink-0`} />
    </>
  );
}



