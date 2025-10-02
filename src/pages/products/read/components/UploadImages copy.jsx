import React, { useState } from 'react';
import PhotoDropzone from '../photos/PhotoDropzone';
// import { useParams } from 'react-router-dom';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import VideoUploader from '../../../components/videos/Uploader';
import { getConfig } from '../../../config/env';
import './UploadImages.css';

const categories = ['exterior', 'interior', 'motor', 'video'];
const resizeImageTo4by3 = (file, maxWidth = 1024) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const aspectRatio = 4 / 3;
      const width = maxWidth;
      const height = Math.round(width / aspectRatio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; // opcional: fondo blanco
      ctx.fillRect(0, 0, width, height);

      // Ajustar para cubrir el canvas manteniendo aspecto
      const ratio = Math.min(img.width / width, img.height / height);
      const newWidth = width * ratio;
      const newHeight = height * ratio;
      const offsetX = (img.width - newWidth) / 2;
      const offsetY = (img.height - newHeight) / 2;

      ctx.drawImage(
        img,
        offsetX, offsetY, newWidth, newHeight,
        0, 0, width, height
      );

      canvas.toBlob((blob) => {
        const newFile = new File([blob], file.name, { type: 'image/jpeg' });
        resolve(newFile);
      }, 'image/jpeg', 0.8); // calidad 80%
    };

    img.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const UploadImages = () => {
  const { apiUrl } = getConfig();
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicleId = id;

  const [formData, setFormData] = useState({
    vehicle_id: vehicleId || '',
    video: '',
    mode: ''
  });
  


  const [photos, setPhotos] = useState({
    exterior: [],
    interior: [],
    motor: []
  });

  // Estado para categoría activa
  const [activeCategory, setActiveCategory] = useState('exterior');

  const handleSetPhotos = (type) => (newFiles) => {
    const filesArray = Array.isArray(newFiles) ? newFiles : [newFiles];
    setPhotos((prev) => ({
      ...prev,
      [type]: [...prev[type], ...filesArray].slice(0, 6),
      // [type]: [...prev[type], ...filesArray],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!vehicleId) {
      alert('Falta el ID del vehículo');
      return;
    }
  
    const dataToSend = new FormData();
  
    // Fotos (las dejamos tal como están ahora, con resize o sin él)
    for (const [type, files] of Object.entries(photos)) {
      for (const file of files) {
        dataToSend.append(`${type}[]`, file);
      }
    }
  
    // Campos adicionales
    dataToSend.append('vehicle_id', vehicleId);
    dataToSend.append('video_url', formData.video);
    dataToSend.append('mode', formData.mode);
  
    // Aquí el console.log para mostrar lo que envías
    console.log('Datos enviados al endpoint:');
    for (const pair of dataToSend.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }
  
    try {
      const response = await fetch(`${apiUrl}/api/products/upload.php`, {
        method: 'POST',
        headers: {
          'X-Vehicle-Id': vehicleId,
        },
        body: dataToSend
      });
  
      const resultText = await response.text();
      console.log('Texto recibido:', resultText);
  
      const result = JSON.parse(resultText);
  
      if (result.status === 'ok') {
        navigate(`/`);
      } else {
        alert('Error al subir: ' + (result.message || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Fallo al subir:', err);
      alert('Error de red o del servidor');
    }
  };  
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="photo-upload-form">
        {/* Navegación de categorías */}
        <nav className="photo-nav" style={{ marginBottom: '1rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                marginRight: '0.5rem',
                cursor: 'pointer',
                backgroundColor:
                  activeCategory === cat
                    ? 'var(--color-primary)'
                    : 'var(--color-secondary)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>
  
        {/* Mostrar Dropzone o Uploader según categoría */}
        {activeCategory === 'video' ? (
          <section style={{ marginTop: '40px' }}>
            <h2>Sube o añade un video</h2>
            <VideoUploader
              vehicleId={formData.vehicle_id}
              video={formData.video}
              mode={formData.mode}
              onChange={({ video, mode }) =>
                setFormData((prev) => ({
                  ...prev,
                  video: video ?? prev.video,
                  mode: mode ?? prev.mode,
                }))
              }
            />
          </section>
        ) : (
          <PhotoDropzone
            label={activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
            photos={photos[activeCategory]}
            setPhotos={handleSetPhotos(activeCategory)}
          />
        )}
  
        <button
          type="submit"
          className="upload-btn"
          style={{ marginTop: '1rem' }}
        >
          Subir archivos
        </button>
      </form>
    </div>
  );
  
};

export default UploadImages;
