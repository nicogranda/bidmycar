// src/components/Card.jsx
import React, { useEffect, useState } from 'react';
import Gallery from './Gallery';
import './Card.css';
import { useParams } from 'react-router-dom';

const Card = () => {
  const { id } = useParams(); // Este es el ID que viene de la URL
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8888/bidmycar/backend/api/products/show.php?id=${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('Vehículo cargado:', data);
        setVehicle(data);
      })
      .catch(error => {
        console.error('Error al cargar vehículo:', error);
      });
  }, [id]); // Solo se ejecuta cuando el ID cambia

  if (!vehicle) {
    return <p>Cargando detalles del vehículo...</p>;
  }

  return (
    <>
      <div className="grid-container">
      <main className="main">
        <a href="https://www.carfax.eu/es" target="_blank" rel="noopener noreferrer">
          <img    src={`${process.env.PUBLIC_URL}/images/carfax.png`}  alt="Carfax" style={{ width: '150px' }} />
          Confiar es way!. Estar seguro es mejor
        </a>

        <div className="vehicle-details">
        <div className="row">
          <div className="label">Marca</div><div className="value">{vehicle.brand}</div>
          <div className="label">Modelo</div><div className="value">{vehicle.model}</div>
        </div>
        <div className="row">
          <div className="label">Save</div><div className="value">—</div>
          <div className="label">Kilometraje</div><div className="value">{vehicle.mileage}</div>
        </div>
        <div className="row">
          <div className="label">Serial</div><div className="value">{vehicle.serial}</div>
          <div className="label">Situación Legal</div><div className="value">{vehicle.title_status}</div>
        </div>
        <div className="row">
          <div className="label">Location</div><div className="value">{vehicle.location}</div>
          <div className="label">Vendedor</div><div className="value">{vehicle.seller}</div>
        </div>
        <div className="row">
          <div className="label">Motor</div><div className="value">{vehicle.engine}</div>
          <div className="label">Drivetrain</div><div className="value">{vehicle.drivetrain}</div>
        </div>
        <div className="row">
          <div className="label">Transmisión</div><div className="value">{vehicle.transmission}</div>
          <div className="label">Carrocería</div><div className="value">{vehicle.body_style}</div>
        </div>
        <div className="row">
          <div className="label">Color Exterior</div><div className="value">{vehicle.exterior_color}</div>
          <div className="label">Color Interior</div><div className="value">{vehicle.interior_color}</div>
        </div>
        <div>
        <div className="details">
        <h3 className="vehicle-commints">Destacados</h3>
        <p>{vehicle.highlights}</p>

        <h3 className="vehicle-commints">Equipado con</h3>
        <ul>
          {vehicle.equipment.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>
 
        <h3 className="vehicle-commints">Modificaciones Mecánicas</h3>
        <ul>
          {vehicle.modifications_mechanical.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="vehicle-commints">Modificaciones Exteriores</h3>
        <ul>
          {vehicle.modifications_exterior.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="vehicle-commints">Modificaciones Internas</h3>
        <ul>
          {vehicle.modifications_interior.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>
         
        <h3 className="vehicle-commints">Fallas conocidas</h3>
        <ul>
          {vehicle.known_flaws.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="vehicle-commints">Histórico de Servicios Recientes</h3>
        <ul>
          {vehicle.recent_service_history.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>
       
        <h3 className="vehicle-commints">La venta incluye</h3>
        <ul>
          {vehicle.other_items_included.split('\n').map((item, i) => (
              item.trim() && <li key={i}>{item}</li>
          ))}
        </ul>
        
        <h3 className="vehicle-commints">Nota del Vendedor</h3>
        <p>{vehicle.seller_notes}</p>   

        <h3 className="vehicle-commints">Video</h3>
        <div className="video-container" style={{ marginTop: '1rem' }}>
          <iframe
            width="100%"
            height="400"
            src="https://www.youtube.com/embed/V2uSP1cN3KY?start=6"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        </div>
          <div className="disclaimer">
          Todos los listados de subastas en <strong>BidMyCar</strong> se redactan en base a la información proporcionada por el vendedor durante el proceso de envío y han sido revisados por el vendedor para garantizar su precisión según su mejor criterio. Sin embargo, es responsabilidad del postor realizar toda la debida diligencia antes de hacer una oferta en cualquier subasta, incluyendo, pero no limitado a, la verificación del contenido, defectos, legalidad de registro en cualquier estado, cumplimiento de emisiones/seguridad y elegibilidad de importación. Por favor, contáctanos si tienes preguntas o solicitudes específicas.
          </div>
        </div>
        </div>
      </main>
      <aside className="aside">
        <Gallery />
      </aside>
    </div>
  

  
      
      
     
    </>
  );
  
};

export default Card;
