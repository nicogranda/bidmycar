import { useState } from 'react';

const EnergyTypeSelect = ({ value, onChange, name = 'energy_type', id = 'energy_type', required = false, showError }) => {
  const [energyTypes] = useState([
    'Gasolina',
    'Diésel',
    'Eléctrico',
    'Híbrido Electro/Gasolina',
    'Híbrido Electro/Diesel',
    'Otro',
  ]);

  return (
    <div className="form-group">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Indica el tipo de combustible</option>
        {energyTypes.map((energyType, index) => (
          <option key={index} value={energyType}>
            {energyType}
          </option>
        ))}
      </select>
      {showError && !value && (
        <div className="error-message">Por favor, selecciona el tipo de energía.</div>
      )}
    </div>
  );
};

export default EnergyTypeSelect;
