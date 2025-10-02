import React, { useState, useRef } from "react";
import { getConfig } from '../../config/env';  // Importar config

export default function VideoUploader({ vehicleId, onChange }) {
  const [mode, setMode] = useState("upload");
  const [videoURL, setVideoURL] = useState("");
  const [fileName, setFileName] = useState(""); // 👈 nuevo estado para mostrar el nombre
  const fileInputRef = useRef(null);

  const { apiUrl } = getConfig(); // Obtener URL de API según entorno

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    setVideoURL("");
    setFileName(""); // 👈 limpiar el nombre si se cambia de modo
    onChange({ video: "", mode: selectedMode }); // 👈 Enviar ambos
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
  
    if (file && (file.type === "video/mp4" || file.type === "video/quicktime")) {
      if (!vehicleId) {
        alert("Error: vehicleId no proporcionado");
        setFileName("");
        onChange({ video: null, mode });
        return;
      }
  
      const formData = new FormData();
      formData.append("video", file);
      formData.append("vehicle_id", vehicleId);
  
      try {
        const res = await fetch(`${apiUrl}/api/products/upload_video.php`, {
          method: "POST",
          body: formData,
        });
  
        const result = await res.json();
  
        if (res.ok && result.status === "success") {
          const videoUrl = `${apiUrl}/public/${vehicleId}/videos/${encodeURIComponent(file.name)}`;
          setFileName(file.name);
          onChange({ video: videoUrl, mode });
        } else {
          alert("Error al subir el video: " + result.message);
          setFileName("");
          onChange({ video: null, mode });
        }
      } catch (error) {
        console.error("Error al subir:", error);
        alert("Fallo en la subida del video.");
        setFileName("");
        onChange({ video: null, mode });
      }
    } else {
      alert("Solo MP4 o MOV, por favor.");
      e.target.value = null;
      setFileName("");
      onChange({ video: null, mode });
    }
  };
    
  const handleURLChange = (e) => {
    setVideoURL(e.target.value);
    setFileName(""); // 👈 no mostrar nombre si es por URL
    onChange({ video: e.target.value, mode });
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      {/* <h2>Sube o pon la URL de tu video (MP4 o MOV)</h2> */}

      <label>
        {/* <input
          type="radio"
          name="mode"
          value="upload"
          checked={mode === "upload"}
          onChange={handleModeChange}
        /> */}
        Cargar / Tomar video
      </label>

      <div style={{ marginTop: 20 }}>
        {mode === "upload" && (
          <>
            <button type="button" onClick={openFileSelector}>
              Seleccionar video
            </button>
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />

            {fileName && (
              <div style={{ 
                color: "var(--color-primary)", 
                fontSize: "10px", 
                marginTop: "4px" 
              }}>
                {fileName}
              </div>
            )}
          </>
        )}
      </div>

      {/* <br /> */}

      {/* <label>
        <input
          type="radio"
          name="mode"
          value="url"
          checked={mode === "url"}
          onChange={handleModeChange}
        />
        Poner URL del video
      </label> */}

     {/* <div style={{ marginTop: 20 }}>
        {mode === "url" && (
          <input
            type="url"
            placeholder="https://example.com/video.mp4"
            value={videoURL}
            onChange={handleURLChange}
            style={{ width: "100%", padding: "8px" }}
          />
        )} 
      </div> */}
    </div>
  );
}
