import React, { useState, useRef } from "react";
import { getConfig } from "../../config/env";
// import { FFmpeg } from "@ffmpeg/ffmpeg";
// import useFFmpeg from "../../hooks/useFFmpeg"; // <--- IMPORT NECESARIO


export default function VideoUploader({ vehicleId, onChange }) {
  const [mode, setMode] = useState(""); // ningún modo activo al inicio
  const [videoURL, setVideoURL] = useState("");
  const [fileName, setFileName] = useState("");
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const { apiUrl } = getConfig();
  // const { ffmpeg, ready: ffmpegReady } = useFFmpeg();

  const handleModeChange = (e) => {
    const selectedMode = e.target.value;
    setMode(selectedMode);
    setVideoURL("");
    setFileName("");
    onChange({ video: "", mode: selectedMode });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!vehicleId || isNaN(vehicleId)) {
      alert("Error: vehicleId no está definido o es inválido");
      return;
    }
  
    if (!(file.type === "video/mp4" || file.type === "video/quicktime")) {
      alert("Solo se permiten archivos MP4 o MOV.");
      e.target.value = null;
      return;
    }
  
    setFileName(file.name);
    setCompressing(true); // opcional: mostrar spinner
  
    try {
      // Preparar FormData para enviar al servidor
      const formData = new FormData();
      formData.append("vehicle_id", Number(vehicleId));
      formData.append("video[]", file); // envío directo, sin comprimir
  
      const res = await fetch(`${apiUrl}/api/products/media.php`, {
        method: "POST",
        body: formData,
      });
  
      const text = await res.text();
      console.log("Respuesta raw del servidor:", text);
  
      try {
        const result = JSON.parse(text);
        console.log("JSON parseado:", result);
  
        if (result.status === "ok") {
          onChange({ video: file, mode }); // actualizar estado en React
        } else {
          alert(`Error en el servidor: ${result.message}`);
        }
      } catch (err) {
        console.error("No es JSON:", text);
        alert("Ocurrió un error al procesar la respuesta del servidor.");
      }
    } catch (err) {
      console.error("Error al subir el video:", err);
      alert("Ocurrió un error al subir el video.");
    } finally {
      setCompressing(false);
    }
  };
  

  const handleURLChange = async (e) => {
    const url = e.target.value;
    setVideoURL(url);
    onChange({ video: url, mode });

    if (!vehicleId || isNaN(vehicleId)) {
      alert("Error: vehicleId no está definido o es inválido");
      return;
    }

    if (url.trim() !== "") {
      const formData = new FormData();
      formData.append("vehicle_id", Number(vehicleId));
      formData.append("video_url", url);

      const res = await fetch(`${apiUrl}/api/products/media.php`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("Respuesta raw del servidor (URL):", text);
      try {
        const result = JSON.parse(text);
        console.log("JSON parseado:", result);
      } catch (err) {
        console.error("No es JSON:", text);
      }
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <p style={{ marginBottom: 10 }}>Selecciona cómo añadir el video:</p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: 20 }}>
        <label>
          <input
            type="radio"
            name="videoMode"
            value="upload"
            checked={mode === "upload"}
            onChange={handleModeChange}
          />
          Subir Video
        </label>
        <label>
          <input
            type="radio"
            name="videoMode"
            value="url"
            checked={mode === "url"}
            onChange={handleModeChange}
          />
          Poner URL (YouTube, Vimeo...)
        </label>
      </div>

      {mode === "upload" && (
        <div
          onClick={openFileSelector}
          style={{
            border: "2px dashed var(--color-primary)",
            padding: "40px",
            textAlign: "center",
            borderRadius: "6px",
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
        >
          <p style={{ margin: 0 }}>
            Haz clic o arrastra tu video aquí
          </p>
          <input
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>
      )}

      {compressing && <p>Comprimiendo video... ⏳</p>}

      {fileName && (
        <p
          style={{
            marginTop: "10px",
            fontSize: "12px",
            color: "var(--color-primary)",
          }}
        >
          {fileName}
        </p>
      )}

      {mode === "url" && (
        <input
          type="url"
          placeholder="https://youtube.com/..."
          value={videoURL}
          onChange={handleURLChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      )}
    </div>
  );
}
