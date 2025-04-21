import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RemainingDays from './RemainingDays';

import './Gallery.css';

const Gallery = () => {
  const [vehicles, setVehicles] = useState([]);

  const getLocation = async (zip) => {
    try {
      const res = await fetch(`http://localhost:8888/bidmycar/backend/api/location.php?zip=${zip}`);
      const data = await res.json();
      return `${data.city}, ${data.state}`;
    } catch (error) {
      console.error('Error al obtener ciudad y estado:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchVehiclesWithLocation = async () => {
      try {
        const res = await fetch('http://localhost:8888/bidmycar/backend/api/products/index.php');
        const data = await res.json();
  
        const vehiclesWithLocation = await Promise.all(
          data.map(async (vehicle) => {
            const location = await getLocation(vehicle.zip_code);
            return { ...vehicle, location };
          })
        );
  
        setVehicles(vehiclesWithLocation);
      } catch (error) {
        console.error('Error al cargar vehículos:', error);
      }
    };
  
    fetchVehiclesWithLocation();
  }, []);
  
  
  return (
<div className="gallery">
  <div className="products">
  
    {vehicles.map((vehicle, index) => (
      
      <div key={index} className="image-container">

        <Link to={`/car/${vehicle.id}`} className="card-link">
          <img
            src={`http://localhost:8888/bidmycar/backend/public/images/${vehicle.id}/${vehicle.cover_view}`}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="shadow-basic"
          />
          <div className="image-text">
          <RemainingDays updatedAt={vehicle.updated_at} /><span>Bid: {vehicle.price}€</span>
          </div>

          <div className="card-text">
            {/* <Link to={`/card/${vehicle.id}`} className="card-link"> */}
              <p className="card-text-title">{vehicle.year} {vehicle.brand} {vehicle.model}</p>
              <p className="card-text-container">{vehicle.model} {vehicle.transmission}</p>
              <p className="card-text-container">{vehicle.mileage} km  {vehicle.modified}</p>
              <p className="card-text-container spot">{vehicle.zip_code} {vehicle.location}</p>

          </div>
        </Link>

      </div>
    ))}
   
  </div>
</div>

  );
};

export default Gallery;
