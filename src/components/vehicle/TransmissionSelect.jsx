import React from 'react';

const TransmissionSelect = ({
  value,
  onChange,
  onBlur,
  name = 'transmission',
  id = 'transmission',
  required = false,
  showError
}) => {
  const options = [
    { value: 'Automatic', label: 'Automático' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Other', label: 'Otro' },
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
        <option value="">Indica la transmisión</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {showError && !value && (
        <span className="error-message">Este campo es obligatorio.</span>
      )}
    </div>
  );
};

export default TransmissionSelect;
