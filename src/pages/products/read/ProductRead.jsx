// src/pages/products/components/ProductRead.jsx
import React, { useEffect, useState } from 'react';
import { getConfig } from '../../../config/env';

export default function ProductRead({ vehicleId }) {
  const { apiUrl } = getConfig();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products/show.php?id=${vehicleId}`);
        const data = await res.json();
        setVehicle(data);
      } catch (err) {
        console.error('Error cargando vehículo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [apiUrl, vehicleId]);

  if (loading) return <p>Cargando detalles del vehículo...</p>;
  if (!vehicle) return <p>Vehículo no encontrado</p>;

  // Ficha técnica
  const techFields = [
    ['Marca', vehicle.brand],
    ['Modelo', vehicle.model],
    ['Kilometraje', vehicle.mileage],
    ['VIN', vehicle.serial],
    ['Situación Legal', vehicle.title_status],
    ['Location', vehicle.zip_code],
    ['Vendedor', vehicle.seller],
    ['Motor', vehicle.engine],
    ['Tracción', vehicle.drivetrain],
    ['Transmisión', vehicle.transmission],
    ['Carrocería', vehicle.body_style],
    ['Color Exterior', vehicle.color_ext],
    ['Color Interior', vehicle.color_int],
    ['Combustible', vehicle.energy_type],
  ];

  // Secciones de detalles
  const detailSections = [
    ['Destacados', vehicle.highlights],
    ['Equipado con', vehicle.equipment],
    ['Modificaciones Mecánicas', vehicle.modifications_mechanical],
    ['Modificaciones Exteriores', vehicle.modifications_exterior],
    ['Modificaciones Internas', vehicle.modifications_interior],
    ['Fallas conocidas', vehicle.known_flaws],
    ['Histórico de Servicios Recientes', vehicle.recent_service_history],
    ['La venta incluye', vehicle.other_items_included],
  ];

  return (
    <div className="product-read">
      <section className="product-sheet">
        {techFields.map(([label, value], i) => (
          <article className="row" key={i}>
            <div className="label">{label}</div>
            <div className="value">{value}</div>
          </article>
        ))}
      </section>

      <div className="details">
        {detailSections.map(([title, content], i) => (
          content && (
            <div key={i}>
              <h3 className="vehicle-commints">{title}</h3>
              {title === 'Equipado con' || title === 'Destacados' ? (
                <p>{content}</p>
              ) : (
                <ul>
                  {content.split('\n').map((item, j) => item.trim() && <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          )
        ))}

        {vehicle.seller_notes && (
          <>
            <h3 className="vehicle-commints">Nota del Vendedor</h3>
            <p>{vehicle.seller_notes}</p>

            <div className="disclaimer">
              Todos los listados de subastas en <strong>BidMyCar</strong> se redactan
              en base a la información proporcionada por el vendedor durante el proceso
              de envío y han sido revisados por el vendedor para garantizar su precisión
              según su mejor criterio. Sin embargo, es responsabilidad del postor realizar
              toda la debida diligencia antes de hacer una oferta, incluyendo verificación
              del contenido, defectos, legalidad de registro, emisiones y elegibilidad de importación.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
