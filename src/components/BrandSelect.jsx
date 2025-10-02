import React, { useEffect, useState } from 'react';
import { getConfig } from '../config/env'; 

const ProductBrandSelect = ({ formData, handleChange, showError, onBlur }) => {
  const [brands, setBrands] = useState([]);
  const { apiUrl } = getConfig(); // Obtiene apiUrl desde la configuración

  useEffect(() => {
    fetch(`${apiUrl}/api/brand-select.php`)
      .then((res) => res.json())
      .then((data) => setBrands(data)) // Guardar las marcas en el estado
      .catch((err) => console.error('Error al cargar marcas:', err));
  }, [apiUrl]); // Dependencia de apiUrl para asegurar que cambie en producción

  return (
    <div className="form-group">
      <select
        id="brand"
        name="brand"
        value={formData.brand}
        onChange={handleChange}
        onBlur={onBlur} //
      >
        <option value="">Indica la marca</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
      </select>
      {showError && <div className="error-message">Por favor, selecciona una marca.</div>}
    </div>
  );
};

export default ProductBrandSelect;
