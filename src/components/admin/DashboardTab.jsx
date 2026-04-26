import { motion } from "framer-motion";
import {
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiCurrencyDollar,
  HiSparkles,
  HiTag,
  HiStar,
  HiPhotograph,
  HiTicket
} from "react-icons/hi";

export default function DashboardTab({ packageList, categoryList, testimonialList, galleryList }) {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Total Packages", value: packageList.length, icon: HiTicket, color: "indigo" },
          { label: "Active Categories", value: categoryList.length, icon: HiTag, color: "emerald" },
          { label: "Testimonials", value: testimonialList.length, icon: HiStar, color: "amber" },
          { label: "Gallery Items", value: galleryList.length, icon: HiPhotograph, color: "blue" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                <stat.icon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-outfit font-bold text-slate-900">{stat.value}</h2>

            </div>
          </div>
        ))}
      </div>

      
    </motion.div>
  );
}
