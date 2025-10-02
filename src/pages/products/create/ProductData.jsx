import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationLookup from '../../../components/LocationLookup';
import BodyStyleSelect from '../../../components/BodyStyleSelect';
import TransmissionSelect from '../../../components/TransmissionSelect';
import DrivetrainSelect from '../../../components/DrivetrainSelect';
import EnergyTypeSelect from '../../../components/EnergyTypeSelect';
import ProductBrandSelect from '../../../components/BrandSelect';
import YearSelect from '../../../components/YearSelect';
import  ToolTip from '../../../components/ToolTip';

// import PhotoUploader from '../photos/Uploader';

// import  Loader from '../../../components/Loader';
// import PhotoDropzone from '../Photos/PhotoDropzone';
import { getConfig } from '../../../config/env';  


const ProductData = ({ onNext }) => {
  const [loading, setLoading] = useState(false);

  const { apiUrl } = getConfig();
  const navigate = useNavigate();
  
  const [zipTouched, setZipTouched] = useState(false);
  const [serialTouched, setSerialTouched] = useState(false);
  const [modelTouched, setModelTouched] = useState(false); // Nuevo estado

  const [colorExtTouched, setColorExtTouched] = useState(false);
  const [colorIntTouched, setColorIntTouched] = useState(false);
  const [mileageTouched, setMileageTouched] = useState(false);
  const [priceTouched, setPriceTouched] = useState(false);

  // const [photoError, setPhotoError] = useState(false);
  const [photoErrors, setPhotoErrors] = useState({});
  // const [lastScrollPosition, setLastScrollPosition] = useState(0);

  const [formData, setFormData] = useState({
    user_id: '',       
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
    featured: false,
    energy_type: '',
    drivetrain: ''
  });
  
  
  const [showError, setShowError] = useState(false);
  
  // Estado adicional para saber si los selects han sido tocados
  const [transmissionTouched, setTransmissionTouched] = useState(false);
  const [yearTouched, setYearTouched] = useState(false);
  const [brandTouched, setBrandTouched] = useState(false);
  const [energyTypeTouched, setEnergyTypeTouched] = useState(false);
  const [drivetrainTouched, setDrivetrainTouched] = useState(false);
  const [bodyStyleTouched, setBodyStyleTouched] = useState(false);

  // const navigate = useNavigate();
  const [modified, setModified] = useState('Completely stock');

  const [formTouched, setFormTouched] = useState({
    year: false,
    brand: false,
    transmission: false,
    energy_type: false,
    drivetrain: false,
    body_style: false
  });

  // Modifica el evento onBlur para los selects
  const handleBlur = (field) => {
    switch (field) {
      case 'brand':
        setBrandTouched(true);
        break;
      case 'transmission':
        setTransmissionTouched(true);
        break;
      case 'energy_type':
        setEnergyTypeTouched(true);
        break;
      case 'drivetrain':
        setDrivetrainTouched(true);
        break;
      case 'body_style':
        setBodyStyleTouched(true);
        break;
      default:
        break;
    }
  };

  const [cityProvince, setCityProvince] = useState({ ciudad: '', provincia: '' });

  const [photos, setPhotos] = useState({
    cover_view: null,
    front_view: null,
    back_view: null,
    left_view: null,
    right_view: null,
  });


useEffect(() => {
  const userName = localStorage.getItem('userName');
  if (!userName) {
    navigate('/login');
  }
}, [navigate]);

useEffect(() => {
  const handleLogoutRedirect = () => {
    navigate('/');
  };

  window.addEventListener('userLogout', handleLogoutRedirect);

  return () => {
    window.removeEventListener('userLogout', handleLogoutRedirect);
  };
}, [navigate]);

useEffect(() => {
  const storedUserId = localStorage.getItem('user_id'); 
  const parsedId = parseInt(storedUserId);
  console.log('🔐 user_id desde localStorage:', parsedId);
 
  setFormData(prev => ({ ...prev, user_id: parsedId }));
}, []);

  // Manejo del formulario
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

  //Scroll hasta los errores
  const scrollToFirstEmptyField = () => {
    // Lista en orden de los campos obligatorios según tu formData y nombres en el DOM
    const requiredFields = [
      'zip_code',
      'serial',
      'brand',
      'model',
      'year',
      'transmission',
      'energy_type',
      'drivetrain',
      'color_ext',
      'color_int',
      'mileage',
      'price',
      'body_style'
    ];
      
    for (const field of requiredFields) {
      if (!formData[field]) {
        // Busca el input/select por nombre
        const element = document.querySelector(`[name="${field}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
          }
          break; // solo el primero
      }
    }
    
  };


  //******************* Manejo del guardar información   **************** 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Marcar campos tocados
    setZipTouched(true);
    setSerialTouched(true);
    setModelTouched(true);
    setColorExtTouched(true);
    setColorIntTouched(true);
    setMileageTouched(true);
    setPriceTouched(true);
    setBodyStyleTouched(true);
    setYearTouched(true);
    setBrandTouched(true);
    setTransmissionTouched(true);
    setEnergyTypeTouched(true);
    setDrivetrainTouched(true);
  
    // Validación básica
    if (
      !formData.zip_code ||
      !formData.serial ||
      !formData.brand ||
      !formData.model ||
      !formData.year ||
      !formData.transmission ||
      !formData.energy_type ||
      !formData.drivetrain ||
      !formData.color_ext ||
      !formData.color_int ||
      !formData.mileage ||
      !formData.price ||
      !formData.body_style
    ) {
      scrollToFirstEmptyField();
      return;
    }
  
    formData.user_id = parseInt(localStorage.getItem("user_id") ?? "0");

    // Construir FormData
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
  
    Object.entries(photos).forEach(([key, file]) => {
      if (file) {
        data.append(key, file); // Las keys deben ser cover_view, front_view, etc.
      }
    });

    

    for (let pair of data.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
    
    try {
      const response = await fetch(`${apiUrl}/api/products/create.php`, {
        method: 'POST',
        body: data,
        credentials: 'include'
      });

      // const data = await res.json();
      // console.log('🚗 Datos cargados del backend:', data);
  
      const result = await response.json();
      if (result.status === 'success') {
        console.log('Vehículo guardado:', result);
        const vehicle_id = result.inserted_id;
       
        if (onNext) {
          onNext(vehicle_id); // pasa al siguiente paso
        } else {
          navigate(`/historico/${vehicle_id}`);
        }
        
        // Aquí tienes un pequeño fallo de sintaxis en la plantilla literal y en el navigate con state
        navigate(`/vehiculo/historico/${vehicle_id}`, { 
          state: { modified: formData.modified, vehicle_id }
        });
      } else {
        console.error('Error en backend:', result.message);
      } 
      
    } catch (error) {
      console.error('Error de red:', error);
    } finally {
      setLoading(false); // Esto se ejecuta sí o sí al final
    }
  };
    
  return (
    <div>
     
      <form onSubmit={handleSubmit} className="form-container">
        <h1 className="principal">Vende tu coche</h1>
        <div className="form-group">
          <ToolTip text="Codigo Postal de 5 números de España">
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              onBlur={() => setZipTouched(true)}
              placeholder="Código Postal"
            />
          </ToolTip>
          {!formData.zip_code && zipTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
          <div className="zip-info-container">
            {zipTouched && formData.zip_code && (
              <LocationLookup
                zipCode={formData.zip_code}
                onLocationChange={setCityProvince}
              />
            )}
          </div>
      
        </div>

        <div className="form-group">
          <ToolTip text="El VIN (Número de Identificación del Vehículo) suele tener 17 caracteres y está en la documentación o chasis.">
            <input
              type="text"
              name="serial"
              value={formData.serial}
              onChange={handleChange}
              onBlur={() => setSerialTouched(true)} // Manejo de "blur" para serial
              placeholder="VIN o Serial"
            />
          </ToolTip>
          
          {!formData.serial && serialTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>


        <ProductBrandSelect 
          formData={formData} 
          handleChange={handleChange} 
          showError={brandTouched && !formData.brand} // Pasamos showError para el control de error
          onBlur={() => handleBlur('brand')} // Cuando el select pierda foco, marcar como tocado
        />
        
        <div className="form-group">
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            onBlur={() => setModelTouched(true)} // Manejo de "blur" para model
            placeholder="Modelo"
          />
          {!formData.model && modelTouched && ( // Validación para mostrar mensaje de error
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>

        <YearSelect 
          value={formData.year}
          onChange={handleChange}
          showError={yearTouched} // Aquí pasamos el estado 'yearTouched' como prop showError
        />

        <TransmissionSelect
          value={formData.transmission}
          onChange={handleChange}
          onBlur={() => handleBlur('transmission')}
          showError={transmissionTouched && !formData.transmission}
        />

          <EnergyTypeSelect
            value={formData.energy_type} // Pasamos el valor actual del tipo de energía
            onChange={handleChange} // Pasamos la función de manejo de cambios
            showError={energyTypeTouched && !formData.energy_type} // Control de error: si el campo fue tocado y no tiene valor
            onBlur={() => handleBlur('energy_type')} // Cuando el select pierda foco, marcar como tocado
          />
       

          <DrivetrainSelect
            value={formData.drivetrain}
            onChange={handleChange}
            onBlur={() => handleBlur('drivetrain')}
            showError={drivetrainTouched && !formData.drivetrain}
          />

        {/* Color Externo */}   
        <div className="form-group">
          <input
            type="text"
            name="color_ext"
            value={formData.color_ext}
            onChange={handleChange}
            onBlur={() => setColorExtTouched(true)}
            placeholder="Color Exterior"
            // required
          />
          {!formData.color_ext && colorExtTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>

         {/* Color Interno */}     
        <div className="form-group">
          <input
            type="text"
            name="color_int"
            value={formData.color_int}
            onChange={handleChange}
            onBlur={() => setColorIntTouched(true)}
            placeholder="Color Interno"
            // required
          />
          {!formData.color_int && colorIntTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>

        {/* Kilometraje */}
        <div className="form-group">
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            onBlur={() => setMileageTouched(true)}
            placeholder="Kilometraje"
            // required
          />
          {!formData.mileage && mileageTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>

        {/* Carroceria */}
        <BodyStyleSelect
          value={formData.body_style}
          onChange={(val) => {
            setFormData((prev) => ({ ...prev, body_style: val }));
            setBodyStyleTouched(true);
          }}
          showError={bodyStyleTouched && !formData.body_style}
        />

        {/* Photos subidas  */}
        {/* <PhotoUploader
          photos={photos}
          setPhotos={setPhotos}
          errors={photoErrors}
        /> */}

        <div className="form-group">
          <label className="highlight">¿El coche ha sido modificado?</label>
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

       {/* Precio */}
       <div className="form-group">
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            onBlur={() => setPriceTouched(true)}
            placeholder="Precio minimo para que se haga la subasta(€)"
            // required
          />
          {!formData.price && priceTouched && (
            <span className="error-message">Este campo es obligatorio.</span>
          )}
        </div>
        
        <button type="submit" className="continue">Siguiente</button>
      </form>
      
    </div>
    
  );
}

export default ProductData;