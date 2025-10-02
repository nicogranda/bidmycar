import React from 'react';
import './BodyStyleSelect.css';

const options = [
  { value: 'Sedan', label: 'Sedán', icon: '/icons/_sedan.svg', iconWhite: '/icons/_white_sedan.svg' },
  { value: 'Coupe', label: 'Coupé', icon: '/icons/_coupe.svg', iconWhite: '/icons/_white_coupe.svg' },
  { value: 'SUV', label: 'SUV', icon: '/icons/_suv.svg', iconWhite: '/icons/_white_suv.svg' },
  { value: 'Hatchback', label: 'Compacto', icon: '/icons/_compacto.svg', iconWhite: '/icons/_white_compacto.svg' },
  { value: 'Pickup', label: 'Pickup', icon: '/icons/_pickup.svg', iconWhite: '/icons/_white_pickup.svg' },
  { value: 'Van', label: 'Furgoneta', icon: '/icons/_furgoneta.svg', iconWhite: '/icons/_white_furgoneta.svg' },
  { value: 'Wagon', label: 'Familiar', icon: '/icons/_wagon.svg', iconWhite: '/icons/_white_wagon.svg' },
  { value: 'Convertible', label: 'Convertible', icon: '/icons/_convertible.svg', iconWhite: '/icons/_white_convertible.svg' },
  { value: 'Motorhome', label: 'Caravana', icon: '/icons/_caravana.svg', iconWhite: '/icons/_white_caravana.svg' },
  { value: 'Monovolumen', label: 'Monovolumen', icon: '/icons/_monovolumen.svg', iconWhite: '/icons/_white_monovolumen.svg' },
  { value: 'Other', label: 'Otra', icon: '/icons/other.png' }, // no tiene versión blanca
];

const BodyStyleSelect = ({ value, onChange, name = 'body_style', showError }) => {
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
