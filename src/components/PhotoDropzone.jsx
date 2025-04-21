import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';

const PhotoDropzone = ({ photos, setPhotos }) => {
  const onDrop = useCallback((acceptedFiles) => {
    setPhotos((prev) => [...prev, ...acceptedFiles]);
  }, [setPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: true,
    maxFiles: 6
  });
  

  return (
    <div className="dropzone-container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Suelta las imágenes aquí...</p>
        ) : (
          <p>Arrastra y suelta hasta 6 fotos del coche, o haz clic para seleccionarlas</p>
        )}
      </div>

      {/* Vista previa */}
      <div className="preview-grid">
        {photos.map((file, index) => (
          <div key={index} className="preview-item">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className="preview-image"
            />
            <span className="photo-label">Foto {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PhotoDropzone;
