import React, { useState, useEffect } from 'react';

const LocationLookup = ({ zipCode }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Función para hacer la solicitud a la API
  const fetchLocation = async () => {
    try {
      console.log("Comprobando código postal:", zipCode);
      const response = await fetch(`http://localhost:8888/bidmycar/backend/api/location.php?zip=${zipCode}`, {
        headers: {
          'Accept': 'application/json', // Le indica al servidor que esperamos un JSON
        },
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error al hacer fetch: ${response.status}`);
      }

      const data = await response.json(); // Analizar la respuesta como JSON

      console.log("Datos de la respuesta:", data);
      setLocation(data); // Guardamos los datos recibidos en el estado
    } catch (error) {
      console.error("Error al hacer fetch a la API:", error);
      setError("No se pudo obtener la ubicación."); // Si ocurre un error, mostrarlo en el estado
    }
  };

  useEffect(() => {
    if (zipCode) {
      fetchLocation(); // Realizar la solicitud cuando el código postal cambie
    }
  }, [zipCode]); // Dependencia: la solicitud se ejecuta cada vez que cambia zipCode

  return (
    <div>
      {error && <p>{error}</p>}
      {location ? (
        <div>
      
          <p> {location.city} | {location.state}</p>
        </div>
      ) : (
        <p>Cargando ubicación...</p>
      )}
    </div>
  );
};

export default LocationLookup;
