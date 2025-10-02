import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getConfig } from '../../config/env';
import './UserDropdown.css';

const UserDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [incompleteList, setIncompleteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { apiUrl } = getConfig();

  // 🖱 Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Obtener sesión PHP
  useEffect(() => {
    fetch(`${apiUrl}/api/session.php`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUser(data.session?.user || null))
      .catch(err => console.error(err));
  }, [apiUrl]);

  // ✅ Obtener vehículos incompletos del usuario
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    setLoading(true);

    fetch(`${apiUrl}/api/products/checkIncomplete.php`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        if (!mounted) return;
        setIncompleteList(data?.vehicles || []);
      })
      .catch(err => {
        console.error('Error checkIncomplete:', err);
        setIncompleteList([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [apiUrl, user]);

  // 🔔 Escucha global para cerrar el dropdown/form al hacer logout
  useEffect(() => {
    const handleCloseForm = () => setIsOpen(false);
    window.addEventListener('closeProductForm', handleCloseForm);

    return () => window.removeEventListener('closeProductForm', handleCloseForm);
  }, []);

  const handleCompleteNow = () => {
    if (!incompleteList[0]) return;
    setIsOpen(false);
    navigate(`/${user.id}/vehiculos`, { state: { openVehicleId: incompleteList[0].id } });
  };
  
  const handleEditVehicle = (id) => {
    setIsOpen(false);
    navigate(`/${user.id}/vehiculos`, { state: { openVehicleId: id } });
  };
  
  const handleLogout = () => {
    fetch(`${apiUrl}/api/logout.php`, { credentials: 'include' })
      .then(() => {
        setUser(null);                 // Quita icono de user
        setIsOpen(false);              // Cierra dropdown
        onLogout();                    // Notifica a padre/global
        // window.dispatchEvent(new Event('userLogout'));
        // window.dispatchEvent(new Event('closeProductForm')); // Cierra forms abiertos
        navigate('/login');            // Redirige al login
        // setTimeout(() => {
        //   window.location.reload();    // 🔄 Refresca página (adiós estados rebeldes)
        // }, 100);
      })
      .catch(err => console.error('Error al hacer logout:', err));
  };
  
  
  return (
    <div className="user-dropdown" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)}>
      <div className="user-icon" role="button" aria-haspopup="true" aria-expanded={isOpen}>
        <i className="fas fa-user" />
      </div>

      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <div className="user-name-display">{user?.name || 'Usuario'}</div>

        {!loading && incompleteList.length > 0 && (
          <div className="incomplete-alert">
            <button onClick={handleCompleteNow}>
              ⚠️ Vehículos incompletos ({incompleteList.length})
            </button>
          </div>
        )}

        {loading && <div className="loading-text">Comprobando vehículos…</div>}
        {!loading && incompleteList.length === 0 && (
          <div className="all-clear-text">Todo en orden ✅</div>
        )}

        <button onClick={() => { setIsOpen(false); navigate('/profile'); }}>Perfil</button>
        <button onClick={() => { setIsOpen(false); navigate('/dashboard'); }}>Dashboard</button>
        <button onClick={() => handleLogout()}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default UserDropdown;
