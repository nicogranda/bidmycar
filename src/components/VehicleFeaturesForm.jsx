import React, { useState } from 'react';

const VehicleFeaturesForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    highlights: '',
    equipment: '',
    known_flaws: '',
    recent_service_history: '',
    other_items_included: '',
    seller_notes: '',
    modifications_introduces: '',
    modifications_mechanical: '',
    modifications_exterior: '',
    modifications_interior: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Datos del Vehículo</h2>

      <label>
        ID del Vehículo:
        <input
          type="number"
          name="vehicle_id"
          value={formData.vehicle_id}
          onChange={handleChange}
          required
        />
      </label>

      {[
        "highlights",
        "equipment",
        "known_flaws",
        "recent_service_history",
        "other_items_included",
        "seller_notes",
        "modifications_introduces",
        "modifications_mechanical",
        "modifications_exterior",
        "modifications_interior"
      ].map(field => (
        <label key={field} style={{ display: 'block', marginTop: '1rem' }}>
          {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
          <textarea
            name={field}
            value={formData[field]}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>
      ))}

      <button type="submit" style={{ marginTop: '1rem' }}>Guardar</button>
    </form>
  );
};

export default VehicleFeaturesForm;
