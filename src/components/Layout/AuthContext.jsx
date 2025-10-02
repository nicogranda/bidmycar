// src/components/Layout/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getConfig } from '../../config/env';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { apiUrl } = getConfig();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/session.php`, { credentials: 'include' });
        const data = await res.json();

        // ✅ Solo consideramos usuario válido si tiene id
        if (data.session?.user?.id) {
          setUser(data.session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error cargando sesión:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [apiUrl]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
