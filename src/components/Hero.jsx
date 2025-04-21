// src/components/Hero.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // ✅ ya puedes usar esto
import './HeroSlider.css';

const Hero = () => {
  const { id } = useParams(); // ✅ ID dinámico desde la URL
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    if (!id) return; // por si acaso
    fetch(`http://localhost:8888/bidmycar/backend/api/products/show.php?id=${id}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.id) {
          const formatted = {
            id: data.id,
            slug: data.slug,
            title: `${data.year} ${data.brand} ${data.model}`,
            image: data.cover_view,
            box1: { image: data.front_view },
            box2: { image: data.back_view },
            box3: { image: data.left_view },
            box4: { image: data.right_view }
          };
          setVehicle(formatted);
        }
      })      
      .catch(error => {
        console.error('Error al cargar vehículo:', error);
      });
  }, [id]); // 👈 se vuelve a ejecutar si cambia el id

  if (!vehicle) return <p>Cargando detalles del vehículo...</p>;

  return (
    <section className="hero">
      <article
        className="cover-hero"
        style={{
          backgroundImage: `url(http://localhost:8888/bidmycar/backend/public/images/${vehicle.id}/${vehicle.image})`
        }}
      >
        <div className="car">
          <h2>{vehicle.title}</h2>
        </div>
      </article>

      <article className="gallery-hero">
        {[vehicle.box1, vehicle.box2, vehicle.box3, vehicle.box4].map((box, i) => (
          <div
            key={`box-${i}`}
            className={`box box${i + 1}`}
            style={{
              backgroundImage: `url(http://localhost:8888/bidmycar/backend/public/images/${vehicle.id}/${box.image})`
            }}
          />
        ))}
      </article>
    </section>
  );
};

export default Hero;
