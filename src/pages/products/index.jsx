// pages/products/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '../../config/env';
import './index.css';

const Products = () => {
  const { apiUrl } = getConfig();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ loading: true, loggedIn: false, user: null });
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const navigate = useNavigate();

  // ✅ Obtener sesión
  useEffect(() => {
    fetch(`${apiUrl}/api/session.php`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        // console.log("Datos recibidos del backend session:", data);
        const loggedIn = data.success && data.session?.user_id;
        const user = data.session?.user || null;
        setSession({ loading: false, loggedIn, user });
      })
      .catch(err => {
        console.error(err);
        setSession({ loading: false, loggedIn: false, user: null });
      });
  }, [apiUrl]);
  
  useEffect(() => {
    if (session.loading || !session.loggedIn) return;
  
    //console.log("Fetching vehicles para user_id:", session.user.id);
  
    fetch(`${apiUrl}/api/products/products_user.php?user_id=${session.user.id}`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        // console.log("Datos recibidos del backend product_user:", data);
        setVehicles(data.vehicles || []);
      })
      .catch(err => console.error("Error fetch vehicles:", err))
      .finally(() => setLoading(false));
  }, [apiUrl, session]);
  
  if (session.loading || loading) return <p>Cargando vehículos...</p>;

  if (!session.loggedIn) return navigate("/login");

  const handleEdit = (id) => navigate(`/car/update/${id}`);
  const handleImagesEdit = (id) => navigate(`/car/upload/${id}`);
  const handleDeleteClick = (id) => { setSelectedVehicleId(id); setShowModal(true); };
  const cancelDelete = () => { setShowModal(false); setSelectedVehicleId(null); };
  const confirmDelete = () => {
    fetch(`${apiUrl}/api/products/delete.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id: selectedVehicleId }),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setVehicles(v => v.filter(v => v.id !== selectedVehicleId));
        setShowModal(false);
        setSelectedVehicleId(null);
      })
      .catch(err => { console.error(err); setShowModal(false); });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mis vehículos</h1>
      <table className="vehicles-table">
        <thead>
          <tr>
            <th>ID</th><th>Marca</th><th>Modelo</th><th>Año</th><th>Precio</th><th>Estatus</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? <tr><td colSpan="7">No hay vehículos</td></tr>
            : vehicles.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td><td>{v.brand}</td><td>{v.model}</td><td>{v.year}</td>
                <td>{v.price}</td><td>{v.status}</td>
                <td>
                  <div className="table-action-buttons">
                    <button onClick={() => handleEdit(v.id)}><i className="fas fa-pencil-alt" /></button>
                    <button onClick={() => handleImagesEdit(v.id)}><i className="fas fa-image" /></button>
                    <button onClick={() => handleDeleteClick(v.id)}><i className="fas fa-trash" /></button>
                  </div>
                </td>
              </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>¿Eliminar vehículo?</h2>
            <p>Esta acción no se puede deshacer.</p>
            <div className="modal-buttons">
              <button onClick={cancelDelete}>Cancelar</button>
              <button onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
