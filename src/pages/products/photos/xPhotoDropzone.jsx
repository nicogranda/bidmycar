// src/components/PhotoDropzoneSimple.jsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { getConfig } from '../../../config/env';
import "./PhotoDropzone.css";

const { uploadUrl } = getConfig();

const PhotoDropzoneSimple = ({ label }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extrae vehicleId de la URL actual
  const getVehicleId = () => {
    const match = window.location.pathname.match(/\/vehiculo\/editar\/(\d+)/);
    return match ? match[1] : null;
  };

  const onDrop = async (acceptedFiles) => {
    const vehicleId = getVehicleId();
    if (!vehicleId) {
      alert("No se pudo obtener vehicleId de la URL.");
      return;
    }

    if (acceptedFiles.length + photos.length > 10) {
      alert("Máximo 10 fotos permitidas.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("vehicleId", vehicleId);
    acceptedFiles.forEach(f => formData.append('files[]', f));

    try {
      const res = await fetch(uploadUrl, { method: 'POST', body: formData });
      const data = await res.json();
      console.log("Respuesta del servidor:", data);

      if (data.success && data.files) {
        // Guardamos las URLs devueltas por el backend
        setPhotos(prev => [
          ...prev,
          ...data.files.map(f => ({ name: f.name, url: f.url }))
        ]);
      } else {
        console.error("Errores al subir:", data.errors);
      }

    } catch (err) {
      console.error("Error subiendo archivos:", err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: { "image/*": [] }
  });

  return (
    <section className="photo-dropzone">
      <h2>{label}</h2>

      {loading && <p>Subiendo imágenes...</p>}

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Arrastra imágenes o haz clic para seleccionar</p>
      </div>

      <div className="previews" style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {photos.map(photo => (
          <div key={photo.name} className="preview" style={{ width: "150px" }}>
            <img src={photo.url} alt={photo.name} style={{ width: "100%", borderRadius: "4px" }} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoDropzoneSimple;