// auth/RequireOwner.jsx
import { useState, useEffect, cloneElement } from 'react';
import { Navigate } from 'react-router-dom';
import { getConfig } from '../../config/env';

export default function RequireOwner({ vehicleId, children }) {
  const { apiUrl } = getConfig();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchData = async () => {
      try {
        // 1. Obtener sesión
        const sessionRes = await fetch(`${apiUrl}/api/session.php`, { credentials: 'include' });
        const sessionData = await sessionRes.json();

        if (!sessionData.session?.user) {
          setLoading(false);
          return;
        }

        setUser(sessionData.session.user);

        // 2. Obtener vehículo
        const vehicleRes = await fetch(`${apiUrl}/api/products/get.php?id=${vehicleId}`);
        const vehicleData = await vehicleRes.json();

        if (vehicleData.status === 'success') {
          setVehicle(vehicleData.vehicle);

          // 3. Comparar owner_id
          if (String(vehicleData.vehicle.owner_id) === String(sessionData.session.user.id)) {
            setAuthorized(true);
          }
          
        }
      } catch (err) {
        console.error('Error fetch RequireOwner:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, vehicleId]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!authorized) return <div>No autorizado para acceder a este vehículo.</div>;

  // Pasar user y vehicle como props a los children
  return cloneElement(children, { user, vehicle });
}
