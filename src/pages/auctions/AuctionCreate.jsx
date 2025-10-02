import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getConfig } from '../../config/env';  // Importar la configuración


const AuctionCreate = () => {
  const location = useLocation();
  const { vehicle_id } = location.state || {};
  const navigate = useNavigate();
  const { apiUrl } = getConfig();  // Obtener la URL desde el config

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/login'); // Redirige al login si no está autenticado
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
  
  const user_id = localStorage.getItem('user_id');

  const [formData, setFormData] = useState({
    vehicle_id: '',
    user_id: '',
    amount: '',
    verify_card: false,
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      vehicle_id: vehicle_id || prev.vehicle_id,
      user_id: user_id || prev.user_id,
      verify_card: location.state?.verify_card || false
    }));
  }, [vehicle_id, user_id, location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const datos = {
      ...formData,
      vehicle_id: formData.vehicle_id || vehicle_id,
      user_id: formData.user_id,
      amount: formData.amount,      // Ensure amount is included
      verify_card: formData.verify_card // Ensure verify_card is included
    };

    const vehicleId = datos.vehicle_id; // O como tengas

    console.log('Datos que se enviarán:', datos); // Make sure this logs the correct object
    
    fetch(`${apiUrl}/api/auctions/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
      mode: 'cors'
    })
      .then(res => res.text())
      .then(text => {
        console.log('Raw response:', text);
        try {
          const result = JSON.parse(text);
          console.log('Respuesta del backend:', result);
    
          if (result.status === 'success') {
            window.location.href = `/car/${vehicleId}`;
          } else {
            alert('Error en la creación de la subasta');
          }
          
        } catch (e) {
          console.error('Error al parsear el JSON:', e);
          alert('Respuesta inválida del servidor');
        }
      })
      .catch(error => {
        console.error('Error en el fetch:', error);
        alert('Hubo un error al enviar la oferta');
      });
    
    
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Hacer una Oferta</h2>

      <input
        type="number"
        name="amount"
        placeholder="Cantidad ofertada (€)"
        value={formData.amount}
        onChange={handleChange}
        required
      />

      {formData.verify_card ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Tarjeta verificada</p>
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>❌ Tarjeta no verificada</p>
      )}

      <button type="submit" disabled={!formData.verify_card}>
        Ofertar
      </button>
    </form>
  );
};

export default AuctionCreate;
