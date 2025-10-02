// pages/products/ProductCreate.jsx
import { useState, useEffect } from 'react';
import ProductData from './ProductData';
import ProductHistory from './ProductHistory';
import UploadImages from './ProductMedia';
import { getConfig } from '../../../config/env';
import './ProductCreate.css';

const ProductCreate = ({ initialVehicleId = null }) => {
  const [step, setStep] = useState(0);
  const { apiUrl } = getConfig();
  const [vehicleId, setVehicleId] = useState(initialVehicleId);
  const [initialData, setInitialData] = useState(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  useEffect(() => {
    const handleCloseForm = () => {
      setStep(0);
      setVehicleId(null);
    };
  
    window.addEventListener('closeProductForm', handleCloseForm);
    return () => window.removeEventListener('closeProductForm', handleCloseForm);
  }, []);
  
  // Si viene vehicleId, cargamos los datos para editar
  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/get.php?id=${vehicleId}`);
        const data = await res.json();
        // console.log('🚗 Datos cargados del backend:', data);
        if (data.status === 'success') {
          setInitialData(data.vehicle);
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Error cargando vehículo');
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const saveVehicle = async (data) => {
    const formData = new FormData();
    for (const key in data) formData.append(key, data[key]);
    if (vehicleId) formData.append('id', vehicleId);

    const res = await fetch(`${apiUrl}/api/products/save.php`, {
      method: 'POST',
      body: formData
    });
    

    return res.json();
  };

  const handleNext = async (formValues) => {
    const result = await saveVehicle(formValues);
    if (result.status === 'success') {
      setVehicleId(result.id);
      nextStep();
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      {step === 0 && (
        <ProductData
          initialData={initialData}
          onNext={handleNext}
        />
      )}

      {step === 1 && (
        <ProductHistory
          vehicle_id={vehicleId}
          onNext={nextStep}
          onBack={prevStep}
        />
      )}

      {step === 2 && (
        <UploadImages
          vehicle_id={vehicleId}
          onBack={prevStep}
          onFinish={() => alert('✅ Vehículo creado o actualizado con éxito')}
        />
      )}
    </div>
  );
};

export default ProductCreate;
