"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  isVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      const u = localStorage.getItem("user");
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  async function login(email: string, password: string) {
    const res = await axios.post(API_URL + "/auth/login", { email, password });
    const data = res.data.data;
    if (!data || !data.token || !data.user) throw new Error("Invalid response");
    const u = { id: data.user.id, name: data.user.name, email: data.user.email, isVerified: data.user.isVerified };
    setUser(u);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(u));
  }

  async function register(name: string, email: string, password: string) {
    const res = await axios.post(API_URL + "/auth/register", { name, email, password });
    const data = res.data.data;
    if (!data || !data.token || !data.user) throw new Error("Invalid response");
    const u = { id: data.user.id, name: data.user.name, email: data.user.email, isVerified: data.user.isVerified };
    setUser(u);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(u));
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth used outside AuthProvider");
  return ctx;
}
