import React, { useState } from 'react';
import PhotoInstructionsModal from './InstructionsModal';
import CropperModal from './CropperModal';
import './Uploader.css';

export const labels = {
  cover_view: 'Vista principal',
  front_view: 'Frontal',
  back_view: 'Trasera',
  left_view: 'Lado del Conductor',
  right_view: 'Lado del Copiloto',
};

function PhotoUploader({ photos, setPhotos, errors }) {
  const [showModal, setShowModal] = useState(false);
  const [cropModal, setCropModal] = useState({ open: false, type: null, src: null });
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLastScrollPosition(window.scrollY); // Guarda la posición actual del scroll

      setCropModal({ open: true, type, src: event.target.result });
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile) => {
    const updatedPhotos = { ...photos, [cropModal.type]: croppedFile };
    setPhotos(updatedPhotos);
    setCropModal({ open: false, type: null, src: null });
  }; 

  return (
    <>
      <div>
        <div className="form-group">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowModal(true);
            }}
            className="photos-instructions-label"
          >
            Instrucciones para fotos
          </a>
        </div>

        <PhotoInstructionsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>

      <div className="photo-uploader-group">
        {Object.entries(labels).map(([type, label]) => (
          <div key={type} className="photo-upload-button">
            <label htmlFor={type}>
              {photos?.[type] ? (
                <img
                  src={URL.createObjectURL(photos[type])}
                  alt={label}
                  className="preview-image"
                />
              ) : (
                <span>{label}</span>
              )}
            </label>
            <input
              type="file"
              id={type}
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleFileChange(e, type)}
              style={{ display: 'none' }}
            />
            {errors?.[type] && (
              <div
                className="error-message"
                style={{ backgroundColor: 'white', fontWeight: 'bold' }}
              >
                {errors[type]}
              </div>
            )}
          </div>
        ))}
      </div>

      {cropModal.open && (
        <CropperModal
          imageSrc={cropModal.src}
          onCropComplete={handleCropComplete}
          onClose={() => setCropModal({ open: false, type: null, src: null })}
          fileName={cropModal.type}
        />
      )}
    </>
  );
}

export default PhotoUploader;

// Función para validar que todas las fotos estén cargadas
export const validatePhotos = (photos, setPhotoErrors) => {
  const requiredTypes = Object.keys(labels);
  const errors = {};

  requiredTypes.forEach((type) => {
    if (!photos[type]) {
      errors[type] = 'Esta foto es obligatoria';
    }
  });

  setPhotoErrors(errors);

  return Object.keys(errors).length === 0;
};
