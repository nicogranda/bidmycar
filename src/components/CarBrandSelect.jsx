import React, { useEffect, useState } from 'react';

const CarBrandSelect = ({ formData, handleChange }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Llamar a la API y obtener las marcas
    fetch('http://localhost:8888/bidmycar/backend/api/carBrands.php')
      .then((res) => res.json())
      .then((data) => setBrands(data)) // Guardar las marcas en el estado
      .catch((err) => console.error('Error al cargar marcas:', err));
  }, []);

  return (
    <div className="form-group">
      {/* <label htmlFor="brand">Marca</label> */}
      <select
        id="brand"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        required
      >
        <option value="">Indica la marca</option>
        {/* Mapea las marcas y las muestra en el select */}
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CarBrandSelect;

