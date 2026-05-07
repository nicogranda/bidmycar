import React, { useState, useEffect } from 'react';
import { getConfig } from '../../config/env';
import './BodyStyleSelect.css';

const BodyStyleSelect = ({ value, onChange, name = 'body_style', showError }) => {
  const { apiUrl } = getConfig();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchBodyStyles = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/components/body_styles.php`);
        const data = await res.json();

        // Transformamos para que tenga la estructura que usabas en el array
        const formatted = data.map(item => ({
          value: item.value,
          label: item.label,
          icon: item.icon,
          iconWhite: item.icon_white
        }));

        setOptions(formatted);
      } catch (err) {
        console.error('Error fetching body styles:', err);
      }
    };

    fetchBodyStyles();
  }, [apiUrl]);

  return (
    <div>
      <p className="highlight">Seleccione tipo de carrocería</p>
      <div className="body-style-wrapper">
        <div className="body-style-grid">
          {options.map(({ value: val, label, icon, iconWhite }) => {
            const isSelected = value === val;
            const iconSrc = isSelected && iconWhite ? iconWhite : icon;

            return (
              <div
                key={val}
                className={`radio-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onChange(val)}
              >
                <input
                  type="radio"
                  id={`body-style-${val}`}
                  name={name}
                  value={val}
                  checked={isSelected}
                  onChange={() => onChange(val)}
                />
                <img src={iconSrc} alt={label} />
                <label htmlFor={`body-style-${val}`}>{label}</label>
              </div>
            );
          })}
        </div>
        {showError && !value && (
          <div className="error-message">Por favor, selecciona el tipo de carrocería.</div>
        )}
      </div>
    </div>
  );
};

export default BodyStyleSelect;
