// src/components/TableVehicles.jsx
import React, { useState, useEffect } from 'react';
import VehicleForm from './VehicleForm'; // formulario para crear/editar
import ConfirmDialog from './ConfirmDialog'; // modal de confirmación

const TableVehicles = ({ apiUrl, authToken, isAdmin, currentUserId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchVehicles = () => {
    setLoading(true);
    const url = `${apiUrl}/vehicles?per_page=${perPage}&page=${page}` +
      `${!isAdmin ? `&user_id=${currentUserId}` : ''}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
    .then(res => res.json())
    .then(data => {
      setVehicles(data.items);
      setTotalPages(data.totalPages);
    })
    .finally(() => setLoading(false));
  };

  useEffect(fetchVehicles, [page, perPage]);

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar vehículo?')) return;
    fetch(`${apiUrl}/vehicles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) fetchVehicles();
        else alert('Error al eliminar');
      });
  };

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const openCreate = () => { setEditing(null); setShowForm(true); };
  const openEdit = (veh) => { setEditing(veh); setShowForm(true); };
  const closeForm = () => setShowForm(false);

  const handleFormSuccess = () => {
    closeForm();
    fetchVehicles();
  };

  return (
    <div>
      <div style={{ marginBottom: '1em' }}>
        <button onClick={openCreate}>+ Nuevo Vehículo</button>
        <label>
          Mostrar:
          <select
            value={perPage}
            onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          >
            {[5,10,20,50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p>Cargando...</p> : (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th><th>Brand</th><th>Model</th><th>Año</th><th>Precio</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.brand}</td>
                <td>{v.model}</td>
                <td>{v.year}</td>
                <td>{v.price} €</td>
                <td>
                  <button onClick={() => openEdit(v)}>Editar</button>
                  <button onClick={() => handleDelete(v.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr><td colSpan="6">Sin registros</td></tr>
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1em' }}>
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>◀ Anterior</button>
        <span> Página {page} de {totalPages} </span>
        <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Siguiente ▶</button>
      </div>

      {showForm && (
        <VehicleForm
          apiUrl={apiUrl}
          authToken={authToken}
          onSuccess={handleFormSuccess}
          onCancel={closeForm}
          vehicle={editing}
        />
      )}
    </div>
  );
};

export default TableVehicles;
