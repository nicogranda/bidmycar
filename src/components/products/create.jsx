import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import YearSelect from '../YearSelect';
import LocationLookup from '../LocationLookup';
import CarBrandSelect from '../CarBrandSelect';
import PhotoUploader from '../Photos/Uploader';
import './create.css';

function SellCarForm() {
  const navigate = useNavigate();
  const [zipTouched, setZipTouched] = useState(false);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    serial: '',
    transmission: '',
    color_ext: '',
    color_int: '',
    mileage: '',
    zip_code: '',
    body_style: '',
    price: '',
    description: '',
    modified: '',
    featured: false
  });
  const [cityProvince, setCityProvince] = useState({ ciudad: '', provincia: '' });
  const [photos, setPhotos] = useState({
    cover_view: null,
    front_view: null,
    back_view: null,
    left_view: null,
    right_view: null,
  });

  // Verificar si el usuario está logueado al cargar el componente
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/login'); // Redirige al login si no está autenticado
    }
  }, [navigate]);

  //
  useEffect(() => {
    const handleLogoutRedirect = () => {
      navigate('/'); // o '/login', según lo que prefieras
    };
  
    window.addEventListener('userLogout', handleLogoutRedirect);
  
    return () => {
      window.removeEventListener('userLogout', handleLogoutRedirect);
    };
  }, [navigate]);

  // 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleModifiedChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      modified: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Adjuntar cada vista de foto si existe
    Object.entries(photos).forEach(([view, file]) => {
      if (file) {
        data.append(`photos[${view}]`, file);
      }
    });

    fetch('http://localhost:8888/bidmycar/backend/api/products/create.php', {
      method: 'POST',
      body: data
    })
      .then(response => response.json())
      .then(result => {
        console.log('Respuesta del backend:', result);
        if (result.status === 'success') {
          alert('Formulario enviado correctamente');
          window.location.href = '/'; // Redirigir al inicio o donde desees
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
    <div className="form-container">
      <h1>Vende Tu Coche</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            onBlur={() => setZipTouched(true)}
            placeholder="Código Postal"
            required
          />
          <div className="zip-info-container">
            {zipTouched && (
              <LocationLookup
                zipCode={formData.zip_code}
                onLocationChange={setCityProvince}
              />
            )}
          </div>
        </div>

        <CarBrandSelect formData={formData} handleChange={handleChange} />

        <div className="form-group">
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Modelo"
            required
          />
        </div>

        <YearSelect value={formData.year} onChange={handleChange} />

        <div className="form-group">
          <input
            type="text"
            name="serial"
            value={formData.serial}
            onChange={handleChange}
            placeholder="Número de serie (VIN)"
            required
          />
        </div>

        <div className="form-group">
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
          >
            <option value="">Indica la transmisión</option>
            <option value="Automatic">Automática</option>
            <option value="Manual">Manual</option>
            <option value="Other">Otra</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="color_ext"
            value={formData.color_ext}
            onChange={handleChange}
            placeholder="Color Exterior"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="color_int"
            value={formData.color_int}
            onChange={handleChange}
            placeholder="Color Interno"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="Kilometraje"
            required
          />
        </div>

        <div className="form-group">
          <select
            name="body_style"
            value={formData.body_style}
            onChange={handleChange}
            required
          >
            <option value="">Indica el tipo de carrocería</option>
            <option value="Sedan">Sedán</option>
            <option value="Coupe">Coupé</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Pickup">Pickup</option>
            <option value="Van">Van</option>
            <option value="Wagon">Wagon</option>
            <option value="Convertible">Convertible</option>
            <option value="Other">Otra</option>
          </select>
        </div>

        <div className="form-group">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Precio (€)"
            required
          />
        </div>

        <PhotoUploader photos={photos} setPhotos={setPhotos} />

        <div className="form-group">
          <label>¿El coche ha sido modificado?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="modified"
                value="Completely stock"
                checked={formData.modified === 'Completely stock'}
                onChange={handleModifiedChange}
              />
              Completamente de serie
            </label>
            <label>
              <input
                type="radio"
                name="modified"
                value="Modified"
                checked={formData.modified === 'Modified'}
                onChange={handleModifiedChange}
              />
              Modificado
            </label>
          </div>
        </div>
        
        <div className="form-group">
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
              />
              Quiero destacar este coche
            </label>
          </div>
        </div>

        <button type="submit">Subir Coche</button>
      </form>
    </div>
  );
}

export default SellCarForm;
