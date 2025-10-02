// src/pages/products/components/Card.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationLookup from '../../../components/LocationLookup';

import Gallery from '../../portfolio/Gallery';
import VerifyCards from '../../../components/VerifyCards';

import VehicleVideo from './VehicleVideo';
import BidsList from '../../auctions/List';
import Billboard from '../../auctions/components/Billboard';
import BidsButton from '../../auctions/components/BidButton';
import { getConfig } from '../../../config/env';

import VehicleGallery from '../photos/Gallery'; 
import Modal from '../../../components/Modal'; // asegúrate que la ruta sea correcta
import SEO from '../../../components/SEO'; // asegúrate que la ruta sea correcta

const ProductRead = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [userName, setUserName] = useState(null);
  const { apiUrl } = getConfig();
  const [showGalleryModal, setShowGalleryModal] = useState(false);


  // Cargar datos del vehículo
  useEffect(() => {
    fetch(`${apiUrl}/api/products/show.php?id=${id}`)
      .then(res => res.json())
      // .then(data => setVehicle(data))
      .then(data => {
        console.log('📦 Datos del vehículo:', data); // 👈 inspección aquí
        setVehicle(data);
      })
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

  const handleLoginRedirect = () => {
    localStorage.setItem('redirectAfterLogin', window.location.pathname);
    navigate('/login');
  };

  if (!vehicle) return <p>Cargando detalles del vehículo...</p>;

  const userId = localStorage.getItem('user_id');
  const isOwner = userId && vehicle.seller_id && Number(userId) === Number(vehicle.seller_id);

  return (
    <>
     <SEO 
      title={`${vehicle.brand} ${vehicle.model} en BidMyCar`}
      description={`Descubre este ${vehicle.brand} ${vehicle.model} en subasta. ¡Entra y haz tu oferta!`}
      keywords={`${vehicle.brand}, ${vehicle.model}, coche de segunda mano, subasta`}
      image={vehicle.cover_view || '/images/default-seo.jpg'}
      url={`${window.location.origin}/car/${vehicle.id}`}
    />

    {/* <a href="#" onClick={() => setShowGalleryModal(true)}>
        Ver Galería
    </a> */}
  
      <div className="grid-container">
        <div className="vehicle-details">
          <div className="top-section">
          <div className="billboard-and-verification">
            <div className="billboard-wrapper">
              <Billboard vehicleId={vehicle.id} updatedAt={vehicle.updated_at} />
            </div>

            <div className="bid-no-offer-wrapper">
              {userName ? (
                isOwner ? (
                  <div className="no-offer-btn-wrapper">
                    {/* <button className="no-offer-btn" disabled>
                      No puedes ofertar en tu vehículo
                    </button> */}
                  </div>
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
                >
                  Inicia sesión para ofertar
                </button>
              )}
          </div>

        </div>

        <div className="carfax-verification">
            <a
                    href="https://www.carfax.eu/es"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="carfax-row"
                  >
                    <p className="carfax-info">
                      Conoce la historia de este {vehicle.brand} {vehicle.model} del Historial CARFAX.
                      Utiliza este informe para verificar kilometraje reportado, inspecciones, daños y accidentes y más!
                    </p>

                    <img
                      src={`${process.env.PUBLIC_URL}/images/carfax.png`}
                      alt="Carfax"
                      className="carfax-img"
                    />
                  </a>
                </div>

          </div>

          <section className="product-sheet">
            {[
              ['Marca', vehicle.brand],
              ['Modelo', vehicle.model],
              ['Kilometraje', vehicle.mileage],
              ['VIN', vehicle.serial],
              ['Situación Legal', vehicle.title_status],
              ['Location', vehicle.zip_code],
              ['Vendedor', vehicle.seller],
              ['Motor', vehicle.engine],
              ['Tracción', vehicle.drivetrain],
              ['Transmisión', vehicle.transmission],
              ['Carrocería', vehicle.body_style],
              ['Color Exterior', vehicle.color_ext],
              ['Color Interior', vehicle.color_int],
            ].map(([label, value], i) => (
              <article className="row" key={i}>
                <div className="label">{label}</div>
                <div className="value">{value}</div>
              </article>
            ))}
          </section>

          <div className="details">
            <h3 className="vehicle-commints">Destacados</h3>
            <p>{vehicle.highlights}</p>

            <h3 className="vehicle-commints">Equipado con</h3>
            <ul>
              {vehicle.equipment?.split('\n').map((item, i) =>
                item.trim() && <li key={i}>{item}</li>
              )}
            </ul>

            {[
              ['Modificaciones Mecánicas', vehicle.modifications_mechanical],
              ['Modificaciones Exteriores', vehicle.modifications_exterior],
              ['Modificaciones Internas', vehicle.modifications_interior],
              ['Fallas conocidas', vehicle.known_flaws],
              ['Histórico de Servicios Recientes', vehicle.recent_service_history],
              ['La venta incluye', vehicle.other_items_included],
            ].map(([title, content], i) => (
              content && (
                <div key={i}>
                  <h3 className="vehicle-commints">{title}</h3>
                  <ul>
                    {content.split('\n').map((item, j) =>
                      item.trim() && <li key={j}>{item}</li>
                    )}
                  </ul>
                </div>
              )
            ))}

            <h3 className="vehicle-commints">Nota del Vendedor</h3>
            <p>{vehicle.seller_notes}</p>

            <div className="disclaimer">
              Todos los listados de subastas en <strong>BidMyCar</strong> se redactan en base a la información proporcionada por el vendedor durante el proceso de envío y han sido revisados por el vendedor para garantizar su precisión según su mejor criterio. Sin embargo, es responsabilidad del postor realizar toda la debida diligencia antes de hacer una oferta, incluyendo verificación del contenido, defectos, legalidad de registro, emisiones y elegibilidad de importación.
            </div>



            <VehicleVideo vehicle={vehicle} />

            <div id="bids-section">
              <BidsList vehicleId={id} />
            </div>
          </div>
        </div>

        <aside className="aside form-container"> 
          <Gallery />
        </aside>
      </div>
      <Modal show={showGalleryModal} onClose={() => setShowGalleryModal(false)}>
        <VehicleGallery />
      </Modal>

    </>
  );
};

export default ProductRead;