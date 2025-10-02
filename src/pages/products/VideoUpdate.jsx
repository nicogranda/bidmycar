import React, { useState } from 'react';

const VideoUpdate = ({ vehicle, onUpdate }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(vehicle?.video_url || '');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && (file.type === 'video/mp4' || file.type === 'video/quicktime')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      setVideoFile(null);
      setVideoPreview('');
      alert('Por favor sube un archivo .mp4 o .mov');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (videoFile && onUpdate) {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('vehicle_id', vehicle.id); // opcional

      onUpdate(formData); // puedes usar fetch o axios en el padre
    }
  };

  return (
    <div>
      <h3 className="vehicle-commints">Subir nuevo video</h3>

      {videoPreview && (
        <div className="video-container" style={{ marginTop: '1rem' }}>
          <video width="100%" height="300" controls style={{ background: '#000' }}>
            <source src={videoPreview} type={videoFile?.type || 'video/mp4'} />
            Tu navegador no soporta el video HTML5.
          </video>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <label htmlFor="videoFile">Seleccionar archivo de video:</label>
        <input
          type="file"
          id="videoFile"
          accept="video/mp4, video/quicktime"
          onChange={handleFileChange}
          style={{ display: 'block', marginTop: '0.5rem' }}
        />

        {submitted && !videoFile && (
          <p style={{ color: 'red', fontSize: '0.9rem' }}>Debes seleccionar un archivo válido.</p>
        )}

        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            background: '#F15A24',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Subir Video
        </button>
      </form>
    </div>
  );
};

export default VideoUpdate;