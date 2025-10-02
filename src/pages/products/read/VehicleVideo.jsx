import React from 'react';

function getVideoInfo(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Detecta videos de YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      let videoId = '';

      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1);
      } else if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1];
      } else if (urlObj.searchParams.has('v')) {
        videoId = urlObj.searchParams.get('v');
      }

      if (videoId) {
        return {
          type: 'youtube',
          src: `https://www.youtube.com/embed/${videoId}`,
          originalUrl: url,
        };
      }
    }

    // Detecta videos locales (mp4/mov)
    if (url.endsWith('.mp4') || url.endsWith('.mov')) {
      return {
        type: 'local',
        src: url,
      };
    }

    return null;
  } catch (error) {
    console.error('Error procesando URL del video:', error);
    return null;
  }
}

const VehicleVideo = ({ vehicle }) => {
  if (!vehicle || !vehicle.media) return null;

  const videoItem = vehicle.media.find(m => m.category === 'video');
  if (!videoItem) return null;

  const videoUrl = videoItem.url;
  const videoInfo = getVideoInfo(videoUrl);

  if (!videoInfo) return null;

  return (
    <div>
      <h3 className="vehicle-commints">Video</h3>
      <div className="video-container" style={{ marginTop: '1rem' }}>
        {videoInfo.type === 'youtube' ? (
          <iframe
            width="100%"
            height="430"
            src={videoInfo.src}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            width="100%"
            height="430"
            controls
            style={{ background: '#000' }}
            src={videoInfo.src}  // directamente como src
          >
            Tu navegador no soporta el video HTML5.
          </video>
        )}
      </div>
    </div>
  );
};


export default VehicleVideo;
