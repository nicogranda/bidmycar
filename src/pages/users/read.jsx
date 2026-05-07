// pages/users/useCurrentUser.js
import { useState, useEffect } from "react";

// Hook reutilizable
const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users/read.php")
      .then(res => {
        if (!res.ok) throw new Error("No autenticado");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
};

export default useCurrentUser;

