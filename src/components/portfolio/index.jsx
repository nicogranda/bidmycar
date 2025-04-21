import React, { useEffect, useState } from 'react';
import './Gallery.css';

const Gallery = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8888/bidmycar/backend/api/products/index.php')
      .then(response => response.json())
      .then(data => {
        console.log('Vehículos cargados:', data);
        setVehicles(data);
      })
      .catch(error => {
        console.error('Error al cargar vehículos:', error);
      });
  }, []);

  return (
<div className="gallery">
  <div className="products">
    {vehicles.map((vehicle, index) => (
      <div key={index} className="image-container">
        <img
        src={`http://localhost:8888/bidmycar/backend/public/images/${vehicle.id}/${vehicle.cover_view}`}
         
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="shadow-basic"
        />

        <div className="image-text">
        Precio: €{vehicle.price}
        </div>
        <div className="card-text">
          <p className="card-text-title">{vehicle.year} {vehicle.brand} {vehicle.model}</p>
          <p className="card-text-container">{vehicle.model} {vehicle.transmission}</p>
          <p className="card-text-container">{vehicle.mileage} km  {vehicle.modified}</p>
          <p className="card-text-container">{vehicle.zip_code}</p>
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Gallery;
