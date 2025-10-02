// src/components/ImageUploader.js
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- Componente para cada imagen (sortable)
function SortableImage({ id, src }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: 100,
    height: 100,
    objectFit: "cover",
    border: "1px solid #ccc",
  };

  return (
    <img
      ref={setNodeRef}
      src={src}
      style={style}
      alt=""
      {...attributes}
      {...listeners}
    />
  );
}

export default function ImageUploader() {
  const [images, setImages] = useState([]);

  // Dropzone
  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const id = crypto.randomUUID(); // ID único
      return {
        id,
        file,
        preview: URL.createObjectURL(file),
      };
    });
    setImages((prev) => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Reordenar
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Subir al backend
  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img, index) => {
      formData.append("images[]", img.file);
      formData.append("order[]", index); // orden
    });

    await fetch("upload.php", {
      method: "POST",
      body: formData,
    });
    alert("Imágenes subidas con orden ✅");
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed gray",
          padding: "20px",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        <p>Arrastra tus imágenes o haz click para subir</p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            style={{
              display: "flex",
              marginTop: 20,
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            {images.map((img) => (
              <SortableImage key={img.id} id={img.id} src={img.preview} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button onClick={handleUpload} style={{ marginTop: 20 }}>
        Guardar Imágenes
      </button>
    </div>
  );
}

