import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '../../../config/env';
import SpeechToText from '../../../components/SpeechToText';

const ProductHistoryUpdate = ({ vehicle }) => {
  const navigate = useNavigate();
  const firstInputRef = useRef(null);
  const { apiUrl } = getConfig();

  const modificationFields = [
    'modifications_introduces',
    'modifications_mechanical',
    'modifications_exterior',
    'modifications_interior',
  ];

  const fields = [
    'highlights',
    'equipment',
    'known_flaws',
    'recent_service_history',
    'other_items_included',
    'seller_notes',
    ...modificationFields,
  ];

  const labels = {
    highlights: 'Características a destacar:',
    equipment: 'Equipado con:',
    known_flaws: 'Fallas Reconocidas:',
    recent_service_history: 'Historial de Servicios Realizados:',
    other_items_included: 'Otros incluidos en la venta:',
    seller_notes: 'Nota del Vendedor:',
    modifications_introduces: 'Modificaciones Introducidas:',
    modifications_mechanical: 'Modificaciones Mecánicas:',
    modifications_exterior: 'Modificaciones Exteriores:',
    modifications_interior: 'Modificaciones Interiores:',
  };

  // ==============================
  // Hooks SIEMPRE arriba
  // ==============================
  const [formData, setFormData] = useState(() => ({
    vehicle_id: vehicle?.id || '',
    modified: vehicle?.modified || '',
    highlights: vehicle?.features?.highlights || '-',
    equipment: vehicle?.features?.equipment || '-',
    known_flaws: vehicle?.features?.known_flaws || '-',
    recent_service_history: vehicle?.features?.recent_service_history || '-',
    other_items_included: vehicle?.features?.other_items_included || '-',
    seller_notes: vehicle?.features?.seller_notes || '-',
    modifications_introduces: vehicle?.features?.modifications_introduces || '-',
    modifications_mechanical: vehicle?.features?.modifications_mechanical || '-',
    modifications_exterior: vehicle?.features?.modifications_exterior || '-',
    modifications_interior: vehicle?.features?.modifications_interior || '-',
  }));

  const [touchedFields, setTouchedFields] = useState({});

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // ==============================
  // Render condicional DESPUÉS
  // ==============================
  if (!vehicle) {
    return <div>Cargando historial…</div>;
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const emptyFields = fields.filter(
      field => !formData[field] || formData[field].trim() === ''
    );

    if (emptyFields.length) {
      const newTouched = {};
      emptyFields.forEach(f => (newTouched[f] = true));
      setTouchedFields(newTouched);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    fetch(`${apiUrl}/index.php?page=product&action=update&id=${vehicle.id}`, { 
      method: 'POST',
      body: payload,
    })
      .then(async res => {
        const text = await res.text();
        console.log('=== RAW BACKEND RESPONSE ===');
        console.log(text);
        console.log('============================');
        return text;
      })
      .then(text => {
        // intenta parsear a JSON manualmente
        try {
          const json = JSON.parse(text);
          console.log('JSON PARSEADO:', json);
    
          if (json.success === true) {
            navigate(`/products/${vehicle.id}/edit?tab=media`);
          } else {
            alert(json.message || 'Error al guardar historial');
          }
        } catch (e) {
          console.error('NO ES JSON VÁLIDO ❌', e);
          alert('El backend no devolvió JSON válido');
        }
      })
      .catch(err => {
        console.error('ERROR REAL DEL FETCH ❌', err);
      });
    
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2
        style={{
          borderBottom: '2px solid var(--color-primary)',
          paddingBottom: 4,
        }}
      >
        Historial del Vehículo
      </h2>

      <input type="hidden" name="vehicle_id" value={vehicle.id} />

      {fields.map((field, index) => {
        const isError =
          touchedFields[field] &&
          (!formData[field] || formData[field].trim() === '');

        return (
          <div className="form-group" key={field} style={{ marginTop: '1rem' }}>
            <label htmlFor={field} className="sub-title">
              {labels[field]}
            </label>

            <textarea
              id={field}
              name={field}
              ref={index === 0 ? firstInputRef : null}
              value={formData[field]}
              onChange={handleChange}
              rows={2}
              style={{ width: '100%', marginTop: 4 }}
            />

            <SpeechToText
              field={field}
              formData={formData}
              setFormData={setFormData}
            />

            {isError && (
              <span style={{ color: 'red', fontSize: 12 }}>
                Este campo es obligatorio.
              </span>
            )}
          </div>
        );
      })}

      <button type="submit" className="continue" style={{ marginTop: 20 }}>
        Actualizar Historial
      </button>
    </form>
  );
};

export default ProductHistoryUpdate;
