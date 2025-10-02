import React, { useState, useEffect } from 'react';
import { getConfig } from '../../config/env';

import './ImageViewer.css';

const CATEGORIES = ['all', 'exterior', 'interior', 'mechanical', 'documents', 'others'];
const CATEGORY_LABELS = {
  all: 'Todo',
  exterior: 'Exterior',
  interior: 'Interior',
  mechanical: 'Mecánica',
  documents: 'Documentos',
  others: 'Otros'
};
const ImageViewer = ({
  vehicleId,
  initialCategory = 'all',
  initialIndex = 0,
  initialImage = '',
  title
}) => {

  const [images, setImages] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [viewMode, setViewMode] = useState('gallery');
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const { apiUrl } = getConfig();

  useEffect(() => {
    setCategory(initialCategory);
    setCurrentIndex(initialIndex);
  }, [initialCategory, initialIndex]);

  useEffect(() => {
    fetchImages(category);
  }, [category]);

  const fetchImages = (cat) => {
    fetch(`${apiUrl}/api/products/visor.php?vehicle_id=${vehicleId}&category=${cat}`)
      .then(res => res.json())
      .then(data => {
        // 👇 Me aseguro de que "images" sea un array
        const imgs = Array.isArray(data) 
          ? data 
          : Array.isArray(data.images) 
            ? data.images 
            : [];
  
        setImages(imgs);
  
        if (pendingImageUrl) {
          const foundIndex = imgs.findIndex(img => img.url === pendingImageUrl);
          if (foundIndex >= 0) {
            setCurrentIndex(foundIndex);
            setViewMode('viewer');
          }
          setPendingImageUrl(null);
          return;
        }
  
        if (initialImage) {
          const foundIndex = imgs.findIndex(img => img.url.includes(initialImage));
          setCurrentIndex(foundIndex >= 0 ? foundIndex : 0);
          setViewMode('viewer');
        } else {
          setCurrentIndex(0);
          setViewMode(cat === 'all' ? 'gallery' : 'viewer');
        }
      })
      .catch(err => console.error('❌ Error al cargar imágenes:', err));
  };
  
  const handleClick = (index) => {
    const clickedImage = images[index];

    if (category !== 'all') {
      setCurrentIndex(index);
      setViewMode('viewer');
      return;
    }

    setPendingImageUrl(clickedImage.url);
    setCategory(clickedImage.category);
  };

  const navigate = (direction) => {
    const next = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(next);
  };

  return (
    <section className="modalImages">
      <div className="image-viewer-header">
        <h1>{title}</h1>
      </div>

      <article className="menuSlider">
        {CATEGORIES.map(cat => (
          <a
            key={cat}
            href="#"
            onClick={e => {
              e.preventDefault();
              setCategory(cat);
            }}
            className={category === cat ? 'active' : ''}
          >
            {CATEGORY_LABELS[cat] || cat}
          </a>
        ))}
      </article>

      {images.length === 0 ? (
        <div className="noImages">
          <p>No hay fotos desde esta vista</p>
        </div>
      ) : category === 'all' || viewMode === 'gallery' ? (
        <div className="galleryModal">
          {images.map((img, i) => (
            <img
              key={i}
              src={`${apiUrl}${img.url}`}
              alt={`Imagen - ${img.category}`}
              className="galleryImage"
              onClick={() => handleClick(i)}
            />
          ))}
        </div>
      ) : (
        <div className="viewer">
          <button onClick={() => navigate(-1)}>&#8592;</button>
          <img
            src={`${apiUrl}${images[currentIndex]?.url}`}
            alt={`Imagen - ${images[currentIndex]?.category}`}
          />
          <button onClick={() => navigate(1)}>&#8594;</button>
        </div>
      )}
    </section>
  );
};

export default ImageViewer;
