// src/pages/products/edit/ProductUpdateForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BrandSelect,
  YearSelect,
  TransmissionSelect,
  BodyStyleSelect,
  DrivetrainSelect,
  EnergyTypeSelect
} from '../../../components/vehicle';
import ToolTip from '../../../components/ui/ToolTip';
import { getConfig } from '../../../config/env';

const ProductUpdateForm = ({ vehicle }) => {
  const { id } = useParams();
  const { apiUrl } = getConfig();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [zipTouched, setZipTouched] = useState(false);
  const [brandTouched, setBrandTouched] = useState(false);
  const [yearTouched, setYearTouched] = useState(false);

  // 🔹 Hidratamos el formulario cuando llega el vehicle
  useEffect(() => {
    if (!vehicle) return;

    setFormData({
      zip_code: vehicle.zip_code || '',
      vin: vehicle.serial || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year || '',
      transmission: vehicle.transmission || '',
      drivetrain: vehicle.drivetrain || '',
      energy_type: vehicle.energy_type || '',
      body_style: vehicle.body_style || '',
      color_ext: vehicle.color_ext || '',
      color_int: vehicle.color_int || '',
      mileage: vehicle.mileage || '',
      price: vehicle.price || '',
      highlight: vehicle.highlight ?? 0,
      for_sale: vehicle.for_sale ?? 1,
      published_at: vehicle.published_at
        ? new Date(vehicle.published_at).toISOString().slice(0, 16)
        : ''
    });
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value ?? '');
    });

    try {
      const res = await fetch(
        `${apiUrl}/index.php?page=product&action=update&id=${id}`,
        {
          method: 'POST',
          body: data
        }
      );

      const result = await res.json();
      if (result.success) {
        window.alert('Vehículo actualizado correctamente');
        navigate(`/vehiculo/${id}`);
      } else {
        console.error('Error backend:', result.message);
      }
    } catch (err) {
      console.error('Error de red:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 El loading ya lo controla la Page
  if (!vehicle) return null;

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Editar vehículo</h1>

      {/* ZIP */}
      <div className="form-group">
        <ToolTip text="Código Postal de 5 números de España">
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code || ''}
            onChange={handleChange}
            onBlur={() => setZipTouched(true)}
            placeholder="Código Postal"
          />
        </ToolTip>
      </div>

      {/* VIN */}
      <div className="form-group">
        <input
          type="text"
          name="vin"
          value={formData.vin || ''}
          onChange={handleChange}
          placeholder="VIN"
        />
      </div>

      {/* Marca y Modelo */}
      <div className="form-row">
        <div className="form-group">
          <BrandSelect
            formData={formData}
            handleChange={handleChange}
            showError={brandTouched && !formData.brand}
            onBlur={() => setBrandTouched(true)}
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="model"
            value={formData.model || ''}
            onChange={handleChange}
            placeholder="Modelo"
          />
        </div>
      </div>

      {/* Año y Body Style */}
      <div className="form-row">
        <div className="form-group">
          <YearSelect
            value={formData.year || ''}
            onChange={handleChange}
            showError={yearTouched && !formData.year}
            onBlur={() => setYearTouched(true)}
          />
        </div>

        <div className="form-group">
          <BodyStyleSelect
            value={formData.body_style || ''}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, body_style: val }))
            }
          />
        </div>
      </div>

      {/* Transmission, Drivetrain, Energy */}
      <div className="form-row">
        <TransmissionSelect
          value={formData.transmission || ''}
          onChange={handleChange}
        />

        <DrivetrainSelect
          value={formData.drivetrain || ''}
          onChange={handleChange}
        />

        <EnergyTypeSelect
          value={formData.energy_type || ''}
          onChange={handleChange}
        />
      </div>

      {/* Colores */}
      <div className="form-row">
        <input
          type="text"
          name="color_ext"
          value={formData.color_ext || ''}
          onChange={handleChange}
          placeholder="Color Exterior"
        />

        <input
          type="text"
          name="color_int"
          value={formData.color_int || ''}
          onChange={handleChange}
          placeholder="Color Interior"
        />
      </div>

      {/* Kilometraje y Precio */}
      <div className="form-row">
        <input
          type="number"
          name="mileage"
          value={formData.mileage || ''}
          onChange={handleChange}
          placeholder="Kilometraje"
        />

        <input
          type="number"
          name="price"
          value={formData.price || ''}
          onChange={handleChange}
          placeholder="Precio mínimo (€)"
        />
      </div>

      {/* Checkboxes */}
      <div className="form-group checkbox-with-gap">
        <label>
          Destacado
          <input
            type="checkbox"
            name="highlight"
            checked={formData.highlight === 1}
            onChange={handleChange}
          />
        </label>

        <label>
          A la venta
          <input
            type="checkbox"
            name="for_sale"
            checked={formData.for_sale === 1}
            onChange={handleChange}
          />
        </label>
      </div>

      {/* Publicación */}
      <div className="form-group">
        <label>
          Fecha de publicación
          <input
            type="datetime-local"
            name="published_at"
            value={formData.published_at || ''}
            onChange={handleChange}
          />
        </label>
      </div>

      <button type="submit" disabled={loading} className="continue">
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
};

export default ProductUpdateForm;
