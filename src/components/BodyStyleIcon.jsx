import React, { useState, useRef, useEffect } from 'react';

// Componente para iconos de carrocería
const BodyStyleIcon = ({ type }) => {
  const size = 20;
  switch (type) {
    case 'Sedan':
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="40" height="8" stroke="#333" strokeWidth="2" rx="2" ry="2" />
          <circle cx="12" cy="18" r="4" stroke="#333" strokeWidth="2" />
          <circle cx="36" cy="18" r="4" stroke="#333" strokeWidth="2" />
          <rect x="16" y="4" width="16" height="8" stroke="#333" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Coupe':
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="36" height="6" stroke="#0077CC" strokeWidth="2" rx="1" ry="1" />
          <circle cx="14" cy="18" r="4" stroke="#0077CC" strokeWidth="2" />
          <circle cx="34" cy="18" r="4" stroke="#0077CC" strokeWidth="2" />
          <rect x="20" y="6" width="10" height="6" stroke="#0077CC" strokeWidth="2" rx="1" ry="1" />
        </svg>
      );
    case 'SUV':
      return (
        <svg width={size} height={size * 0.65} viewBox="0 0 50 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="12" width="44" height="14" stroke="#009900" strokeWidth="2" rx="3" ry="3" />
          <circle cx="13" cy="26" r="5" stroke="#009900" strokeWidth="2" />
          <circle cx="37" cy="26" r="5" stroke="#009900" strokeWidth="2" />
          <rect x="18" y="6" width="14" height="8" stroke="#009900" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Hatchback':
      return (
        <svg width={size} height={size * 0.5} viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="6" width="40" height="8" stroke="#FF6600" strokeWidth="2" rx="2" ry="2" />
          <circle cx="12" cy="16" r="4" stroke="#FF6600" strokeWidth="2" />
          <circle cx="36" cy="16" r="4" stroke="#FF6600" strokeWidth="2" />
          <rect x="18" y="2" width="12" height="6" stroke="#FF6600" strokeWidth="2" rx="1" ry="1" />
        </svg>
      );
    case 'Pickup':
      return (
        <svg width={size} height={size * 0.55} viewBox="0 0 48 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="9" width="30" height="8" stroke="#AA0000" strokeWidth="2" rx="2" ry="2" />
          <rect x="34" y="13" width="11" height="4" stroke="#AA0000" strokeWidth="2" rx="1" ry="1" />
          <circle cx="12" cy="19" r="4" stroke="#AA0000" strokeWidth="2" />
          <circle cx="37" cy="19" r="4" stroke="#AA0000" strokeWidth="2" />
        </svg>
      );
    case 'Van':
      return (
        <svg width={size} height={size * 0.7} viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="38" height="12" stroke="#666666" strokeWidth="2" rx="3" ry="3" />
          <circle cx="14" cy="22" r="5" stroke="#666666" strokeWidth="2" />
          <circle cx="34" cy="22" r="5" stroke="#666666" strokeWidth="2" />
          <rect x="12" y="6" width="24" height="8" stroke="#666666" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Wagon':
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 50 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="42" height="10" stroke="#5555AA" strokeWidth="2" rx="2" ry="2" />
          <circle cx="14" cy="20" r="5" stroke="#5555AA" strokeWidth="2" />
          <circle cx="36" cy="20" r="5" stroke="#5555AA" strokeWidth="2" />
          <rect x="16" y="4" width="16" height="6" stroke="#5555AA" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Convertible':
      return (
        <svg width={size} height={size * 0.5} viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="8" width="38" height="6" stroke="#FF00AA" strokeWidth="2" rx="2" ry="2" />
          <circle cx="14" cy="16" r="4" stroke="#FF00AA" strokeWidth="2" />
          <circle cx="34" cy="16" r="4" stroke="#FF00AA" strokeWidth="2" />
          <line x1="12" y1="8" x2="36" y2="8" stroke="#FF00AA" strokeWidth="2" />
        </svg>
      );
    case 'Motorhome':
      return (
        <svg width={size} height={size * 0.7} viewBox="0 0 48 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="10" width="40" height="14" stroke="#008080" strokeWidth="2" rx="3" ry="3" />
          <circle cx="14" cy="24" r="5" stroke="#008080" strokeWidth="2" />
          <circle cx="36" cy="24" r="5" stroke="#008080" strokeWidth="2" />
          <rect x="18" y="6" width="12" height="8" stroke="#008080" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Monovolumen':
      return (
        <svg width={size} height={size * 0.65} viewBox="0 0 48 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="10" width="36" height="12" stroke="#AA5500" strokeWidth="2" rx="3" ry="3" />
          <circle cx="14" cy="22" r="5" stroke="#AA5500" strokeWidth="2" />
          <circle cx="34" cy="22" r="5" stroke="#AA5500" strokeWidth="2" />
          <rect x="16" y="6" width="16" height="8" stroke="#AA5500" strokeWidth="2" rx="2" ry="2" />
        </svg>
      );
    case 'Other':
    default:
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="12" r="10" stroke="#999999" strokeWidth="2" />
          <text x="24" y="16" fontSize="10" textAnchor="middle" fill="#999999" fontFamily="Arial" fontWeight="bold">?</text>
        </svg>
      );
  }
};

// Componente select customizado
const options = [
  { value: 'Sedan', label: 'Sedán' },
  { value: 'Coupe', label: 'Coupé' },
  { value: 'SUV', label: 'SUV' },
  { value: 'Hatchback', label: 'Compacto' },
  { value: 'Pickup', label: 'Pickup' },
  { value: 'Van', label: 'Furgoneta' },
  { value: 'Wagon', label: 'Familiar' },
  { value: 'Convertible', label: 'Convertible' },
  { value: 'Motorhome', label: 'Caravana' },
  { value: 'Monovolumen', label: 'Monovolumen' },
  { value: 'Other', label: 'Otra' },
];

const BodyStyleSelect = ({ value, onChange, required = false, showError }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange({ target: { name: 'body_style', value: val } });
    setOpen(false);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || 'Indica el tipo de carrocería';

  return (
    <div className="custom-select-container" ref={ref} style={{ position: 'relative', width: 280 }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`custom-select-trigger ${showError && !value ? 'error' : ''}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '8px 12px',
          cursor: 'pointer',
          border: showError && !value ? '1px solid red' : '1px solid #ccc',
          borderRadius: 4,
          backgroundColor: '#fff',
          fontSize: 16,
          userSelect: 'none',
        }}
      >
        <BodyStyleIcon type={value} />
        <span>{selectedLabel}</span>
        <span style={{ marginLeft: 'auto', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="custom-select-options"
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            position: 'absolute',
            width: '100%',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: 4,
            maxHeight: 200,
            overflowY: 'auto',
            zIndex: 999,
          }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(option.value)}
              tabIndex={0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                cursor: 'pointer',
                backgroundColor: value === option.value ? '#eee' : '#fff',
              }}
            >
              <BodyStyleIcon type={option.value} />
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BodyStyleSelect;
