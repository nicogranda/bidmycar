import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import Filter from './components/Filter';
import Gallery from './components/Gallery';
import Car from './components/products/show'; // Este componente mostrará el detalle del vehículo
import CreateProductForm from './pages/Products/Create/TechSheetForm';
import CreateProductHistoryForm from './pages/Products/Create/ProductHistoryForm';

// import VehicleFeaturesForm from './components/VehicleFeaturesForm';
import LoginGoogle from './components/auth/LoginGoogle';
import Footer from './components/Footer';

const clientId = '697331076459-dpugbu7lrcke69o8q5asgdm7e51kfv7n.apps.googleusercontent.com';

function HomePage() {
  return (
    <>
      <HeroSlider />
      <Filter />
      <Gallery />
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <div className="App">
          <Header />
          <main style={{ paddingTop: '100px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/car/:id" element={<Car />} />

              {/* <Route path="/car:id" element={<Car />} />  */}
              <Route path="/sell-car" element={<CreateProductForm />} />
              <Route path="/historico" element={<CreateProductHistoryForm />} />
              {/* <Route path="/sell-car/features" element={<VehicleFeaturesForm />} /> */}
              <Route path="/login" element={<LoginGoogle />} />
            </Routes>
          </main>
          <Footer
            user_facebook="tupagina"
            user_instagram="tupagina"
            user_youtube="tucanal"
            user_tiktok="tucuenta"
            address="Calle General Freire"
            city="Irún"
            state="Guipúzcoa"
            zip="20303"
            country="España"
            phone="+34 60014 26 63"
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
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
