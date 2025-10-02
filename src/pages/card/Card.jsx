// src/pages/card/Card.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Portfolio from '../portfolio/Portfolio';
import VerifyCards from '../../components/VerifyCards';
import VehicleVideo from './VehicleVideo';
import BidsList from '../auctions/List';
import Billboard from '../auctions/components/Billboard';
import { getConfig } from '../../config/env';

import CardHero from './CardHero';
import ProductRead from '../products/read/ProductRead'; 
import VehicleGallery from '../products/photos/Gallery'; 
import Modal from '../../components/Modal'; 
import SEO from '../../components/SEO'; 
import './Card.css'; 

const Card = () => {
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

     <CardHero vehicleId={vehicle.id} />


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
                    <div className="no-offer-btn-wrapper"></div>
                  ) : (
                    <VerifyCards
                      user_id={userId}
                      vehicle_id={vehicle.id}
                      seller_id={vehicle.seller_id}
                    />
                  )
                ) : (
                  <button onClick={handleLoginRedirect} className="btn-verify">
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

          {/* ✅ Aquí usamos ProductRead que ya incluye ficha técnica, detalles y nota del vendedor */}
          <ProductRead vehicleId={vehicle.id} />

          {/* Video */}
          <VehicleVideo vehicle={vehicle} />

          {/* Sección de pujas */}
          <div id="bids-section">
            <BidsList vehicleId={vehicle.id} />
          </div>
        </div>

        <aside className="aside form-container"> 
          <Portfolio />
        </aside>
      </div>

      {/* Modal de galería */}
      <Modal show={showGalleryModal} onClose={() => setShowGalleryModal(false)}>
        <VehicleGallery />
      </Modal>
    </>
  );
};

export default Card;
