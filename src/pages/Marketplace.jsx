import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getConfig } from '../config/env';
import LocationLookup from '../components/ui/LocationLookup';
import RemainingDays from './auctions/components/RemainingDays';
import TopBid from './auctions/components/TopBid';
import './Marketplace.css';

const Marketplace = () => {
  const { apiUrl } = getConfig();
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  // const navigate = useNavigate();

  // Carga el user_id desde localStorage
  useEffect(() => {
    setUserId(localStorage.getItem('user_id'));
  }, []);

  // Fetch de productos cada vez que cambie location.search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${apiUrl}/index.php?page=product&action=index${location.search.replace('?', '&')}`;

        console.log('🔍 Fetching:', url);

        const res = await fetch(url, { credentials: 'include' });
        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.records)) {
          setProducts(data.records);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [apiUrl, location.search]);

  if (!products.length) {
    return <p>No hay vehículos disponibles.</p>;
  }

  return (
    <div className="gallery">
      <div className="products">
        {products
          .filter(product => product.main_image || product.images?.[0])
          .map(product => {
            const now = new Date();
            const start = new Date(product.updated_at);
            const deadline = new Date(start);
            deadline.setDate(deadline.getDate() + 8);
            const diffSec = (deadline - now) / 1000;
            const daysLeft = diffSec / (60 * 60 * 24);

            let statusClass = '';
            if (diffSec <= 0) statusClass = 'finished';
            else if (daysLeft < 1) statusClass = 'urgent';

            return (
              <div key={product.id} className="card">
                <Link
                  to={`/vehiculo/${product.id}`}
                  state={{ user_id: userId, vehicle: product }}
                  className="card-link"
                >
                  <div className="image-container">
                    <img
                      src={`${apiUrl}${product.main_image || product.images[0]}`}
                      alt={`${product.brand} ${product.model}`}
                      className="shadow-basic"
                    />

                    <div className={`poster ${product.for_sale === 0 ? "exhibition-only" : ""}`}>
                      <div className={`image-text ${statusClass}`}>
                      <RemainingDays publishedAt={product.published_at} />
                        <TopBid vehicleId={product.id} />
                      </div>
                      {/* {product.for_sale == 0 && <span className="square"></span>} */}
                      {product.highlight == 1 && <span className="highlight-star">⭐</span>}
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

export default Marketplace;
