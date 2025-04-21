import React, { useState, useEffect } from 'react';
import './Filter.css';  // Importamos el archivo CSS que contiene los estilos del filtro

const Filter = () => {
  const [yearOptions, setYearOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');

  useEffect(() => {
    // Generar años desde 1981 hasta el actual
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1981; y--) {
      years.push(y);
    }
    setYearOptions(years);
  }, []);

  return (
    <div className="filter">
      <strong className="left">Subasta</strong>

      <select 
        className="left"
        name="year" 
        id="year" 
        value={selectedYear} 
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">Año</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      <select 
        className="left"
        name="transmission" 
        id="transmission" 
        value={selectedTransmission} 
        onChange={(e) => setSelectedTransmission(e.target.value)}
      >
        <option value="">Transmisión</option>
        <option value="manual">Manual</option>
        <option value="automatic">Automático</option>
      </select>

      <select 
        className="left"
        name="style" 
        id="style" 
        value={selectedStyle} 
        onChange={(e) => setSelectedStyle(e.target.value)}
      >
        <option value="">Estilo</option>
        <option value="sedan">Turismo</option>
        <option value="van">Furgoneta</option>
        <option value="truck">Camión</option>
        <option value="motorcycle">Motocicleta</option>
        <option value="bus">Bus</option>
      </select>
  
     <div className="right">
      <button  name="ending_soon">Finaliza Pronto</button>
      <button  name="recent">Recientes</button>
      <button  name="no_reserve">Sin Reservas</button>
      <button  name="lowest_mileage">Kilometraje</button>
      <button  name="near_me">Cerca de mí</button>
      </div>
    </div>
  );
};

export default Filter;
