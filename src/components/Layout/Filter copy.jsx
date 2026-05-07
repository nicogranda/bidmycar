import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Filter.css';

const Filter = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Generar lista de años
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1980 + 1 }, (_, i) => currentYear - i);
    setYearOptions(years);
  }, []);

  // Sincronizar selects con la URL al cargar / cambiar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedYear(params.get('year') || '');
    setSelectedTransmission(params.get('transmission') || '');
    setSelectedStyle(params.get('body_style') || '');
  }, [location.search]);

  // Función para actualizar la URL con el filtro
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (!value) params.delete(key);
    else params.set(key, value);
    navigate({ pathname: '/', search: params.toString() });
  };

  // Botón “Cerca de mí” (igual que antes)
  const handleNearMe = async () => {
    const redirectTo = (url) => {
      if (window.location.hostname === "localhost") navigate(url);
      else window.location.href = url;
    };
    const fallbackByIP = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        redirectTo(`/?sort=near_me&zip_code=${data.postal || ''}`);
      } catch {
        redirectTo('/?sort=near_me');
      }
    };
    if (!navigator.geolocation) return fallbackByIP();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
          const data = await res.json();
          const postal = data.address?.postcode;
          if (postal) redirectTo(`/?sort=near_me&zip_code=${postal}`);
          else redirectTo(`/?sort=near_me&lat=${latitude}&lng=${longitude}`);
        } catch {
          redirectTo(`/?sort=near_me&lat=${latitude}&lng=${longitude}`);
        }
      },
      () => fallbackByIP(),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  return (
    <div className="filter">
      <div className="left">
        <div
          className="filter-id left-item"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <span className="desk-only"><h1>Subasta</h1></span>
          <span className="mobile-only"><i className="fas fa-sliders-h"></i></span>
        </div>

        <select
          className="left-item"
          value={selectedYear}
          onChange={(e) => updateFilter('year', e.target.value)}
        >
          <option value="">Año</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="left-item"
          value={selectedTransmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
        >
          <option value="">Transmisión</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automático</option>
        </select>

        <select
          className="left-item"
          value={selectedStyle}
          onChange={(e) => updateFilter('body_style', e.target.value)}
        >
          <option value="">Estilo</option>
          <option value="Sedan">Sedán</option>
          <option value="Coupe">Coupé</option>
          <option value="SUV">SUV</option>
          <option value="Pickup">Pickup</option>
          <option value="Van">Van</option>
          <option value="Wagon">Wagon</option>
          <option value="Convertible">Convertible</option>
          <option value="Motorhome">Caravana</option>
          <option value="Other">Otra</option>
        </select>
      </div>

      <div className="right">
        <button onClick={() => navigate('/?sort=ending_soon')}>Finalizando</button>
        <button onClick={() => navigate('/?sort=recent')}>Recientes</button>
        <button onClick={() => navigate('/?sort=lowest_mileage')}>Kilometraje</button>
        <button onClick={handleNearMe}>Cerca de mí</button>
      </div>
    </div>
  );
};

export default Filter;
