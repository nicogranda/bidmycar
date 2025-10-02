import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import UserDropdown from './UserDropdown';
import Filter from './Filter.jsx';
import { getConfig } from '../../config/env';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();
  const { apiUrl } = getConfig();

  // ✅ Obtener sesión del backend
  const fetchSession = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/session.php`, { credentials: 'include' });
      const data = await res.json();
      if (data.success && data.session.user) {
        setUserName(data.session.user.name);
      } else {
        setUserName(null);
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      setUserName(null);
    }
  };

  useEffect(() => {
    fetchSession();

    // Escuchar login/logout global
    const handleUserLogin = () => fetchSession();
    const handleUserLogout = () => setUserName(null);

    window.addEventListener('userLogin', handleUserLogin);
    window.addEventListener('userLogout', handleUserLogout);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
      window.removeEventListener('userLogout', handleUserLogout);
    };
  }, [apiUrl]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // ✅ Logout: limpia userName y dispara evento global
  const handleLogout = () => {
    fetch(`${apiUrl}/api/logout.php`, { credentials: 'include' })
      .finally(() => {
        setUserName(null);
        window.dispatchEvent(new Event('userLogout'));
        window.dispatchEvent(new Event('closeProductForm')); // cerrar formularios de crear vehículo
        navigate('/login');
      });
  };

  // Redirige a login si no hay sesión y guarda la ruta deseada
  const handleCreateProductClick = (e) => {
    if (!userName) {
      e.preventDefault();
      localStorage.setItem('redirectAfterLogin', '/vender-vehiculo');
      navigate('/login');
    } else {
      navigate('/vender-vehiculo/');
    }
  };

  return (
    <header>
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="primary">Bid</span>
          <span className="secondary">My</span>
          <span className="primary">Car</span>
        </Link>

        <nav className="desktop-nav">
          <Link to="/">Subastas</Link>
          <a href="#" className="sell-btn" onClick={handleCreateProductClick}>Vende un Coche</a>
          <a href="#">Comunidad</a>
          <Link to="/sobre-nosotros">¿Qué es BidMyCar?</Link>
          <a href="#">E-mail News</a>
        </nav>

        <div className="search-signup">
          <input type="text" className="search-bar" placeholder="Buscar..." />

          {userName ? (
            <UserDropdown userName={userName} onLogout={handleLogout} />
          ) : (
            <span className="signup-btn">
              <Link to="/login">Log In</Link>
            </span>
          )}

          <div className="burger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'show' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Subastas</Link>
        <a href="#" className="sell-btn" onClick={(e) => { handleCreateProductClick(e); setMenuOpen(false); }}>
          <h1>Vende un Coche</h1>
        </a>
        <a href="#" onClick={() => setMenuOpen(false)}>Comunidad</a>
        <Link to="/sobre-nosotros" onClick={() => setMenuOpen(false)}>¿Qué es BidMyCar?</Link>
        <a href="#" onClick={() => setMenuOpen(false)}>E-mail News</a>
      </div>
    </header>
  );
};

export default Header;
