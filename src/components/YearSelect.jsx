import { useEffect, useState } from 'react';

const YearSelect = ({ value, onChange, name = 'year', id = 'year', required = false }) => {
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1981; y--) {
      years.push(y);
    }
    setYearOptions(years);
  }, []);

  return (
    <div className="form-group">
      {/* <label htmlFor={id}></label> */}
      <select 
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Año</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

export default YearSelect;
