import { IS_TOUCH_DEVICE } from 'cropperjs';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getConfig } from '../../../config/env';
import SpeechToText from '../../../components/SpeechToText';
// import VideoUploader from '../../../components/videos/Uploader';
// import './create.css';

const ProductHistory = () => {
  const { vehicle_id: paramId } = useParams();
  const stateId = useLocation().state?.vehicle_id;
  const vehicle_id = stateId || paramId || '';

  const [formData, setFormData] = useState({
    vehicle_id,
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
    // video: '',
    // mode: '',
    modified: '' 
  });

  const location = useLocation();
  const modifiedFromTechSheet = location.state?.modified;

  const navigate = useNavigate();

  const firstInputRef = useRef(null); // <-- referencia al primer input visible

  useEffect(() => {
    setFormData(fd => {
      const updatedData = {
        ...fd,
        vehicle_id: vehicle_id || fd.vehicle_id,
        modified: modifiedFromTechSheet || fd.modified,
      };

      if (!modifiedFromTechSheet) {
        modificationFields.forEach(field => {
          updatedData[field] = "-";
        });
      }

      return updatedData;
    });
  }, [vehicle_id, modifiedFromTechSheet]);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus(); // <-- enfoca al primer input visible
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const [touchedFields, setTouchedFields] = useState({});

  const modificationFields = [
    "modifications_introduces",
    "modifications_mechanical",
    "modifications_exterior",
    "modifications_interior"
  ];

  const fields = [
    "highlights",
    "equipment",
    "known_flaws",
    "recent_service_history",
    "other_items_included",
    "seller_notes",
    "modifications_introduces",
    "modifications_mechanical",
    "modifications_exterior",
    "modifications_interior",
  ];

  const labels = {
    highlights: "Características a destacar:",
    equipment: "Equipado con:",
    known_flaws: "Fallas Reconocidas:",
    recent_service_history: "Histórico de Recientes Servicios Realizados:",
    other_items_included: "Otros incluidos en la venta:",
    seller_notes: "Nota del Vendedor:",
    modifications_introduces: "Modificaciones Introducidas:",
    modifications_mechanical: "Modificaciones Mecánicas:",
    modifications_exterior: "Modificaciones Exteriores:",
    modifications_interior: "Modificaciones Interiores:",
  };

  const handleSubmit = e => {
    e.preventDefault();
    const updatedFormData = { ...formData };

    modificationFields.forEach(field => {
      if (!updatedFormData[field] || updatedFormData[field].trim() === "") {
        updatedFormData[field] = "N/A";
      }
    });

    const fieldsToValidate = { ...updatedFormData };
    delete fieldsToValidate.vehicle_id;

    const emptyFields = Object.entries(fieldsToValidate)
      .filter(([_, value]) => !value || value.toString().trim() === '')
      .map(([key]) => key);

    // if (!fieldsToValidate.video || fieldsToValidate.video.toString().trim() === '') {
    //   emptyFields.push('video');
    // }

    if (emptyFields.length > 0) {
      console.log("Campos vacíos:", emptyFields); // 👈 Agrega esto
      const newTouched = {};
      emptyFields.forEach(field => {
        newTouched[field] = true;
      });
      setTouchedFields(newTouched);
      return;
    }

    const payload = new FormData();
    Object.entries(updatedFormData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    console.log("ok", payload);
    fetch(`${getConfig().apiUrl}/api/products/history.php`, {
      method: 'POST',
      body: payload
    })
      .then(async (res) => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          return data;
        } catch {
          console.error('No es JSON válido:', text);
          throw new Error('Respuesta no JSON del servidor');
        }
      })
      .then(result => {
        if (result.status === 'success') {
          // alert('Formulario enviado correctamente');
          navigate(`/car/upload/${updatedFormData.vehicle_id}`);
        } else {
          alert('Error: ' + result.message);
        }
      })
      .catch(err => {
        console.error('Error en el fetch:', err);
        alert('Hubo un error al enviar el formulario');
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
      <h2
        className="principal"
        style={{
          borderBottom: '2px solid var(--color-primary)',
          paddingBottom: '4px',
          borderRadius: '0',
        }}
      >
        Datos del Vehículo
      </h2>

        <input type="hidden" name="vehicle_id" value={formData.vehicle_id} />

        {fields.map((field, index) => {
          if (formData.modified === 'Completely stock' && modificationFields.includes(field)) {
            return null;
          }

          const isError = touchedFields[field] && (!formData[field] || formData[field].toString().trim() === '');

          // Encuentra el primer campo visible que no está oculto
          const visibleFields = fields.filter(f => !(formData.modified === 'Completely stock' && modificationFields.includes(f)));
          const isFirstVisible = visibleFields[0] === field;

          return (
            <div className="form-group" key={field} style={{ marginTop: '1rem' }}>
              <label htmlFor={field} style={{ display: 'block' }} className="sub-title">{labels[field]}</label>
              <textarea
                id={field}
                name={field}
                ref={isFirstVisible ? firstInputRef : null}
                value={formData[field]}
                onChange={handleChange}
                rows={4}
                style={{
                  width: '100%',
                  marginTop: 4,
                  border: 'none',
                  borderBottom: '2px solid var(--color-primary)',
                  outline: 'none',
                  resize: 'none',
                  padding: '4px 0',
                  borderRadius: '0',
                }}
              />

              <SpeechToText field={field} formData={formData} setFormData={setFormData} />

              {isError && (
                <span className="error-message" style={{ color: 'red', fontSize: 12 }}>
                  Este campo es obligatorio.
                </span>
              )}
            </div>
          );
        })}

        {/* <section style={{ marginTop: '40px' }}>
          <h2>Sube o añade un video</h2>
          <VideoUploader
            vehicleId={formData.vehicle_id}
            video={formData.video}
            mode={formData.mode}
            onChange={({ video, mode }) =>
              setFormData(prev => ({
                ...prev,
                video: video ?? prev.video,
                mode: mode ?? prev.mode,
              }))
            }
          />
        </section> */}

        <button type="submit" className="continue">Continuar</button>
      </form>
    </div>
  );
};

export default ProductHistory;
