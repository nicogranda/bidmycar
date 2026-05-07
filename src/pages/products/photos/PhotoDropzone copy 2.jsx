// src/components/photos/PhotoDropzone.jsx

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


/* ----------------------------- */
/* Foto individual draggable     */
/* ----------------------------- */

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
        alt="preview"
        loading="lazy"
        decoding="async"
        style={{
          width: 150,
          borderRadius: 4,
          cursor: "grab",
        }}
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


/* ----------------------------- */
/* Dropzone principal            */
/* ----------------------------- */

const PhotoDropzone = ({ label, photos, setPhotos }) => {

  const [loading, setLoading] = useState(false);


  /* ----------------------------- */
  /* Convertir HEIC a JPG          */
  /* ----------------------------- */

  const convertHeic = async (file) => {

    try {

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

    } catch (err) {

      console.warn("⚠️ HEIC no compatible:", err);

      return null;
    }
  };


  /* ----------------------------- */
  /* Procesar imagen               */
  /* ----------------------------- */

  const processFile = async (file) => {

    let workingFile = file;

    const type = (file.type || "").toLowerCase();


    /* HEIC */

    if (type.includes("heic") || type.includes("heif")) {

      const converted = await convertHeic(file);

      if (!converted) return null;

      workingFile = converted;
    }


    /* COMPRESIÓN */

    try {

      const compressed = await imageCompression(workingFile, {

        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        initialQuality: 0.8,
      });

      return new File(
        [compressed],
        workingFile.name.replace(/\.[^/.]+$/, ".jpg"),
        { type: "image/jpeg" }
      );

    } catch (err) {

      console.error("Error comprimiendo", err);

      return null;
    }
  };


  /* ----------------------------- */
  /* Drop                          */
  /* ----------------------------- */

  const onDrop = async (acceptedFiles) => {

    if (acceptedFiles.length + photos.length > 10) {

      alert("Máximo 10 fotos permitidas.");
      return;
    }

    setLoading(true);

    const newPhotos = [];

    for (const file of acceptedFiles) {

      const processed = await processFile(file);

      if (!processed) continue;

      newPhotos.push({

        file: processed,
        preview: URL.createObjectURL(processed),
        tempId: crypto.randomUUID(),

      });
    }

    setPhotos((prev) => [...prev, ...newPhotos]);

    setLoading(false);
  };


  /* ----------------------------- */
  /* Configuración Dropzone        */
  /* ----------------------------- */

  const { getRootProps, getInputProps } = useDropzone({

    onDrop,

    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"],
    },

  });


  const sensors = useSensors(useSensor(PointerSensor));


  /* ----------------------------- */
  /* Eliminar foto                 */
  /* ----------------------------- */

  const removePhoto = (identifier) => {

    setPhotos((prev) => {

      const target = prev.find((p) => (p.id || p.tempId) === identifier);

      if (target) URL.revokeObjectURL(target.preview);

      return prev.filter((p) => (p.id || p.tempId) !== identifier);

    });
  };


  /* ----------------------------- */
  /* Drag and drop ordenar         */
  /* ----------------------------- */

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


  /* ----------------------------- */
  /* Render                        */
  /* ----------------------------- */

  return (

    <section className="photo-dropzone">

      <h2>{label}</h2>

      {loading && (
        <SpeedometerLoader label="Procesando imágenes..." />
      )}

      <div {...getRootProps()} className="dropzone">

        <input {...getInputProps()} />

        <p>Arrastra imágenes o haz clic para seleccionar</p>

        <p style={{ fontSize: "0.85rem" }}>
          JPG, PNG, HEIC, WEBP · máx. 10 fotos
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

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >

            {photos.map((photo) => (

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