// src/components/CardUpdate.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationLookup from '../../../components/LocationLookup';
import VerifyCards from '../../../components/VerifyCards';
import BidButton from '../../auctions/components/BidButton';
import Billboard from '../../auctions/components/Billboard';
// import VehicleVideo from './VehicleVideo';
// import VideoUpdate from '../VideoUpdate';
import BidsList from '../../auctions/List';
import { getConfig } from '../../../config/env';
import '../read/ProductRead.css';


const CardUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [userName, setUserName] = useState(null);
  const { apiUrl } = getConfig();

  const userId = localStorage.getItem('user_id');

  // Cargar datos del vehículo
  useEffect(() => {
    fetch(`${apiUrl}/api/products/show.php?id=${id}`)
      .then(res => res.json())
      .then(data => setVehicle(data))
      .catch(err => console.error('Error al cargar vehículo:', err));
  }, [apiUrl, id]);

  // Cargar usuario
  useEffect(() => {
    const loadUser = () => setUserName(localStorage.getItem('userName'));
    loadUser();

    window.addEventListener('userLogin', loadUser);
    window.addEventListener('userLogout', loadUser);

    return () => {
      window.removeEventListener('userLogin', loadUser);
      window.removeEventListener('userLogout', loadUser);
    };
  }, []);

  if (!vehicle) return <p>Cargando detalles del vehículo...</p>;

  const isOwner = userId && vehicle.seller_id && Number(userId) === Number(vehicle.seller_id);
  const isAllowed = userId && isOwner;

  if (!isAllowed) return <p>No tienes permiso para editar este vehículo.</p>;

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // 👀 DEBUG: ver todo lo que se va a enviar
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`);
    // }
    fetch(`${apiUrl}/api/products/update.php`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Respuesta del servidor:', data);
        // alert('Cambios guardados correctamente');
      })
      .catch((err) => {
        console.error('Error al guardar los cambios:', err);
        alert('Ocurrió un error al guardar');
      });
  };

  const handleLoginRedirect = () => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/login');
  };

  return (
    <>
      <div className="grid-container">
        <div className="vehicle-details">
          <div className="top-section">
            <div className="billboard-and-verification">
              <div className="billboard-wrapper">
                <Billboard vehicleId={vehicle.id} />
              </div>

              {/* <div className="carfax-verification">
                <a href="https://www.carfax.eu/es" target="_blank" rel="noopener noreferrer">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/carfax.png`}
                    alt="Carfax"
                    style={{ width: '150px' }}
                  />
                </a>

                {userName ? (
                  isOwner ? (
                    <button className="buy-btn" disabled title="No puedes pujar por tu propio vehículo">
                      No puedes ofertar en tu vehículo
                    </button>
                  ) : (
                    <VerifyCards 
                      user_id={userId} 
                      vehicle_id={vehicle.id} 
                      seller_id={vehicle.seller_id} 
                    />
                  )
                ) : (
                  <button
                    onClick={handleLoginRedirect}
                    className="btn-verify"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "var(--color-primary)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  >
                    Inicia sesión para ofertar
                  </button>
                )}
              </div> */}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
  <section className="product-sheet">
    {[
      ['Marca', 'brand', vehicle.brand],
      ['Modelo', 'model', vehicle.model],
      ['Kilometraje', 'mileage', vehicle.mileage],
      ['VIN', 'serial', vehicle.serial],
      ['Año', 'year', vehicle.year],
      ['Situación Legal', 'title_status', vehicle.title_status],
      ['Location', 'zip_code', vehicle.zip_code],
      ['Vendedor', 'seller', vehicle.seller],
      ['Motor', 'engine', vehicle.engine],
      ['Tracción', 'drivetrain', vehicle.drivetrain],
      ['Transmisión', 'transmission', vehicle.transmission],
      ['Carrocería', 'body_style', vehicle.body_style],
      ['Color Exterior', 'color_ext', vehicle.color_ext],
      ['Color Interior', 'color_int', vehicle.color_int],
      ['Combustible', 'energy_type', vehicle.energy_type],
    ].map(([label, name, value], i) => (
      <article className="row" key={i}>
        <div className="label">{label}</div>
        <input
          className="value"
          type="text"
          name={name}
          defaultValue={value ?? ''}
        />
      </article>
    ))}
  </section>

  <div className="details">
    {[
      ['Destacados', 'highlights', vehicle.highlights],
      ['Equipado con', 'equipment', vehicle.equipment],
      ['Modificaciones Mecánicas', 'modifications_mechanical', vehicle.modifications_mechanical],
      ['Modificaciones Exteriores', 'modifications_exterior', vehicle.modifications_exterior],
      ['Modificaciones Internas', 'modifications_interior', vehicle.modifications_interior],
      ['Fallas conocidas', 'known_flaws', vehicle.known_flaws],
      ['Histórico de Servicios Recientes', 'recent_service_history', vehicle.recent_service_history],
      ['La venta incluye', 'other_items_included', vehicle.other_items_included],
      ['Nota del Vendedor', 'seller_notes', vehicle.seller_notes],
    ].map(([title, name, content], i) => (
      <div key={i}>
        <h3 className="vehicle-commints">{title}</h3>
        <textarea
          name={name}
          defaultValue={content ?? ''}
          className="value"
          rows={4}
          style={{ whiteSpace: 'pre-wrap' }}
        />
      </div>
    ))}
  </div>

  <div className="details">
    <h3 className="vehicle-commints">Fecha de Lanzamiento</h3>
    <input 
      type="date" 
      name="updated_at" 
      defaultValue={
        vehicle.updated_at
          ? new Date(vehicle.updated_at).toISOString().slice(0, 10)
          : ''
      }
    />
  </div>

  <input 
    type="hidden" 
    name="id" 
    value={vehicle.id ?? ''}
  />

  <input
    type="hidden"
    name="user_id"
    value={userId ?? ''}
  />

  <button
    type="submit"
    style={{
      marginTop: "20px",
      backgroundColor: "var(--color-primary)",
      color: "#fff",
      padding: "10px 20px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Guardar cambios
  </button>
</form>

        </div>


      </div>
    </>
  );
};

export default CardUpdate;