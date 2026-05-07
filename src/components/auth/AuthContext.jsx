// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { getConfig } from "../../config/env";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { apiUrl } = getConfig();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Login centralizado
  const login = (userData) => {
    setUser(userData);
  };

  // 🔹 Logout centralizado (para el futuro)
  const logout = async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout.php`, {
        credentials: "include",
      });
    } catch {}
    setUser(null);
  };

  // 🔹 Cargar sesión desde backend (cookies)
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/session.php`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.session?.user || null);
      } catch (err) {
        console.error("Error cargando sesión:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
