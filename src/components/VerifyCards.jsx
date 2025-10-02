import React from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from '../config/env';

const VerifyCards = ({ user_id, vehicle_id, seller_id }) => {
  const navigate = useNavigate();
  const { apiUrl } = getConfig();

  const handleClick = async () => {
    // Validar que seller_id y user_id estén definidos
    if (!seller_id || !user_id || !vehicle_id) {
      console.log("Datos recibidos:", { seller_id, user_id, vehicle_id });
    
      let mensaje = "Faltan los siguientes datos:\n";
      if (!seller_id) mensaje += "- seller_id\n";
      if (!user_id) mensaje += "- user_id\n";
      if (!vehicle_id) mensaje += "- vehicle_id\n";
    
      alert(mensaje);
      return;
    }
    

    if (user_id.toString() === seller_id.toString()) {
      alert("No puedes ofertar en tu propio vehículo.");
      return;
    }

    const response = await fetch(`${apiUrl}/api/stripe/setup.php`);
    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    const { clientSecret } = data;

    navigate("/checkout", {
      state: {
        clientSecret,
        vehicle_id,
        user_id,
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="buy-btn"
    >
      Ofertar
    </button>
  );
};

export default VerifyCards;
