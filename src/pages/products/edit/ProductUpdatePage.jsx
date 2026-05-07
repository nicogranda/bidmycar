// src/pages/products/edit/ProductUpdatePage.jsx
import React, { useState } from 'react';
import ProductUpdateForm from './ProductUpdateForm';
import ProductHistoryUpdate from './ProductHistoryUpdate';
import ProductMediaUpdate from './ProductMediaUpdate';
import './ProductUpdate.css';
import AuthGuard from '../../../components/auth/AuthGuard';

const ProductUpdatePage = ({ user, vehicle }) => {
  const [activeTab, setActiveTab] = useState('data');

  if (!vehicle) return <p>No se encontró el vehículo.</p>;

  return (
    <AuthGuard allowAdmin={true}>
      <main>
        <div className="product-tabs-view">
          <div className="tabs-header">
            <button
              className={activeTab === 'data' ? 'active' : ''}
              onClick={() => setActiveTab('data')}
            >
              Datos{activeTab === 'data' ? '*' : ''}
            </button>
            <button
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              Histórico{activeTab === 'history' ? '*' : ''}
            </button>
            <button
              className={activeTab === 'media' ? 'active' : ''}
              onClick={() => setActiveTab('media')}
            >
              Multimedia{activeTab === 'media' ? '*' : ''}
            </button>
          </div>

          <div className="tabs-body">
            {activeTab === 'data' && <ProductUpdateForm vehicle={vehicle} />}
            {activeTab === 'history' && <ProductHistoryUpdate vehicle={vehicle} />}
            {activeTab === 'media' && <ProductMediaUpdate vehicle={vehicle} />}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
};

export default ProductUpdatePage;
