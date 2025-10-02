import React, { useEffect, useState } from 'react';

const CarBrandAutocomplete = ({ value, onChange }) => {
  const [brands, setBrands] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState(value || '');

  useEffect(() => {
    fetch('http://localhost:8888/bidmycar/backend/api/carBrands.php')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error('Error al cargar marcas:', err));
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange({ target: { name: 'brand', value: val } });

    const matches = brands.filter((brand) =>
      brand.toLowerCase().startsWith(val.toLowerCase())
    );
    setFiltered(matches);
  };

  const handleSelect = (brand) => {
    setQuery(brand);
    setFiltered([]);
    onChange({ target: { name: 'brand', value: brand } });
  };

  return (
    <div className="autocomplete-container" style={{ position: 'relative' }}>
      <input
        type="text"
        name="brand"
        value={query}
        onChange={handleInputChange}
        placeholder="Escribe una marca..."
        required
        className="w-full border border-gray-300 p-2 rounded"
      />
      {filtered.length > 0 && (
        <ul className="suggestions absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded shadow">
          {filtered.map((brand, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(brand)}
            >
              {brand}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CarBrandAutocomplete;
