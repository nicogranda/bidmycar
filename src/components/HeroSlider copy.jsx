import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const slides = [
  { 
    id: 1, 
    image: '/images/slide1.jpg', 
    title: '2024 Ferrari Sincronico Amarillo', 
    description: 'Descubre nuestra marca',
    box1: { image: '/images/box1.jpg', title: 'Innovación', description: 'Tecnología avanzada' },
    box2: { image: '/images/box2.jpg', title: 'Innovación', description: 'Tecnología avanzada' },
    box3: { image: '/images/box3.jpg', title: 'Deportivo', description: 'Velocidad pura' },
    box4: { image: '/images/box4.jpg', title: 'Exclusividad', description: 'Para los más exigentes' }
  },
  { 
    id: 2, 
    image: '/images/slide2.jpg', 
    title: 'Promociones', 
    description: 'Aprovecha los descuentos',
    box1: { image: '/images/box21.jpg', title: 'Gran descuento', description: 'Aprovecha nuestra oferta' },
    box2: { image: '/images/box22.jpg', title: 'Innovación', description: 'Tecnología avanzada' },
    box3: { image: '/images/box23.jpg', title: 'Limitado', description: 'Solo por tiempo limitado' },
    box4: { image: '/images/box24.jpg', title: 'Superoferta', description: 'Hasta 50% de descuento' }
  },
  { 
    id: 3, 
    image: '/images/slide3.jpg', 
    title: 'Nuevos productos', 
    description: 'Explora nuestras novedades',
    box1: { image: '/images/box1.jpg', title: 'Nuevo diseño', description: 'Diseños únicos para ti' },
    box2: { image: '/images/box2.jpg', title: 'Innovación', description: 'Tecnología avanzada' },
    box3: { image: '/images/box3.jpg', title: 'Última tecnología', description: 'La mejor tecnología disponible' },
    box4: { image: '/images/box4.jpg', title: 'Exclusivos', description: 'Solo para clientes selectos' }
  },
];
export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero">

      <article
        className="cover-hero"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}${slides[current].image})`
        }}
      >
        <div className="bid">
          {/* <h2>{slides[current].title}</h2> */}
          <p>{slides[current].description}</p>
        </div>
        <div className="car">
          <h2>{slides[current].title}</h2>
          {/* <p>{slides[current].description}</p> */}
        </div>

      </article>

      <article className="gallery-hero">
        {[1, 2, 3, 4].map((boxNumber) => {
          const box = slides[current][`box${boxNumber}`];
          return (
            <div
              key={`box-${boxNumber}`}
              className={`box box${boxNumber}`}
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL}${box.image})`
              }}
            />
          );
        })}
      </article>

    </section>

  );
}

