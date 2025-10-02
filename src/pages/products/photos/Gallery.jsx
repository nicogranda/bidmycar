import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConfig } from '../../../config/env';

const categories = ['exterior', 'interior', 'motor'];

const VehicleGallery = () => {
  const { id } = useParams();
  const { apiUrl } = getConfig();

  const [photos, setPhotos] = useState({
    exterior: [],
    interior: [],
    motor: [],
  });

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products/gallery.php?id=${id}`);
        const data = await response.json();
        console.log('datas', data)
        console.log('id', id)
      

        if (data.status === 'ok') {
          setPhotos(data.photos);
        } else {
          console.error('Error al obtener las fotos:', data.message);
        }
      } catch (error) {
        console.error('Error al cargar la galería:', error);
      }
    };

    fetchPhotos();
  }, [apiUrl, id]);

  return (
    <div className="vehicle-gallery" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
      {categories.flatMap((cat) =>
        photos[cat]?.map((photo, index) => (
          <img
            key={`${cat}-${index}`}
            src={`${apiUrl}/public/${id}/images/${cat}/${photo}`}
            alt={`foto ${index}`}
            style={{
              width: '150px',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          />
        ))
      )}
    
    </div>
  );
};

export default VehicleGallery;
