import { useEffect, useState } from 'react';

const YearSelect = ({ value, onChange, name = 'year', id = 'year', required = false, showError }) => {
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1900; y--) {
      years.push(y);
    }
    setYearOptions(years);
  }, []);

  return (
    <div className="form-group">
      <select 
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        // required={required}
      >
        <option value="">Año</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      {showError && !value && <div className="error-message">Por favor, selecciona un año.</div>}
    </div>
  );
};

export default YearSelect;
