import React, { useState, useEffect } from "react";
import ModalSlider from "./ModalSlider";

const ImageSlider = () => {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentGroup, setCurrentGroup] = useState("gallery");

  useEffect(() => {
    fetch("/api/get-images.php")
      .then((res) => res.json())
      .then((data) => {
        // Convierte el objeto en un array plano con categoría como propiedad
        const allImages = Object.entries(data).flatMap(([group, imgs]) =>
          imgs.map((src) => ({
            src,
            alt: src.split("/").pop(),
            group,
          }))
        );
        setImages(allImages);
      });
  }, []);

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setCurrentGroup("gallery");
    setIsOpen(true);
  };

  return (
    <div>
      <div className="gallery">
        {images.map((img, i) => (
          <img
            key={i}
            src={img.src}
            alt={img.alt}
            data-group={img.group}
            onClick={() => handleImageClick(i)}
          />
        ))}
      </div>

      {isOpen && (
        <ModalSlider
          images={images}
          initialIndex={currentIndex}
          group={currentGroup}
          onClose={() => setIsOpen(false)}
          onGroupChange={setCurrentGroup}
        />
      )}
    </div>
  );
};

export default ImageSlider;
