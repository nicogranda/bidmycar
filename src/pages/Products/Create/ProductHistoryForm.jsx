import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './create.css';
const ProductHistoryForm = ({ onSubmit }) => {
    const location = useLocation();
    const { vehicle_id } = location.state || {};
    //const { vehicle_id } = useParams();

    const [formData, setFormData] = useState({
      vehicle_id: vehicle_id || '',
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

    useEffect(() => {
        if (vehicle_id) {
          setFormData((prev) => ({ ...prev, vehicle_id }));
        }
      }, [vehicle_id]);
      
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8888/bidmycar/backend/api/products/history.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(result => {
        console.log('Respuesta del backend:', result);
        if (result.status === 'success') {
          alert('Formulario enviado correctamente');
          navigate('/'); // Redirige a la página principal
        } else {
          alert('Error: ' + result.message);
        }
      })
      .catch(error => {
        console.error('Error en el fetch:', error);
        alert('Hubo un error al enviar el formulario');
      });
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

export default ProductHistoryForm;
