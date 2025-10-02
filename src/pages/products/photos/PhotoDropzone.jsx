import React from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import {
  DndContext, closestCenter, useSensor, useSensors, PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortablePhoto = ({ photo, removePhoto }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id || photo.tempId });
  const style = { transform: CSS.Transform.toString(transform), transition, position: "relative" };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={photo.preview} alt="preview" style={{ width: 150, borderRadius: 4 }} />
      <button
        type="button"
        onClick={() => removePhoto(photo.id || photo.tempId)}
        style={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer" }}
      >×</button>
    </div>
  );
};

const PhotoDropzone = ({ label, photos, setPhotos }) => {
  const onDrop = async (acceptedFiles) => {
    const newPhotos = [];
    for (const file of acceptedFiles) {
      try {
        const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true });
        const finalFile = new File([compressed], file.name, { type: compressed.type });
        newPhotos.push({ file: finalFile, preview: URL.createObjectURL(finalFile), tempId: Date.now() + Math.random() });
      } catch {
        newPhotos.push({ file, preview: URL.createObjectURL(file), tempId: Date.now() + Math.random() });
      }
    }
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const { getRootProps, getInputProps } = useDropzone({ accept: { "image/*": [] }, onDrop });
  const sensors = useSensors(useSensor(PointerSensor));

  const removePhoto = (identifier) => setPhotos(prev => prev.filter(p => (p.id || p.tempId) !== identifier));
  const handleDragEnd = ({ active, over }) => { if (over && active.id !== over.id) setPhotos(prev => arrayMove(prev, prev.findIndex(p => (p.id||p.tempId)===active.id), prev.findIndex(p => (p.id||p.tempId)===over.id))); };

  return (
    <section className="photo-dropzone">
      <h2>{label}</h2>
      <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, cursor: "pointer", marginBottom: "1rem" }}>
        <input {...getInputProps()} />
        <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={photos.map(p => p.id || p.tempId)} strategy={rectSortingStrategy}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {photos.map(photo => <SortablePhoto key={photo.id||photo.tempId} photo={photo} removePhoto={removePhoto} />)}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
};

export default PhotoDropzone;
