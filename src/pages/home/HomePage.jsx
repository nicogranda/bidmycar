import React, { useState } from 'react';
import HomeHero from './HomeHero';
import Portfolio from '../portfolio/Portfolio';
import Filter from '../../components/Layout/Filter';
import './HomePage.css'; // Importa tu CSS

function HomePage() {
  const [filter, setFilter] = useState({ year: '', transmission: '', body_style: '' });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <>
    <HomeHero />
      
      <div className="mobile-stack">
        <div className="filter-wrapper">
          <Filter onFilterChange={handleFilterChange} />
        </div>
      </div>
      {/* <Filter onFilterChange={handleFilterChange} /> */}
      <Portfolio filter={filter} />

    </>
  );
}

export default HomePage;
