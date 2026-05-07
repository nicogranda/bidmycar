// auth/AuthGuard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getConfig } from '../../config/env';
import r200Icon from '../../assets/icons/keys/r200.svg'; // Ajusta la ruta según tu estructura


const AuthGuard = ({ allowAdmin = true, redirectTo = '/login', children }) => {
  const { user, loading } = useAuth();
  const { apiUrl } = getConfig();
  const navigate = useNavigate();
  const { id: vehicleId } = useParams();

  const [resource, setResource] = useState(null);
  const [loadingResource, setLoadingResource] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return; // no hay user → no fetch
      if (!vehicleId) return setLoadingResource(false); // no hay ID → no fetch

      try {
        const res = await fetch(
          `${apiUrl}/index.php?page=product&action=show&id=${vehicleId}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (!data.success) {
          setAuthorized(false);
          setResource(null);
        } else {
          setResource(data.vehicle);

          const isOwner = String(data.vehicle.owner_id) === String(user.id);
          const isAdmin = allowAdmin && user.role === 'admin';
          setAuthorized(isOwner || isAdmin);
        }
      } catch (err) {
        console.error('AuthGuard fetch error:', err);
        setAuthorized(false);
      } finally {
        setLoadingResource(false);
      }
    };

    if (!loading) checkAccess();
  }, [user, loading, vehicleId, apiUrl, allowAdmin]);

  if (loading || loadingResource)
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Cargando permisos…</div>;

  if (!user) {
    navigate(redirectTo, { replace: true });
    return null; // importante devolver null para no renderizar nada
  }

  if (!authorized)
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <img
        src={r200Icon}
        alt="No autorizado"
        style={{ width: '300px' }}
      />
    </div>
  );


  // Pasa user y vehicle al hijo
  return React.cloneElement(children, { user, vehicle: resource });
};

export default AuthGuard;
