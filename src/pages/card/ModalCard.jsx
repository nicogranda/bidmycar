import React from 'react';
import './ModalCard.css'; // Asegúrate de importar los estilos

const ModalCard = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal-card-overlay" onClick={onClose}>
      <div className="modal-card-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-card-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default ModalCard;
