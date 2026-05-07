import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";

import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import SpeedometerLoader from "../../../components/SpeedometerLoader";
import "./PhotoDropzone.css";

/* 🧩 Foto individual sortable */
const SortablePhoto = ({ photo, removePhoto }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.id || photo.tempId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <img
        src={photo.preview}
        alt="Imagen subida por el usuario"
        loading="lazy"
        decoding="async"
        style={{ width: 150, borderRadius: 4, cursor: "grab" }}
        {...listeners}
      />

      <button
        type="button"
        className="remove-photo-btn"
        onClick={(e) => {
          e.stopPropagation();
          removePhoto(photo.id || photo.tempId);
        }}
      >
        ×
      </button>
    </div>
  );
};

/* 🧩 Dropzone principal */
const PhotoDropzone = ({ label, photos, setPhotos }) => {
  const [loading, setLoading] = useState(false);

  /* 🔄 Conversión a JPG (HEIC / HEIF / WEBP) */
  const convertToJPG = async (file) => {
    const type = (file.type || "").toLowerCase();

    if (type.includes("jpeg") || type.includes("jpg") || type.includes("png")) {
      return file;
    }

    if (type.includes("heic") || type.includes("heif")) {
      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      return new File(
        [blob],
        file.name.replace(/\.[^/.]+$/, ".jpg"),
        { type: "image/jpeg" }
      );
    }

    if (type.includes("webp")) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          canvas
            .getContext("2d")
            .drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) =>
              blob
                ? resolve(
                    new File(
                      [blob],
                      file.name.replace(/\.[^/.]+$/, ".jpg"),
                      { type: "image/jpeg" }
                    )
                  )
                : reject(new Error("No se pudo convertir WEBP")),
            "image/jpeg",
            0.9
          );
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
    }

    return file;
  };
/* 🔄 Conversión + compresión rápida a JPG tamaño óptimo */
const processFile = async (file) => {
  // 1️⃣ Convertir a JPG si es HEIC / HEIF / WebP
  const converted = await convertToJPG(file);

  // 2️⃣ Comprimir y redimensionar automáticamente
  const compressed = await imageCompression(converted, {
    maxSizeMB: 0.5,          // objetivo ~0.5MB por foto
    maxWidthOrHeight: 800,   // lado más grande
    useWebWorker: true,
    maxIteration: 10,
    initialQuality: 0.7,
    alwaysKeepResolution: false,
  });

  return new File(
    [compressed],
    converted.name.replace(/\.[^/.]+$/, ".jpg"),
    { type: "image/jpeg" }
  );
};

  /* 🧩 Al soltar archivos */
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length + photos.length > 10) {
      alert("Máximo 10 fotos permitidas.");
      return;
    }

    setLoading(true);
    const newPhotos = [];

    try {
      for (const file of acceptedFiles) {
        const converted = await convertToJPG(file);

        if (converted.size > 10 * 1024 * 1024) {
          alert(`La imagen ${converted.name} supera los 10MB.`);
          continue;
        }

        const compressed = await imageCompression(converted, {
          maxSizeMB: 0.7,
          maxWidthOrHeight: 1080,
          useWebWorker: true,
          maxIteration: 8,
          initialQuality: 0.7,
        });

        const finalFile = new File(
          [compressed],
          converted.name.replace(/\.[^/.]+$/, ".jpg"),
          { type: "image/jpeg" }
        );

        newPhotos.push({
          file: finalFile,
          preview: URL.createObjectURL(finalFile),
          tempId: crypto.randomUUID(),
        });
      }
    } catch (err) {
      console.error("❌ Error procesando imágenes", err);
    } finally {
      setLoading(false);
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  /* 🎯 ACCEPT bien definido (clave del tema) */
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

  const removePhoto = (identifier) => {
    setPhotos((prev) => {
      const target = prev.find((p) => (p.id || p.tempId) === identifier);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => (p.id || p.tempId) !== identifier);
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setPhotos((prev) =>
        arrayMove(
          prev,
          prev.findIndex((p) => (p.id || p.tempId) === active.id),
          prev.findIndex((p) => (p.id || p.tempId) === over.id)
        )
      );
    }
  };

  return (
    <section className="photo-dropzone">
      <h2>{label}</h2>

      {loading && <SpeedometerLoader label="Procesando imágenes..." />}

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Arrastra imágenes o haz clic para seleccionar</p>
        <p style={{ fontSize: "0.85rem" }}>
          JPG, PNG, HEIC, HEIF, WEBP · máx. 10 fotos · 10MB c/u
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={photos.map((p) => p.id || p.tempId)}
          strategy={rectSortingStrategy}
        >
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {photos.map((photo, i) => (
              <SortablePhoto
                key={photo.id || photo.tempId}
                photo={photo}
                removePhoto={removePhoto}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default PhotoDropzone;
