import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";
import libheif from "libheif-js/wasm-bundle";


import {
  DndContext, closestCenter, useSensor, useSensors, PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./PhotoDropzone.css";

const SortablePhoto = ({ photo, removePhoto }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.id ?? photo.tempId });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, position: "relative" }} {...attributes}>
      <img src={photo.preview} alt={photo.file?.name || "Imagen"}
        style={{ width: 150, borderRadius: 4, cursor: "grab" }}
        loading="lazy" decoding="async" {...listeners} />
      <button type="button" className="remove-photo-btn"
        onClick={(e) => { e.stopPropagation(); removePhoto(photo.id ?? photo.tempId); }}>
        ×
      </button>
    </div>
  );
};

// Y la función de conversión:
const convertHeicWithLibheif = async (file) => {
  const buffer  = await file.arrayBuffer();
  const decoder = new libheif.HeifDecoder();       // ← new libheif.HeifDecoder()
  const data    = decoder.decode(buffer);           // ← buffer directo, no Uint8Array

  if (!data?.length) throw new Error("Sin frames");

  const image  = data[0];
  const width  = image.get_width();
  const height = image.get_height();

  const pixelData = await new Promise((resolve, reject) =>
    image.display(
      { data: new Uint8ClampedArray(width * height * 4), width, height },
      (r) => r ? resolve(r) : reject(new Error("display falló"))
    )
  );

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width  = pixelData.width;
  srcCanvas.height = pixelData.height;
  srcCanvas.getContext("2d").putImageData(
    new ImageData(
      new Uint8ClampedArray(pixelData.data.buffer),
      pixelData.width,
      pixelData.height
    ),
    0, 0
  );

  const scale     = Math.min(1, 1080 / Math.max(width, height));
  const dstCanvas = document.createElement("canvas");
  dstCanvas.width  = Math.round(width  * scale);
  dstCanvas.height = Math.round(height * scale);
  dstCanvas.getContext("2d").drawImage(srcCanvas, 0, 0, dstCanvas.width, dstCanvas.height);

  const blob = await new Promise((res) => dstCanvas.toBlob(res, "image/jpeg", 0.85));
  return new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
};

const convertToJPG = async (file) => {
  const name   = (file.name || "").toLowerCase();
  const type   = (file.type || "").toLowerCase();
  const isHeic = type.includes("heic") || type.includes("heif")
              || name.endsWith(".heic") || name.endsWith(".heif");

  if (!isHeic) return file;

  // Intento 1: libheif-js WASM
  try {
    return await convertHeicWithLibheif(file);
  } catch (e) {
    console.warn("libheif-js falló:", e);
  }

  // Intento 2: heic2any
  try {
    let blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.85 });
    if (Array.isArray(blob)) blob = blob[0];
    return new File([blob], name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch (e) {
    console.warn("heic2any falló:", e);
  }

  alert(`No se pudo convertir "${file.name}". Por favor súbelo en JPG.`);
  return null;
};

const processFile = async (file) => {
  const converted = await convertToJPG(file);
  if (!converted) return null;

  const compressed = await imageCompression(converted, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    initialQuality: 0.7,
  });
  return new File([compressed], converted.name, { type: "image/jpeg" });
};

// ── Componente ───────────────────────────────────────────────────────────────

const PhotoDropzone = ({ label, photos, setPhotos }) => {
  const [loading, setLoading] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length + photos.length > 10) {
      alert("Máximo 10 fotos permitidas.");
      return;
    }
    setLoading(true);
    const newPhotos = [];
    try {
      for (const file of acceptedFiles) {
        const finalFile = await processFile(file);
        if (!finalFile) continue;
        newPhotos.push({
          file: finalFile,
          preview: URL.createObjectURL(finalFile),
          tempId: crypto.randomUUID(),
        });
      }
    } catch (err) {
      console.error("Error procesando imágenes:", err);
    } finally {
      setLoading(false);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
      "image/webp": [".webp"],
    },
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => (p.id ?? p.tempId) === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => (p.id ?? p.tempId) !== id);
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setPhotos((prev) =>
        arrayMove(
          prev,
          prev.findIndex((p) => (p.id ?? p.tempId) === active.id),
          prev.findIndex((p) => (p.id ?? p.tempId) === over.id)
        )
      );
    }
  };

  return (
    <section className="photo-dropzone">
      <h2>{label}</h2>
      {loading && <p>Procesando imágenes...</p>}

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Arrastra imágenes o haz clic para seleccionar</p>
        <p style={{ fontSize: "0.85rem" }}>JPG, PNG, HEIC, HEIF, WEBP · máximo 10 fotos</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={photos.map((p) => p.id ?? p.tempId)} strategy={rectSortingStrategy}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {photos.map((photo) => (
              <SortablePhoto key={photo.id ?? photo.tempId} photo={photo} removePhoto={removePhoto} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default PhotoDropzone;