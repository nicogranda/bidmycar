import React from 'react';

const DrivetrainSelect = ({
  value,
  onChange,
  name = 'drivetrain',
  id = 'drivetrain',
  required = false,
  showError,
  onBlur
}) => {
  const options = [
    { value: 'FWD', label: 'Tracción delantera (FWD)' },
    { value: 'RWD', label: 'Tracción trasera (RWD)' },
    { value: 'AWD', label: 'Tracción total (AWD)' },
    { value: '4WD', label: '4x4' },
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
        <option value="">Indica el tipo de tracción</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {showError && !value && (
        <div className="error-message">Por favor, selecciona el tipo de tracción.</div>
      )}
    </div>
  );
};

export default DrivetrainSelect;
