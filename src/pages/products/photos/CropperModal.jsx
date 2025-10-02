import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';

function getCroppedImg(imageSrc, croppedAreaPixels, fileName = 'cropped') {
  const NEW_WIDTH = 600;
  const NEW_HEIGHT = 400;

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = NEW_WIDTH;
      canvas.height = NEW_HEIGHT;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        NEW_WIDTH,
        NEW_HEIGHT
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        const safeFileName = fileName.replace(/[^\w\-]/g, '_');
        const finalFile = new File([blob], `${safeFileName}.png`, { type: 'image/png' });
        resolve(finalFile);
      }, 'image/png');
    };
    image.onerror = () => reject(new Error('Failed to load image'));
  });
}

const CropperModal = ({ imageSrc, onCropComplete, onClose, fileName }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  const onCropChange = (crop) => setCrop(crop);
  const onCropCompleteInternal = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const onZoomChange = (zoom) => setZoom(zoom);

  const handleDone = async () => {
    try {
      if (!croppedAreaPixels) {
        console.error('No cropped area selected');
        return;
      }
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, fileName);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '80vw',
          height: '60vh',
          background: '#333',
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteInternal}
        />
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: '20px', color: 'white', textAlign: 'center' }}
      >

        <div
          onClick={(e) => e.stopPropagation()}
          style={{ marginTop: '20px', color: 'white', textAlign: 'center' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={handleDone}>Recortar</button>
            <button onClick={onClose}>Cancelar</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CropperModal;
