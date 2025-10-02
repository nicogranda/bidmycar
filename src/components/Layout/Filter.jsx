import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Filter.css';

const Filter = ({ onFilterChange }) => {
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1981; y--) {
      years.push(y);
    }
    setYearOptions(years);
  }, []);

  // Actualizar filtros cuando cambian selectores
  useEffect(() => {
    onFilterChange({
      ...(selectedYear && { year: selectedYear }),
      ...(selectedTransmission && { transmission: selectedTransmission }),
      ...(selectedStyle && { body_style: selectedStyle }),
    });
  }, [selectedYear, selectedTransmission, selectedStyle]);

  // Extra: Si cambias sort en la URL, también es un filtro
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sort = params.get('sort');

    let sortFilters = {};
    if (sort === 'ending_soon') {
      sortFilters = { order_by: 'updated_at', order: 'asc' };
    } else if (sort === 'recent') {
      sortFilters = { order_by: 'created_at', order: 'desc' };
    } else if (sort === 'no_reserve') {
      sortFilters = { reserve_price: '0' };
    } else if (sort === 'lowest_mileage') {
      sortFilters = { order_by: 'mileage', order: 'asc' };
    } else if (sort === 'near_me') {
      sortFilters = { location: 'near' };
    }

    onFilterChange(sortFilters);
  }, [location.search]);

  return (
    <div className="filter">
      <div className="left">
        <div className='filter-id left-item'>
          <span className="desk-only">Subasta</span>
          <span className="mobile-only"><i className="fas fa-sliders-h"></i></span>
        </div>
        <select className="left-item" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">Año</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select className="left-item" value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)}>
          <option value="">Transmisión</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automático</option>
        </select>

        <select className="left-item" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
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
        <button onClick={() => navigate('/?sort=ending_soon')}>Finaliza Pronto</button>
        <button onClick={() => navigate('/?sort=recent')}>Recientes</button>
        <button onClick={() => navigate('/?sort=no_reserve')}>Sin Reservas</button>
        <button onClick={() => navigate('/?sort=lowest_mileage')}>Kilometraje</button>
        <button onClick={() => navigate('/?sort=near_me')}>Cerca de mí</button>
      </div>
    </div>
  );
};

export default Filter;
