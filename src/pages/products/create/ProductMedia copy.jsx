// src/components/product/ProductMedia.jsx
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

import "./ProductMedia.css";

const categoryIcons = {
  exterior: ExteriorIcon,
  interior: InteriorIcon,
  motor: MotorIcon,
  video: VideoIcon,
  document: DocumentIcon,
};

const categories = ["exterior", "interior", "motor", "video", "document"];

// -----------------------------
// Componente que maneja fotos y videos
// -----------------------------
const ProductMediaContent = ({ vehicleId }) => {
  const { apiUrl } = getConfig();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ video: "", mode: "" });
  const [photos, setPhotos] = useState({ exterior: [], interior: [], motor: [], document: [] });
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Cargar fotos y video existentes
  useEffect(() => {
    if (!vehicleId) return;
  
    const fetchMedia = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/products/medias/read.php?vehicle_id=${vehicleId}`
        );
  
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
        const data = await res.json();
  
        if (data.status !== "ok") return;
  
        // 🔥 Normalizar fotos por categoría
        const mapped = {
          exterior: [],
          interior: [],
          motor: [],
          document: [],
        };
  
        if (data.photos && typeof data.photos === "object") {
          for (const [cat, items] of Object.entries(data.photos)) {
            if (!Array.isArray(items)) continue;
  
            mapped[cat] = items.map((item) => ({
              id: item.id,
              preview: `${apiUrl}${item.file_path}`, // 👈 SIEMPRE preview
              file: null,
              isNew: false,
              position: item.position || 0,
            }));
          }
        }
  
        // 🔥 Merge seguro con estado previo
        setPhotos((prev) => ({
          ...prev,
          ...mapped,
        }));
  
        // 🎥 Video
        if (data.video && data.video.file_path) {
          setFormData((prev) => ({
            ...prev,
            video: `${apiUrl}${data.video.file_path}`,
            mode: "url",
          }));
        }
      } catch (err) {
        console.error("❌ Error cargando medios:", err);
      }
    };
  
    fetchMedia();
  }, [apiUrl, vehicleId]);

  const handleSetPhotos = (type) => (updater) => {
    setPhotos(prev => ({
      ...prev,
      [type]: typeof updater === "function" ? updater(prev[type]) : updater,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleId) {
        alert("Falta el ID del vehículo");
        return;
    }

    const dataToSend = new FormData();

    // Adjuntar fotos por categoría
    for (const [type, files] of Object.entries(photos)) {
        files.forEach(fileItem => {
            if (fileItem.file) dataToSend.append(`${type}[]`, fileItem.file);
        });
    }

    // Asegurarse de pasar vehicle_id en FormData
    dataToSend.append("vehicle_id", vehicleId);

    // Video
    dataToSend.append("video_url", formData.video);
    dataToSend.append("mode", formData.mode);

    setIsUploading(true);

    try {
        const response = await fetch(`${apiUrl}/api/products/medias/upload.php`, {
            method: "POST",
            // NO usar headers personalizados con FormData
            body: dataToSend,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();
        console.log("Respuesta del servidor:", result);

        if (result.status === "ok") {
            setUploadStatus({ counts: result.stats.counts, completo: result.stats.completo });
            if (result.stats.completo) setShowModal(true);
        } else {
            alert("Error al subir: " + (result.message || "Error desconocido"));
        }
    } catch (err) {
        console.error("Fallo al subir:", err);
        alert("Error de red o del servidor");
    } finally {
        setIsUploading(false);
    }
};


  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(`/vehiculo/${vehicleId}/pago/banner`);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    navigate(`/`);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="photo-upload-form form-container">
        <nav className="photo-nav">
          {categories.map(cat => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`photo-nav-btn ${activeCategory === cat ? "active" : ""}`}
              >
                <Icon className="category-icon" />
                <span className="category-label">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              </button>
            );
          })}
        </nav>

        {activeCategory === "video" ? (
          <section style={{ marginTop: "40px" }}>
            <h2>Sube o añade un video</h2>
            <VideoUploader
              vehicleId={vehicleId}
              video={formData.video}
              mode={formData.mode}
              onChange={({ video, mode }) =>
                setFormData(prev => ({ ...prev, video: video ?? prev.video, mode: mode ?? prev.mode }))
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

        <button type="submit" className="upload-btn">Subir archivos</button>
        <LoadingOverlay visible={isUploading} />
      </form>

      {/* {uploadStatus && (
        <div className="upload-summary-card">
          <h3>Progreso</h3>
          <ul>
            {Object.entries(uploadStatus.counts).map(([cat, num]) => (
              <li key={cat}>{cat}: {num}</li>
            ))}
          </ul>
          {!uploadStatus.completo && <p>⚡ Faltan archivos para mostrarlo en el portfolio</p>}
        </div>
      )} */}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>¡Tu vehículo ya está listo para el portfolio!</h3>
            <p>¿Quieres destacarlo en el banner de la página?</p>
            <div className="modal-actions">
              <button onClick={handleModalConfirm}>Sí, destacarlo</button>
              <button onClick={handleModalCancel}>No, gracias</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------
// Componente principal envuelto en RequireOwner
// -----------------------------
const ProductMedia = ({ vehicle_id }) => {
  return (
   
      <ProductMediaContent vehicleId={vehicle_id} />
  
  );
};

export default ProductMedia;
