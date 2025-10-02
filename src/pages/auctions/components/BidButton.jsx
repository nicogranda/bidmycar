// src/components/BidButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BidButton = ({ vehicle }) => {
  const navigate = useNavigate();

  const handleBidClick = () => {
    const userId = localStorage.getItem('user_id');

    if (!userId) {
      // Guardar la ruta actual para redirigir después del login
      localStorage.setItem('redirectAfterLogin', `/vehicle/${vehicle.id}/bid`);
      navigate('/login');
    } else {
      // Navegar al componente VerifyCards con los datos necesarios
      navigate('/verify-cards', {
        state: {
          user_id: userId,
          vehicle,
        },
      });
    }
  };

  return (
    <button onClick={handleBidClick}
        style={{
            padding: "10px 20px",
            backgroundColor: "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
        }}
    >
      Ofertar
    </button>
  );
};

export default BidButton;
