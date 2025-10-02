// ImageCropper.jsx
import React, { useRef, useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const ImageCropper = ({ onCrop }) => {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const onImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file && /^image\//.test(file.type)) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        onCrop(blob); // Lo pasas al componente padre o lo subes directamente
      }, 'image/jpeg');
    }
  };

  return (
    <div>
      <input type="file" onChange={onImageChange} accept="image/*" />
      {image && (
        <Cropper
          src={image}
          style={{ height: 400, width: '100%' }}
          aspectRatio={1} // Puedes cambiar esto
          guides={false}
          viewMode={1}
          ref={cropperRef}
        />
      )}
      {image && <button onClick={handleCrop}>Recortar y subir</button>}
    </div>
  );
};

export default ImageCropper;
