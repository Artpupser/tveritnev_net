import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Layout,
  ShieldCheck,
  Image as ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Редактор", path: "/cms/dashboard", icon: Layout },
  { name: "Безопасность", path: "/cms/security", icon: ShieldCheck },
  { name: "Фотографии", path: "/cms/photos", icon: ImageIcon },
  { name: "Настройки", path: "/cms/settings", icon: Settings },
];

const Sidebar: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  return (
    <aside className="w-full md:w-72 border-r border-slate-200 bg-white p-6 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="flex flex-col gap-10">
        <div className="px-2">
          <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 tracking-[0.2em]">
            CMS Panel
          </span>
          <div className="font-bold text-2xl tracking-tighter text-slate-950 flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-950 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-white rotate-45" />
            </div>
            AT.TVERITNEV
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => (window.location.href = item.path)}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
                  ${
                    isActive
                      ? "bg-slate-950 text-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] translate-x-1"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  }
                `}
              >
                <item.icon
                  size={18}
                  className={`transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-900"
                  }`}
                />

                <span className="relative z-10">{item.name}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute left-2 w-1 h-5 bg-indigo-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {!isActive && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-r from-slate-100/50 to-transparent rounded-xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <button
          onClick={() => (window.location.href = "/cms/auth")}
          className="group w-full flex items-center justify-center gap-2 py-3.5 border border-slate-200 hover:border-red-100 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95"
        >
          <LogOut
            size={14}
            className="transition-transform group-hover:-translate-x-1"
          />
          Выйти
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
