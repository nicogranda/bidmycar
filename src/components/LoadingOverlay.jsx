import React from "react";
import SpeedometerLoader from "./SpeedometerLoader"; // Asegúrate de la ruta correcta
import "./LoadingOverlay.css";

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <SpeedometerLoader label="Subiendo archivos, por favor espera..." />
      </div>
    </div>
  );
};

export default LoadingOverlay;
