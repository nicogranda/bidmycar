// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';

import Marketplace from './Marketplace';
import AuctionButton from './auctions/components/AuctionButton';
import VehicleVideo from './card/VehicleVideo';
import BidsList from './auctions/List';
import Billboard from './auctions/components/Billboard';
import ChatButton from '../components/Chats/ChatButton';
import ChatShow from '../components/Chats/ChatShow';

import CardHero from './card/CardHero';
import ProductRead from './products/read/ProductRead';
import VehicleGallery from './products/photos/Gallery';
import Modal from '../components/Modal';
import SEO from '../components/SEO';
import { getConfig } from '../config/env';
import './ProductDetail.css';

const ProductDetail = () => {
  const { apiUrl } = getConfig();
  const { user } = useAuth();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [userName, setUserName] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const chatRef = useRef(null); // 🔹 ref para ChatShow
  const [hasChat, setHasChat] = useState(false);
  
 
  /* =========================
     POST-LOGIN CHAT INTENT
  ========================== */
  const postLoginAction = sessionStorage.getItem('postLoginAction');

  const shouldOpenChat =
    vehicle &&
    postLoginAction &&
    (() => {
      try {
        const parsed = JSON.parse(postLoginAction);
        return parsed.action === 'openChat' && Number(parsed.vehicleId) === Number(vehicle.id);
      } catch {
        return false;
      }
    })();

  useEffect(() => {
    if (user && shouldOpenChat) {
      setOpenChat(true);
      sessionStorage.removeItem('postLoginAction');
    }
  }, [user, shouldOpenChat]);

  /* =========================
     LOAD VEHICLE
  ========================== */
  useEffect(() => {
    if (!id) return;

    fetch(`${apiUrl}/index.php?page=product&action=show&id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data?.success || !data.vehicle) return;

        const v = data.vehicle;

        // Normalizar media a array
        const mediaArray = Object.entries(v.media || {}).flatMap(
          ([category, files]) =>
            Array.isArray(files)
              ? files.map(url => ({ category, url }))
              : []
        );

        setVehicle({ ...v, media: mediaArray });
      })
      .catch(err => console.error('Error cargando vehículo:', err));
  }, [apiUrl, id]);

  /* =========================
     LOAD USERNAME
  ========================== */
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

  /* =========================
     OWNERSHIP
  ========================== */
  const isOwner = user && Number(user.id) === Number(vehicle.owner_id);

  /* =========================
     RELOAD CHATS + SCROLL
  ========================== */
  const reloadChats = () => {
    if (chatRef.current?.loadMessages) chatRef.current.loadMessages();

    const chatSection = document.getElementById('bids-section');
    if (chatSection) chatSection.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <>
      <SEO
        title={`${vehicle.brand} ${vehicle.model} en BidMyCar`}
        description={`Descubre este ${vehicle.brand} ${vehicle.model} en subasta`}
        image={vehicle.cover_view || '/images/default-seo.jpg'}
      />
  
      <CardHero vehicleId={vehicle.id} />
  
      <section className="product-detail-layout">
  
        <main className="product-detail">
  
          {/* Billboard + Chat + Bid */}
          <div className="billboard-chat-auction">
  
            <div className="billboard">
              <Billboard
                vehicleId={vehicle.id}
                updatedAt={vehicle.updated_at}
              />
            </div>
  
            <div className="chat-btn">
              <ChatButton
                vehicleId={vehicle.id}
                ownerId={vehicle.owner_id}
                userName={user?.name}
                isOpen={openChat}
                onOpen={() => setOpenChat(true)}
                onClose={() => setOpenChat(false)}
                reloadChats={reloadChats}
              />
            </div>
  
            {!isOwner && (
              <div className="bid-btn">
                <AuctionButton
                  vehicle_id={vehicle.id}
                  seller_id={vehicle.owner_id}
                />
              </div>
            )}
  
          </div>
  
          {/* Carfax */}
          <div className="carfax-verification">
            <a
              href="https://www.carfax.eu/es"
              target="_blank"
              rel="noopener noreferrer"
              className="carfax-row"
            >
              <p className="carfax-info">
                Conoce la historia de este {vehicle.brand} {vehicle.model} del Historial CARFAX.
              </p>
              <img
                src={`${process.env.PUBLIC_URL}/images/carfax.png`}
                alt="Carfax"
                className="carfax-img"
              />
            </a>
          </div>
  
          {/* Product content */}
          <ProductRead vehicleId={vehicle.id} />
  
          <VehicleVideo vehicle={vehicle} />
  
          <div className="chat-show-wrapper">
            <ChatShow
              ref={chatRef}
              vehicleId={vehicle.id}
              userId={user?.id}
              isOwner={isOwner}
            />
          </div>
  
          <div id="bids-section">
            <BidsList vehicleId={vehicle.id} />
          </div>
  
        </main>
  
        <aside className="aside">
          <Marketplace />
        </aside>
  
      </section>
  
      <Modal
        show={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
      >
        <VehicleGallery />
      </Modal>
    </>
  );
  
};

export default ProductDetail;
