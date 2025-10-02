import React from 'react';

const BodyStyleSelect = ({
  value,
  onChange,
  onBlur,
  name = 'body_style',
  id = 'body_style',
  required = false,
  showError
}) => {
  const options = [
    { value: 'Sedan', label: 'Sedán' },
    { value: 'Coupe', label: 'Coupé' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Hatchback', label: 'Compacto' }, // Descomenta si lo necesitas
    { value: 'Pickup', label: 'Pickup' },
    { value: 'Van', label: 'Furgoneta' },
    { value: 'Wagon', label: 'Familiar' },
    { value: 'Convertible', label: 'Convertible' },
    { value: 'Motorhome', label: 'Caravana' },
    { value: 'Monovolumen', label: 'Monovolumen' },
    { value: 'Other', label: 'Otra' },
  ];

  return (
    <div className="form-group">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      >
        <option value="">Indica el tipo de carrocería</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {showError && !value && (
        <div className="error-message">Por favor, selecciona el tipo de carrocería.</div>
      )}
    </div>
  );
};

export default BodyStyleSelect;
