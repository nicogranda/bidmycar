// RequireAuth.js
import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Cargando sesión...</div>;

  if (!user) {
    // Guardamos la ruta original en state.from
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
