import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as apiService from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const data = await apiService.login(email, password);
      if (!data || !data.success) return { ok: false, message: data?.message || "Login failed" };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const register = async (name, email, role, password) => {
    try {
      const data = await apiService.register(name, email, password, role);
      if (!data || !data.success) return { ok: false, message: data?.message || "Register failed" };
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
