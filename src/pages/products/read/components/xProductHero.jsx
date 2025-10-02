import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getConfig } from '../../../config/env';
import ImageViewer from './ImageViewer';
import ModalCard from './ModalCard';
import '../../home/HomeHero.css';

const PLACEHOLDER = '/path/to/placeholder.png';

const ProductHero = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const { apiUrl } = getConfig();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerCategory, setViewerCategory] = useState('all');
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerImage, setViewerImage] = useState('');

  // Función para generar URLs correctas de las imágenes
  const getImageUrl = (filePath) => {
    if (!filePath) return PLACEHOLDER;
    return `${apiUrl}${filePath}`;
  };

  useEffect(() => {
    if (!id) return;

    fetch(`${apiUrl}/api/products/show.php?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.id) return;

        // Obtener hasta 5 imágenes, rellenando con placeholder si faltan
        const images = Array.from({ length: 5 }, (_, i) => data.images[i]?.file_path || PLACEHOLDER);

        const formatted = {
          id: data.id,
          slug: data.slug,
          title: `${data.year} ${data.brand} ${data.model}`,
          image: images[0],
          box1: { image: images[1], category: data.images[1]?.category || 'exterior' },
          box2: { image: images[2], category: data.images[2]?.category || 'exterior' },
          box3: { image: images[3], category: data.images[3]?.category || 'exterior' },
          box4: { image: images[4], category: data.images[4]?.category || 'exterior' }
        };

        setVehicle(formatted);
      })
      .catch(err => console.error('Error al cargar vehículo:', err));
  }, [id, apiUrl]);

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
          vehicleId={id}
          initialCategory={viewerCategory}
          initialIndex={viewerIndex}
          initialImage={viewerImage}
          title={vehicle.title}
        />
      </ModalCard>
    </>
  );
};

export default ProductHero;
