import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

interface User {
  username: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get("/users/me");
        setUser(res.data);
      } catch (err) {
        document.cookie = "Token=; path=/; max-age=0";
        window.location.href = "/cms/auth";
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await apiClient.post("/users/logout");
    } finally {
      document.cookie = "Token=; path=/; max-age=0";
      window.location.href = "/cms/auth";
    }
  };

  return { user, loading, logout };
};