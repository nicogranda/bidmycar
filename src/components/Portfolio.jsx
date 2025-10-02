import React, { useState } from 'react';
import Filter from './Filter';
import Gallery from './Gallery';
import { getConfig } from './config';

const Portfolio = () => {
  const [filter, setFilters] = useState({ order_by: 'created_at', order: 'asc' });
  const { apiUrl } = getConfig();

  const handleFilterChange = async (newFilters) => {
    // Si no hay filtro especial, aplicar tal cual
    if (newFilters.location !== 'near') {
      setFilters(newFilters);
      return;
    }

    try {
      const geo = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude, longitude } = geo.coords;

      // Suponiendo que tienes un endpoint en el backend que da el zip
      const res = await fetch(`${apiUrl}/api/location-lookup.php?lat=${latitude}&lon=${longitude}`);
      const data = await res.json();

      if (data.zip_code) {
        setFilters({ ...newFilters, zip_code: data.zip_code });
      } else {
        console.warn('No se pudo obtener el zip_code');
      }
    } catch (err) {
      console.error('Error obteniendo ubicación:', err);
    }
  };

  return (
    <>
      <Filter onFilterChange={handleFilterChange} />
      <Gallery filter={filter} />
    </>
  );
};

export default Portfolio;
