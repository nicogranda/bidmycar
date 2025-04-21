import React, { useEffect, useState } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8888/bidmycar/backend/api/products/featured.php`)
      .then(response => response.json())
      .then(data => {
        console.log('DATA:', data); // 🔍 Verifica esto en la consola
        const formattedSlides = data.map((vehicle) => {
          return {
            id: vehicle.id,
            slug: `${vehicle.slug}`,
            title: `${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
            image: `${vehicle.cover_view}`,
            box1: { image: vehicle.front_view },
            box2: { image: vehicle.back_view },
            box3: { image: vehicle.left_view },
            box4: { image: vehicle.right_view }
          };
        });
      
        setSlides(formattedSlides);
      })
      
      .catch(error => {
        console.error('Error al cargar vehículos:', error);
      });
  }, []);

  // Slider automático
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 segundos

    return () => clearInterval(interval); // limpieza
  }, [slides]);

  const nextSlide = () => {
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? slides.length - 1 : current - 1);
  };

  if (slides.length === 0) {
    return <p>Cargando detalles del vehículo...</p>;
  }

  const currentSlide = slides[current];

  return (
    <section className="hero">
  
      <article
        className="cover-hero"
        style={{
          backgroundImage: `url(http://localhost:8888/bidmycar/backend/public/images/${currentSlide.id}/${currentSlide.image})`
        }}   
      >
        <div className="car">
          <h2>{currentSlide.title}</h2>
        </div>
      </article>
  
       <article className="gallery-hero">
        {[1, 2, 3, 4].map((boxNumber) => {
          const box = currentSlide[`box${boxNumber}`];
          return (
            <div
              key={`box-${boxNumber}`}
              className={`box box${boxNumber}`}
              style={{
                backgroundImage: `url(http://localhost:8888/bidmycar/backend/public/images/${currentSlide.id}/${box.image})`
              }}
            />
          );
        })}

        {/* Flechas posicionadas respecto a <section className="hero"> */}
         <div className="slider-controls">
          <button className="prev" onClick={prevSlide}>‹</button>
          <button className="next" onClick={nextSlide}>›</button>
        </div>
      </article> 
  
    </section>
  );
};

export default HeroSlider;
