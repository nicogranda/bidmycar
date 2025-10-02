import React, { useEffect, useState } from 'react';
import { getConfig } from './config';  // Importar getConfig
import BidsList from './List';

import './Billboard.css';

const AuctionsDtails= ({ vehicleId }) => {
  const { apiUrl } = getConfig();
  const [data, setData] = useState({ total_bids: 0, highest_bid: 0 });
  const [error, setError] = useState(null);
  const [showBids, setShowBids] = useState(false);


  useEffect(() => {
    console.log('vehicleId recibido en Billboard:', vehicleId); // 👉 este es el debug
  
    if (!vehicleId) return;
  
    fetch(`${apiUrl}/api/auctions/billboard.php`, {
   
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: vehicleId }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 'success') {
          setData({
            total_bids: resData.total_bids,
            highest_bid: resData.highest_bid
          });
        } else {
          setError(resData.message || 'Error al obtener datos');
        }
      })
      .catch((err) => setError('Error de conexión'));
  }, [vehicleId]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="billboard">
      <p>Pujas:<strong> {data.total_bids}</strong> </p>
      <p>
      <a href="#bids-section" onClick={(e) => e.stopPropagation()}>
  Precio Actual: <strong>{data.highest_bid.toLocaleString()}€</strong>
</a>

</p>
{/* {showBids && (
      <div>
        <BidsList vehicleId={vehicleId} />
      </div>
    )} */}
    </div>
  );
};

export default AuctionsDetails;
