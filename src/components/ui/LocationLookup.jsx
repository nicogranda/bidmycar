import React, { useState, useEffect } from 'react';
import { getConfig } from '../../config/env'; 

const LocationLookup = ({ zipCode, children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const { apiUrl } = getConfig();

  useEffect(() => {
    if (!zipCode) return;

    const fetchLocation = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/location-lookup.php?zip=${zipCode}`, {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error al hacer fetch: ${response.status}`);
        }

        const data = await response.json();
        setLocation(data);
      } catch (error) {
        console.error("Error al hacer fetch a la API:", error);
        setError("No se pudo obtener la ubicación.");
      }
    };

    fetchLocation();
  }, [zipCode, apiUrl]);

  if (!zipCode) return null;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!location) return <p>Cargando ubicación...</p>;

  // 👉 Si el padre mandó una función como children, úsala
  if (typeof children === 'function') {
    return children(location);
  }

  // 👉 Comportamiento normal
  return (
    <span>
      {/* {location.city} |  */}
      {location.state}
    </span>
  );
};

export default LocationLookup;
