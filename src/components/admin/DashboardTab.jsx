import { motion } from "framer-motion";
import {
  HiOutlineChartBar,
  HiOutlineShoppingCart,
  HiCurrencyDollar,
  HiSparkles,
} from "react-icons/hi";

export default function DashboardTab({ packageList, categoryList }) {
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
          { label: "Total Packages", value: packageList.length, icon: HiOutlineShoppingCart, color: "indigo" },
          { label: "Active Categories", value: categoryList.length, icon: HiOutlineChartBar, color: "emerald" }
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

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-outfit font-bold text-slate-900 text-sm">Top Performing Packages</h3>
            <button className="text-[11px] font-bold text-indigo-600 hover:underline tracking-tight">View Analytics</button>
          </div>
          <div className="divide-y divide-slate-50">
            {packageList.slice(0, 4).map((pkg) => (
              <div key={pkg.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <img src={pkg.image} className="w-10 h-10 rounded-lg object-cover grayscale-[20%] hover:grayscale-0 transition-all" alt="" />
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{pkg.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{pkg.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-xs">IDR {pkg.price}</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter mt-0.5">High Demand</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
