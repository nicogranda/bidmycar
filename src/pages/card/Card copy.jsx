// components/products/show.jsx
import React from 'react';
import Gallery from '../portfolio/Gallery';
import CardHero from './CardHero';
import ProductRead from '../products/read/ProductRead';
import './Card.css';

const Vehiculo = () => {
  return (
    <main>
      <CardHero />
      
      <ProductRead />
      {/* <aside className="aside form-container"> 
          <Gallery />
      </aside> */}
    </main>
  );
};

export default Vehiculo;