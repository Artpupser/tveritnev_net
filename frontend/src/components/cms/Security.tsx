import React, { useState, useEffect } from "react";
import Sidebar from "@/components/cms/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Key,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const Security: React.FC = () => {
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    repeat_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/cms/login";
    }
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await apiClient.post("/users/change_password", formData);

      if (typeof res.data === "string" && res.data.length > 0) {
        if (res.data.includes("Current password is wrong")) {
          throw new Error("Текущий пароль введен неверно");
        }
        if (res.data.includes("New password not equal with repeat password")) {
          throw new Error("Ошибка сервера.");
        }
        throw new Error(res.data);
      }

      setStatus({
        type: "success",
        message: "Пароль успешно изменен!",
      });
      setFormData({
        current_password: "",
        new_password: "",
        repeat_password: "",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: "Ошибка при смене пароля",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-slate-950 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Проверка доступа...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50/50 flex flex-col md:flex-row text-slate-900 select-none">
      <Sidebar />

      <main className="grow p-8 md:p-12 w-full max-w-5xl">
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-slate-950 text-white rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-slate-950">
              Безопасность
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Привет, {user?.username}. Здесь можно сменить пароль.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm"
            >
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                <Key size={12} /> Смена пароля
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-1 ml-1">
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-slate-950 focus:bg-white outline-none transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 ml-1">
                        Новый пароль
                      </label>
                      <input
                        type="password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-slate-950 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 mb-1 ml-1">
                        Повтор пароля
                      </label>
                      <input
                        type="password"
                        name="repeat_password"
                        value={formData.repeat_password}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-slate-950 focus:bg-white outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status.type && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                        status.type === "success"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}
                    >
                      {status.type === "success" ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full md:w-max px-10 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Сохранить новый пароль"
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 border border-slate-200 rounded-[2.5rem] bg-indigo-50/30">
              <h3 className="text-sm font-black uppercase tracking-widest text-indigo-950 mb-4 flex items-center gap-2">
                <Lock size={14} /> Защита
              </h3>
              <p className="text-[11px] font-bold uppercase text-indigo-900/60 leading-relaxed">
                После смены пароля вам не нужно перезаходить, сессия обновится
                автоматически в рамках текущего токена.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Security;
