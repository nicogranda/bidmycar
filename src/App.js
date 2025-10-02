// App.js
import React, { useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import './App.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

import { AuthProvider } from './components/Layout/AuthContext';

// import HomeHero from './pages/home/HomeHero';
// import Filter from './components/Layout/Filter';


import ProductCreate from './pages/products/create/ProductCreate';
import ProductHistory from './pages/products/create/ProductHistory';
import ProductMedia from './pages/products/create/ProductMedia';

import SortableImages from "./components/UpdateImage"; 

import VideoUploader from "./components/videos/Uploader"; 
import PhotoInstructionsModal from './pages/products/photos/InstructionsModal';

import Vehiculo from './pages/card/Card';
import VehicleGallery from './pages/products/photos/Gallery';

import CarUpdate from './pages/products/update/ProductUpdate';

import VerifyCard from './components/Checkout';
import PayWithCard from './components/stripe/PayWithCard';

import BidButton from './pages/auctions/components/BidButton';

// import VerifyCards from './components/VerifyCards';

import AuctionCreate from './pages/auctions/AuctionCreate';

import LoginGoogle from './components/auth/LoginGoogle';



import CookieConsent from './components/CookieConsent';
import HomePage from './pages/home/HomePage';
// import Portfolio from './pages/portfolio/Portfolio';

import BidMyCarInfo from './pages/about/AboutPage';

import Products from './pages/products/index';

// Clave pública de Stripe (reemplaza por la tuya si es diferente)
const stripePromise = loadStripe(' pk_test_51Kzn04INULDtTeqkAHKEme60LLlJg4HeOwzQvyaEN0fveSncrQJhblBpYfE5wFywuh5kbmjKZ9sIIx3OPg1DXZBF00fts9sbNt'); 
const clientId = '697331076459-dpugbu7lrcke69o8q5asgdm7e51kfv7n.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Elements stripe={stripePromise}>
        <BrowserRouter> 
        <AuthProvider>
          <div className="App">
            <Header />
               {/* Aviso de cookies visible en toda la app */}
               <CookieConsent />
               <main className="container">
            {/* <main style={{ paddingTop: '100px', minHeight: '485px' }}> */}
              <Routes>
                 {/* home */}  
                <Route path="/" element={<HomePage />} />
                
                {/* portfolio */}
                {/* <Route path="/portfolio" element={<Portfolio />} /> */}

                {/* read*/}
                <Route path="/vehiculo/:id" element={<Vehiculo />} />
                <Route path="/vehiculo/galeria/:id" element={<VehicleGallery />} />
                
                 {/* auth */}  
                <Route path="/login" element={<LoginGoogle />} />

                {/* create product*/}  
                <Route path="/vender-vehiculo" element={<ProductCreate />} />
                <Route path="/vehiculo/historico/:id" element={<ProductHistory />} />
                <Route path="/car/upload/:id" element={<ProductMedia />} />
                <Route path="/video-uploader" element={<VideoUploader />} />
                <Route path="/car/ordenar/:id" element={<SortableImages />} />

                  {/* payment product*/}  
                <Route path="/vehiculo/:id/pago/banner" element={<PayWithCard/>} />

                {/* update */}
                <Route path="/car/update/:id" element={<CarUpdate />} />
                <Route path="/vehiculo/editar/:id" element={<ProductCreate />} />

                <Route path="/vehicle/:id/bid" element={<BidButton />} />

                {/* <Route path="/VerifyCreditCard" element={<VerifyCreditCard />} /> */}
                <Route path="/auction/create" element={<AuctionCreate />} />
                <Route path="/verify-card" element={<VerifyCard />} />

                {/* about */}
                <Route path="/sobre-nosotros" element={<BidMyCarInfo />} />
                
                {/* admin */}
                <Route path="/:user_id/vehiculos" element={<Products />} />


              </Routes>
            </main>
            <Footer
              user_facebook="bidmycar.es"
              user_instagram="bidmycar.es"
              user_youtube="tucanal"
              user_tiktok="tucuenta"
              address="Calle General Freire"
              city="Irún"
              state="Guipúzcoa"
              zip="20303"
              country="España"
              phone="+34 600 14 26 63"
              brand="BidMyCar"
              services={[
                "Vende tu Coche",
                "Guia se Fotos",
                "Dashboard",
                "Inspección",
                "Servicio Fotográfico"
              ]}
            />
          </div>
          </AuthProvider>  
        </BrowserRouter>
      </Elements>
    </GoogleOAuthProvider>
  );
}

export default App;