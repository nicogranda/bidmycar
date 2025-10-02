import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConfig } from "../../../config/env";
import PhotoDropzone from "../photos/PhotoDropzone";
import VideoUploader from "../../../components/videos/Uploader";
import "./ProductMedia.css";

const categories = ["exterior", "interior", "motor", "video", "document"];

const ProductMedia = () => {
  const { apiUrl } = getConfig();
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicleId = id;

  const [formData, setFormData] = useState({ video: "", mode: "" });
  const [photos, setPhotos] = useState({ exterior: [], interior: [], motor: [], document: [] });
  const [activeCategory, setActiveCategory] = useState("exterior");
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showModal, setShowModal] = useState(false); // nuevo estado para modal

  // Cargar fotos y video existentes
  useEffect(() => {
    if (!vehicleId) return;
    fetch(`${apiUrl}/api/products/medias/read.php?vehicle_id=${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          const mapped = {};
          for (const cat of Object.keys(data.photos)) {
            mapped[cat] = data.photos[cat].map((item) => ({
              file: null,
              preview: `${apiUrl}${item.file_path}`,
              id: item.id,
              position: item.position,
            }));
          }
          setPhotos((prev) => ({ ...prev, ...mapped }));

          if (data.video) {
            setFormData({ video: data.video.file_path, mode: "url" });
          }
        }
      })
      .catch((err) => console.error("Error cargando medios:", err));
  }, [apiUrl, vehicleId]);

  const handleSetPhotos = (type) => (updater) => {
    setPhotos((prev) => ({
      ...prev,
      [type]: typeof updater === "function" ? updater(prev[type]) : updater,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicleId) return alert("Falta el ID del vehículo");

    const dataToSend = new FormData();
    for (const [type, files] of Object.entries(photos)) {
      files.forEach((fileItem) => {
        if (fileItem.file) dataToSend.append(`${type}[]`, fileItem.file);
      });
    }

    dataToSend.append("vehicle_id", vehicleId);
    dataToSend.append("video_url", formData.video);
    dataToSend.append("mode", formData.mode);

    try {
      const response = await fetch(`${apiUrl}/api/products/medias/upload.php`, {
        method: "POST",
        headers: { "X-Vehicle-Id": vehicleId },
        body: dataToSend,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      console.log("Respuesta del servidor:", result);

      if (result.status === "ok") {
        setUploadStatus({ counts: result.stats.counts, completo: result.stats.completo });

        // Mostrar modal si la subida está completa
        if (result.stats.completo) {
          setShowModal(true);
        }
      } else {
        alert("Error al subir: " + (result.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("Fallo al subir:", err);
      alert("Error de red o del servidor");
    }
  };

  // Funciones para manejar el modal
  const handleModalConfirm = () => {
    setShowModal(false);
    navigate(`/vehiculo/${vehicleId}/pago/banner`);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    navigate(`/`); // HomePage
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="photo-upload-form">
        <nav className="photo-nav">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`photo-nav-btn ${activeCategory === cat ? "active" : ""}`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>

        {activeCategory === "video" ? (
          <section style={{ marginTop: "40px" }}>
            <h2>Sube o añade un video</h2>
            <VideoUploader
              vehicleId={vehicleId}
              video={formData.video}
              mode={formData.mode}
              onChange={({ video, mode }) =>
                setFormData((prev) => ({ ...prev, video: video ?? prev.video, mode: mode ?? prev.mode }))
              }
            />
          </section>
        ) : (
          <PhotoDropzone label={activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} photos={photos[activeCategory]} setPhotos={handleSetPhotos(activeCategory)} />
        )}

        <button type="submit" className="upload-btn">
          Subir archivos
        </button>
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
          {!uploadStatus.completo && <p>⚡ Faltan archivos para mostrarlo en el portfolio</p>}
        </div>
      )}

      {/* Modal */}
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

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          text-align: center;
        }
        .modal-actions {
          margin-top: 1.5rem;
          display: flex;
          justify-content: space-around;
        }
        .modal-actions button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-actions button:first-child {
          background: var(--color-primary);
          color: white;
        }
        .modal-actions button:last-child {
          background: #ccc;
        }
      `}</style>
    </div>
  );
};

export default ProductMedia;
