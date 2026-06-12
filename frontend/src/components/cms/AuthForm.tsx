import React, { useState } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

const AuthForm: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const COOKIE_NAME = "access_token";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiClient.post("/users/login", {
        username: login,
        password: password,
      });

      const token = response.data.token;

      if (token) {
        document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=864000; SameSite=Lax`;

        window.location.href = "/cms/dashboard";
      } else {
        throw new Error("Токен не получен от сервера");
      }
    } catch (err) {
      document.cookie = "${COOKIE_NAME}=; path=/; max-age=0";

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message || err.response?.data;
        setError(
          typeof serverMessage === "string"
            ? serverMessage
            : "Неверный логин или пароль",
        );
      } else {
        setError("Ошибка! Попробуйте позже...");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-105 max-w-full mx-auto border border-slate-200 rounded-3xl p-8 bg-white shadow-sm">
      <div className="text-center mb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
          Админ-панель
        </span>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-950">
          Авторизация
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
            Логин
          </label>
          <input
            type="text"
            required
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Введите логин"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-950 transition-colors bg-slate-50/50 text-slate-900 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
            Пароль
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-950 transition-colors bg-slate-50/50 text-slate-900 disabled:opacity-50"
          />
        </div>

        {error && (
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 py-3 px-4 rounded-xl text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group w-full px-7 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-all duration-150 ease-out flex items-center justify-center gap-2.5 hover:-translate-y-px active:translate-y-px bg-slate-950 text-white hover:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none"
        >
          <span>{isLoading ? "Вход..." : "Войти в систему"}</span>

          {!isLoading && (
            <svg
              className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover:translate-x-1 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
