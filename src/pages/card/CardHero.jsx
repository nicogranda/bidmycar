import React, { useEffect, useState } from 'react';
import { getConfig } from '../../config/env';
import ImageViewer from './ImageViewer';
import ModalCard from './ModalCard';
import '../home/HomeHero.css';

const PLACEHOLDER = '/path/to/placeholder.png';

const CardHero = ({ vehicleId }) => {
  const [vehicle, setVehicle] = useState(null);
  const { apiUrl } = getConfig();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerCategory, setViewerCategory] = useState('all');
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerImage, setViewerImage] = useState('');

  const getImageUrl = (filePath) => {
    if (!filePath) return PLACEHOLDER;
    return filePath.startsWith('http') ? filePath : `${apiUrl}${filePath}`;
  };

  useEffect(() => {
    if (!vehicleId) return;

    fetch(`${apiUrl}/api/products/show.php?id=${vehicleId}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.id) return;

        // Filtrar solo imágenes (exterior/interior/etc.) y llenar hasta 5
        const images = data.media
          .filter(m => m.category !== 'video')
          .map(m => m.url)
          .slice(0, 5);

        while (images.length < 5) images.push(PLACEHOLDER);

        const formatted = {
          id: data.id,
          slug: data.slug,
          title: `${data.year} ${data.brand} ${data.model}`,
          subtitle: `${data.transmission}, ${data.drivetrain}, ${data.energy_type || ''}`,
          image: images[0],
          box1: { image: images[1], category: data.media[1]?.category || 'exterior' },
          box2: { image: images[2], category: data.media[2]?.category || 'exterior' },
          box3: { image: images[3], category: data.media[3]?.category || 'exterior' },
          box4: { image: images[4], category: data.media[4]?.category || 'exterior' },
        };

        setVehicle(formatted);
      })
      .catch(err => console.error('Error al cargar vehículo:', err));
  }, [vehicleId, apiUrl]);

  const openModalhero = (category, index = 0, image = '') => {
    setViewerCategory(category);
    setViewerIndex(index);
    setViewerImage(image);
    setIsViewerOpen(true);
  };

  const closeModal = () => setIsViewerOpen(false);

  if (!vehicle) return <p>Cargando detalles del vehículo...</p>;

  return (
    <>
      <div className="title-over-hero">{vehicle.title}</div>
      <div className="subtitle-over-hero">{vehicle.subtitle}</div>
      <section className="hero">
        <article
          className="cover-hero"
          style={{ backgroundImage: `url(${getImageUrl(vehicle.image)})` }}
          onClick={() => openModalhero('exterior', 0, vehicle.image)}
        />

        <article className="gallery-hero">
          {[1, 2, 3, 4].map(i => {
            const box = vehicle[`box${i}`];
            return (
              <div
                key={`box-${i}`}
                className={`box box${i}`}
                style={{ backgroundImage: `url(${getImageUrl(box.image)})` }}
                onClick={() => openModalhero(box.category, i, box.image)}
              />
            );
          })}
        </article>
      </section>

      <ModalCard show={isViewerOpen} onClose={closeModal}>
        <ImageViewer
          vehicleId={vehicleId}
          initialCategory={viewerCategory}
          initialIndex={viewerIndex}
          initialImage={viewerImage}
          title={vehicle.title}
        />
      </ModalCard>
    </>
  );
};

export default CardHero;
