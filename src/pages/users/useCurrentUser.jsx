// pages/users/useCurrentUser.js
import { useState, useEffect } from "react";
import { getConfig } from '../../config/env';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiUrl } = getConfig();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/read.php`, {
          credentials: "include"
        });
        
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "No autenticado");
        }

        setUser({
          user_id: data.user_id,
          email: data.email,
          name: data.name,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useCurrentUser;
