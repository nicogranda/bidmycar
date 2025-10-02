import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../config/env';
import './TopBid.css'; // Opcional para estilos

const TopBid = ({ vehicleId }) => {
  const { apiUrl } = getConfig();
  const [highestBid, setHighestBid] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vehicleId) return;

    fetch(`${apiUrl}/api/auctions/billboard.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: vehicleId }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 'success') {
          setHighestBid(resData.highest_bid);
        } else {
          setError(resData.message || 'Error al obtener la mejor puja');
        }
      })
      .catch(() => setError('Error de conexión'));
  }, [vehicleId]);

  if (error) return <p className="top-bid-error">Error: {error}</p>;
  if (highestBid === null) return <p className="top-bid-loading">Cargando...</p>;

  return (
    <div className="top-bid">
      Puja: <strong>{highestBid.toLocaleString()} €</strong>
    </div>
  );
};

export default TopBid;