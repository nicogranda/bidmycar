// src/components/BidsTable.jsx
import { useEffect, useState } from 'react';
import { getConfig } from '../../config/env'; // Importar la configuración

const { apiUrl } = getConfig();  // Obtener la URL desde el config

export default function BidsTable({ vehicleId }) {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    async function fetchBids() {
      try {
        const response = await fetch(`${apiUrl}/api/auctions/index.php?id=${vehicleId}`);
        const data = await response.json();
        setBids(data);
      } catch (error) {
        console.error('Error fetching bids:', error);
      }
    }
    if (vehicleId) {
      fetchBids();
    }
  }, [vehicleId]);

  function formatTime(createdAt) {
    const now = new Date();
    const bidTime = new Date(createdAt);
    const diffMs = now - bidTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours < 24
      ? `${Math.floor(diffHours)} hours`
      : `${Math.floor(diffHours / 24)} days`;
  }

  return (
<div
  id="bidsTableContainer"
  style={{
    margin: 0,
    textAlign: 'left',
    width: 'auto',  // Hace que el contenedor se ajuste al contenido
  }}
>
  <h3>Compradores</h3>
  <table
    id="bidsTable"
    style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'flex-start',
      width: 'auto', // La tabla solo tendrá el ancho necesario
      borderCollapse: 'collapse',
      borderLeft: '1px solid #ddd',
      borderRight: '1px solid #ddd',
    }}
  >
    {/* <thead>
      <tr>
        <th style={{ textAlign: 'left', padding: '10px' }}>Contact</th>
        <th style={{ textAlign: 'left', padding: '10px' }}>User Role</th>
        <th style={{ textAlign: 'left', padding: '10px' }}>Time</th>
        <th style={{ textAlign: 'left', padding: '10px' }}>Bid</th>
      </tr>
    </thead> */}
    <tbody>
      {bids.map((bid, index) => (
        <tr
          key={index}
          style={{
            borderBottom: '1px solid #ddd',
            verticalAlign: 'top',
          }}
        >
          <td
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
            //   borderLeft: '1px solid #ddd',
            //   borderRight: '1px solid #ddd',
            }}
          >
            <div
              style={{
                 display: 'flex',
                // // justifyContent: 'flex-start',
                 alignItems: 'center',
                gap: '8px',
                margin: 0,
              }}
            >
              <i
                className="fas fa-user"
                style={{
                  
                  backgroundColor: 'var(--color-primary)',
                  color: '#fff',
                  padding: '5px',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                //   display: 'flex',
                //   justifyContent: 'flex-start',
                textAlign: 'left',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              ></i>
              <div  style={{ textAlign: 'left' }}>{bid.contact}</div>
            </div>
          </td>

          <td
            style={{
              padding: '10px',
              borderLeft: '1px solid #ddd',
              borderRight: '1px solid #ddd',
            }}
          >
            {bid.role}
          </td>
          <td
            style={{
              padding: '10px',
              borderLeft: '1px solid #ddd',
              borderRight: '1px solid #ddd',
            }}
          >
            {formatTime(bid.created_at)}
          </td>
          <td
            style={{
              padding: '10px',
              borderLeft: '1px solid #ddd',
              borderRight: '1px solid #ddd',
            }}
          >
            <div
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                display: 'inline-block',
              }}
            >
              {bid.amount} €
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
  
  
}
