import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from '../../config/env';
import LocationLookup from '../../components/LocationLookup';
import RemainingDays from '../auctions/components/RemainingDays';
import TopBid from '../auctions/components/TopBid';
import './Portfolio.css';

const Portfolio = ({ filter = {} }) => {
  const { apiUrl } = getConfig();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams(filter).toString();
        const res = await fetch(`${apiUrl}/api/products/read.php?${queryParams}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [apiUrl, filter]);

  if (!products.length) {
    return <p>No hay vehículos disponibles.</p>;
  }

  return (
    <div className="gallery">
      <div className="products">
        {products
          .filter(product => product.main_image || product.images?.[0]?.file_path)
          .map(product => {
            const now = new Date();
            const start = new Date(product.updated_at);
            const deadline = new Date(start);
            deadline.setDate(deadline.getDate() + 8);
            const diffMs = deadline - now;
            const diffSec = Math.floor(diffMs / 1000);
            const daysLeft = diffSec / (60 * 60 * 24);

            let statusClass = "";
            if (diffSec <= 0) statusClass = "finished";
            else if (daysLeft < 1) statusClass = "urgent";

            return (
              <div key={product.id} className="card">
                <Link
                  to={`/vehiculo/${product.id}`}
                  state={{ user_id: userId, vehicle: product }}
                  className="card-link"
                >
          <div className="image-container">
  <img
    src={`${apiUrl}${product.main_image || product.images[0].file_path}`}
    alt={`${product.brand} ${product.model}`}
    className="shadow-basic"
  />

  <div className="poster">
    <div className={`image-text ${statusClass}`}>
      <RemainingDays updatedAt={product.updated_at} />
      <TopBid vehicleId={product.id} />
    </div>
    {product.highlight === "1" || product.highlight === 1 ? (
      <span className="highlight-star">⭐</span>
    ) : null}
  </div>
</div>

                  <div className="card-text">
                    <p className="card-text-title">
                      {product.year} {product.brand} {product.model}
                    </p>
                    <p className="card-text-container">
                      {product.model} {product.transmission}
                    </p>
                    <p className="card-text-container">
                      {product.mileage} km {product.modified}
                    </p>
                    <p className="card-text-container spot">
                      {product.zip_code} <LocationLookup zipCode={product.zip_code} />
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Portfolio;
