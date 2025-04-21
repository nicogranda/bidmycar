import React, { useState } from 'react';
import './Uploader.css';

const labels = {
  cover_view: 'Vista principal',
  front_view: 'Frontal',
  back_view: 'Trasera',
  left_view: 'Izquierda',
  right_view: 'Derecha',
};

function PhotoUploader({ photos, setPhotos }) {
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedPhotos = { ...photos, [type]: file };
    setPhotos(updatedPhotos);
  };

  return (
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
            accept="image/*"
            onChange={(e) => handleFileChange(e, type)}
            style={{ display: 'none' }}
          />
          {/* <input
  type="file"
  id={type}
  name={type}
  accept="image/*"
  onChange={(e) => handleFileChange(e, type)}
  style={{ display: 'none' }}
/> */}

        </div>
      ))}
    </div>
  );
}


export default PhotoUploader;
