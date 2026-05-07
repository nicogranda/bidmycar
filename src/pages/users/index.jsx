import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '../../config/env';
import { useAuth } from "../../components/auth/AuthContext";

// import './index.css';

const Users = () => {
  const { apiUrl } = getConfig();
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Seguridad básica
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Obtener usuarios
  useEffect(() => {
    if (authLoading || !user) return;

    setLoading(true);

    fetch(`${apiUrl}/index.php?page=user&action=index`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data?.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      })
      
      .catch(err => console.error("Error fetch users:", err))
      .finally(() => setLoading(false));

  }, [apiUrl, user, authLoading]);

  if (authLoading || loading) return <p>Cargando usuarios...</p>;

  const goToProfile = (id) => navigate(`/usuarios/${id}`);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Usuarios</h1>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="7">No hay usuarios</td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.active ? 'Activo' : 'Inactivo'}</td>
                <td>{u.created_at}</td>
                <td>
                  <div className="table-action-buttons">
                    <button onClick={() => goToProfile(u.id)}>
                      <i className="fas fa-eye" />
                    </button>
                    <button onClick={() => navigate(`/usuarios/editar/${u.id}`)}>
                      <i className="fas fa-pencil-alt" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
