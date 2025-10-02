import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../config/env';
import TopBid from './TopBid';
import RemainingDays from './RemainingDays';
import './Billboard.css';

const Billboard = ({ vehicleId }) => {
  const { apiUrl } = getConfig();
  const [data, setData] = useState({ total_bids: 0, updated_at: null });
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
        // console.log("✅ Billboard data:", resData);
        if (resData.status === 'success') {
          setData({
            total_bids: resData.total_bids,
            updated_at: resData.updated_at
          });
        } else {
          setError(resData.message || 'Error al obtener datos');
        }
      })
      .catch(() => setError('Error de conexión'));
  }, [vehicleId]);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="billboard">
      {data.updated_at && (
        <RemainingDays updatedAt={data.updated_at} />
      )}

      <a href="#bids-section">
        Pujas: <strong>{data.total_bids}</strong>
      </a>

      {/* <TopBid vehicleId={vehicleId} /> */}
    </div>
  );
};

export default Billboard;
