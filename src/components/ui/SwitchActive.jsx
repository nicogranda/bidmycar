import React, { useState, useEffect } from 'react';
import { getConfig } from '../../config/env';
import './SwitchActive.css';

const SwitchActive = ({ vehicleId, value: initialValue, onChange }) => {
  const { apiUrl } = getConfig();
  // Forzamos a que sea booleano para evitar errores de tipos (0 vs "0")
  const [isActive, setIsActive] = useState(Number(initialValue) === 1);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Este log te dirá en la consola si el Padre realmente está enviando el cambio
    console.log(`Vehículo ${vehicleId} actualizó a:`, initialValue);
    
    setIsActive(Number(initialValue) === 1);
  }, [initialValue, vehicleId]); 


  const toggleActive = async () => {
    if (loading) return;
  
    const previousState = isActive;
    const newState = !isActive;
  
    // Actualización optimista
    setIsActive(newState);
    if (onChange) onChange(newState ? 1 : 0);
    setLoading(true);
  
    try {
      const data = new FormData();
      data.append('active', 'toggle');
  
      const res = await fetch(
        `${apiUrl}/index.php?page=product&action=update&id=${vehicleId}`,
        { method: 'POST', body: data, credentials: 'include' }
      );
  
      const text = await res.text(); // Leemos como texto primero
      let result;
      
      try {
        result = JSON.parse(text); // Intentamos parsear
      } catch (e) {
        console.error("El servidor no devolvió un JSON válido:", text);
        throw new Error("Respuesta inválida");
      }
  
      if (!result.success) throw new Error(result.message);
      
      // Si todo va bien, no hacemos nada más, la bolita ya está en su sitio
    } catch (err) {
      console.error('Error capturado, revirtiendo:', err);
      // Solo aquí se devuelve la bolita
      setIsActive(previousState);
      if (onChange) onChange(previousState ? 1 : 0);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div 
      className={`custom-switch-container ${isActive ? 'active' : 'inactive'} ${loading ? 'loading' : ''}`}
      onClick={toggleActive}
    >
      <div className="custom-switch-rail">
        <div className="custom-switch-knob"></div>
      </div>
    </div>
  );
};

export default SwitchActive;
