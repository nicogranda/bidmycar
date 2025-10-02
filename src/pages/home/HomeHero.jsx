import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConfig } from '../../config/env';
import './HomeHero.css';

const PLACEHOLDER = '/path/to/placeholder.png'; // ruta a imagen genérica

const HomeHero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const { apiUrl } = getConfig();

  useEffect(() => {
    fetch(`${apiUrl}/api/products/read.php?highlight=1`)
      .then(res => res.json())
      .then(data => {
        // Asegurarse que data sea un array
        const highlights = Array.isArray(data) ? data : [];

        const formattedSlides = highlights.map(vehicle => {
          const imgs = vehicle.images || [];
          return {
            id: vehicle.id,
            slug: vehicle.slug || vehicle.id,
            title: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
            image: imgs[0]?.file_path || PLACEHOLDER,
            box1: { image: imgs[1]?.file_path || PLACEHOLDER },
            box2: { image: imgs[2]?.file_path || PLACEHOLDER },
            box3: { image: imgs[3]?.file_path || PLACEHOLDER },
            box4: { image: imgs[4]?.file_path || PLACEHOLDER },
          };
        });

        setSlides(formattedSlides);
      })
      .catch(err => console.error('Error al cargar vehículos destacados:', err));
  }, [apiUrl]);

  // Slider automático
  useEffect(() => {
    if (!slides.length) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  if (!slides.length) return <p>Cargando vehículos destacados...</p>;

  const currentSlide = slides[current];

  return (
    <>
      <Link
        to={`/vehiculo/${currentSlide.id}`}
        state={{ vehicle: currentSlide }}
        className="hero-link-wrapper"
      >
        <section className="hero">
          <article
            className="cover-hero"
            style={{ backgroundImage: `url(${apiUrl}${currentSlide.image})` }}
          >
            <div className="car" />
          </article>

          <article className="gallery-hero">
            {[1, 2, 3, 4].map(i => {
              const box = currentSlide[`box${i}`];
              return (
                <div
                  key={`box-${i}`}
                  className={`box box${i}`}
                  style={{ backgroundImage: `url(${apiUrl}${box.image})` }}
                />
              );
            })}
          </article>
        </section>
      </Link>

      <div className="slider-controls">
        <button
          className="prev"
          onClick={e => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          ‹
        </button>
        <button
          className="next"
          onClick={e => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          ›
        </button>
      </div>
    </>
  );
};

export default HomeHero;
