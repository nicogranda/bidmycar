import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserName = () => {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName);
      }
    };

    loadUserName();

    window.addEventListener('userLogin', loadUserName);

    return () => {
      window.removeEventListener('userLogin', loadUserName);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
    window.dispatchEvent(new Event('userLogout'));
    // window.dispatchEvent(new Event('closeProductForm')); // Cerrar formulario en creación de producto
  };

  const handleCreateProductClick = (e) => {
    if (!userName) {
      e.preventDefault();
      localStorage.setItem('redirectAfterLogin', '/sell-car');
      navigate('/login');
    } else {
      navigate('/sell-car/');
    }
  };
  
  return (
    <header>
      <div className="header-inner">
        <Link to="/" className="logo">BidMyCar</Link>

        <nav className="desktop-nav">
          <a href="#">Subasta</a>
          <a href="#" onClick={handleCreateProductClick}>Vende un Coche</a> {/* Cambié el Link por un <a> */}
          <a href="#">Comunidad</a>
          <a href="#">¿Qué es BidMyCar?</a>
          <a href="#">E-mail News</a>
        </nav>

        <div className="search-signup">
          <input type="text" className="search-bar" placeholder="Buscar..." />
          
          {userName ? (
            <>
              <span className="user-welcome">Hola, {userName}</span>
              <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <span className="signup-btn"><Link to="/login">Log In</Link></span>
          )}

          <div className="burger" onClick={toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <div className={`mobile-nav ${menuOpen ? 'show' : ''}`}>
        <a href="#">Subasta</a>
        <a href="#" onClick={handleCreateProductClick}>Vende un Coche</a> {/* Cambié el Link por un <a> */}
        <a href="#">Comunidad</a>
        <a href="#">¿Qué es BidMyCar?</a>
        <a href="#">E-mail News</a>
      </div>
    </header>
  );
};

export default Header;
