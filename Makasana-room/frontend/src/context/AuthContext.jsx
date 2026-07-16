import { createContext, useContext, useState, useCallback } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ochre_admin_token"));

  const login = useCallback(async (email, password) => {
    const res = await client.post("/api/auth/login", { email, password });
    localStorage.setItem("ochre_admin_token", res.data.access_token);
    setToken(res.data.access_token);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ochre_admin_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
