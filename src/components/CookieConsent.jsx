import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#222',
      color: '#fff',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.9rem',
      zIndex: 9999
    }}>
      <span>
        Usamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas su uso.
      </span>
      <button 
        onClick={acceptCookies} 
        style={{
          backgroundColor: 'var(--color-primary)',
          border: 'none',
          color: 'white',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}
      >
        Aceptar
      </button>
    </div>
  );
};

export default CookieConsent;
