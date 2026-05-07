// src/pages/products/edit/ProductMedia.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from "../../../config/env";
import PhotoDropzone from "../photos/PhotoDropzone";
import VideoUploader from "../../../components/videos/Uploader";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { ReactComponent as ExteriorIcon } from '../../../assets/icons/media/exterior.svg';
import { ReactComponent as InteriorIcon } from '../../../assets/icons/media/interior.svg';
import { ReactComponent as MotorIcon } from '../../../assets/icons/media/motor.svg';
import { ReactComponent as VideoIcon } from '../../../assets/icons/media/video.svg';
import { ReactComponent as DocumentIcon } from '../../../assets/icons/media/document.svg';

import "../create/ProductMedia.css";

const categoryIcons = {
  exterior: ExteriorIcon,
  interior: InteriorIcon,
  motor: MotorIcon,
  video: VideoIcon,
  document: DocumentIcon,
};

const categories = ["exterior", "interior", "motor", "video", "document"];

const ProductMedia = ({ vehicle }) => {
  const { apiUrl } = getConfig();
  const navigate = useNavigate();

  const vehicleId = vehicle?.id;

  const [photos, setPhotos] = useState({
    exterior: [],
    interior: [],
    motor: [],
    document: [],
  });

  const [formData, setFormData] = useState({ video: "", mode: "" });
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ==========================
  // Inicializar desde vehicle.media
  // ==========================
  useEffect(() => {
    if (!vehicle?.media) return;
  
    console.log("🚀 vehicle.media recibido:", vehicle.media);
    console.log("🌐 apiUrl:", apiUrl);
  
    const mappedPhotos = {};

    ["exterior", "interior", "motor", "document"].forEach((cat) => {
      mappedPhotos[cat] = (vehicle.media[cat] || []).map((item, i) => {
        // ❌ item.file_path no existe porque item es un string
        const filePath = item; // simplemente usamos el string recibido

        return {
          id: i, // puedes usar el índice si no hay ID
          file: null,
          position: i,
          preview: `${apiUrl}${filePath}`,
        };
      });
    });
  
    console.log("🖼️ mappedPhotos procesadas:", mappedPhotos);
  
    setPhotos((prev) => ({ ...prev, ...mappedPhotos }));
  
    if (vehicle.media.video?.length) {
      const videoPath = vehicle.media.video[0].file_path || vehicle.media.video[0].path;
      setFormData({
        video: videoPath,
        mode: "url",
      });
      console.log("🎞️ Video inicial:", videoPath);
    }
  }, [vehicle, apiUrl]);
  
  
  const handleSetPhotos = (type) => (updater) => {
    setPhotos((prev) => ({
      ...prev,
      [type]: typeof updater === "function" ? updater(prev[type]) : updater,
    }));
  };

  // ==========================
  // SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId) return;

    const data = new FormData();

    Object.entries(photos).forEach(([cat, items]) => {
      items.forEach((item) => {
        if (item.file) {
          data.append(`${cat}[]`, item.file);
        }
      });
    });

    data.append("vehicle_id", vehicleId);
    data.append("video_url", formData.video);
    data.append("mode", formData.mode);

    setIsUploading(true);

    try {
      const res = await fetch(`${apiUrl}/api/products/medias/upload.php`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.status === "ok") {
        setUploadStatus(result.stats);
        if (result.stats.completo) setShowModal(true);
      } else {
        alert(result.message || "Error al subir archivos");
      }
    } catch (err) {
      console.error("Error subiendo media:", err);
      alert("Error de red o servidor");
    } finally {
      setIsUploading(false);
    }
  };

  if (!vehicleId) return null;

  return (
    <div>
      <form onSubmit={handleSubmit} className="photo-upload-form form-container">
        <nav className="photo-nav">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`photo-nav-btn ${activeCategory === cat ? "active" : ""}`}
              >
                <Icon className="category-icon" />
                <span className="category-label">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </span>
              </button>
            );
          })}
        </nav>

        {activeCategory === "video" ? (
          <section style={{ marginTop: 40 }}>
            <h2>Video del vehículo</h2>
            <VideoUploader
              vehicleId={vehicleId}
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
            label={activeCategory}
            photos={photos[activeCategory]}
            setPhotos={handleSetPhotos(activeCategory)}
          />
        )}

        <button type="submit" className="upload-btn">
          Subir archivos
        </button>

        <LoadingOverlay visible={isUploading} />
      </form>

      {uploadStatus && (
        <div className="upload-summary-card">
          <h3>Progreso</h3>
          <ul>
            {Object.entries(uploadStatus.counts).map(([cat, num]) => (
              <li key={cat}>
                {cat}: {num}
              </li>
            ))}
          </ul>
          {!uploadStatus.completo && (
            <p>Faltan archivos para completar el portfolio</p>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Vehículo listo para el portfolio</h3>
            <p>¿Deseas destacarlo en el banner?</p>
            <div className="modal-actions">
              <button onClick={() => navigate(`/vehiculo/${vehicleId}/pago/banner`)}>
                Sí
              </button>
              <button onClick={() => navigate("/")}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMedia;
