import React from 'react';
import './InstructionsModal.css';

const PhotoInstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
      <a href="" className="close-button-modal" onClick={(e) => {
        e.preventDefault(); // <--- ¡esto evita el reload!
        onClose();
      }}>×</a>

        <h2>¿Cómo deben ser tus fotos?</h2>
        <ul>
          <li>Horizontales 16:9</li>
          <li>Archivos: JPG, PNG</li>
          <li>Producto centrado y visible</li>
          <li>Que no sea contraluz</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoInstructionsModal;
