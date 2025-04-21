// src/components/Footer.js
import React from 'react';
//import React, { useState, useEffect } from 'react';
import WebDeveloper from './WebDeveloper';
import './Footer.css'; // Asegúrate de definir los estilos

function Footer({
  user_facebook,
  user_instagram,
  user_youtube,
  user_tiktok,
  address,
  city,
  state,
  zip,
  country,
  phone,
  brand,
  services = [],
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-text-color">

      <section className="footer-container-info">
        <div className="footer-info">
          <p className="footer-title-info">Contacto</p>
          <span>
            {address}<br />
            {city}<br />
            {`${state}, ${zip}, ${country}`}<br />
            {phone}<br />
          </span>
        </div>

        <div className="footer-info">
          <p className="footer-title-info">Aspectos Legales</p>
          <ul className="no-bullets">
            <li><a href="/legal/privacy_policy.php" target="_blank" rel="noopener noreferrer">Política de Privacidad</a></li>
            <li><a href="/legal/terms_and_conditions.php" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a></li>
            <li><a href="/legal/cookie_policy.php" target="_blank" rel="noopener noreferrer">Política de Cookies</a></li>
          </ul>
        </div>

        <div className="footer-info">
          <p className="footer-title-info">Vendedores</p>
          <ul className="no-bullets">
            {services.map((service, index) => (
              <li key={index}>
                <a href={service} title={service}>{service}</a>
              </li>
            ))}
          </ul>
        </div>

    
        <div className="footer-rrss">
          <a href={`https://facebook.com/${user_facebook}`} target="_blank" rel="noopener noreferrer" title={`facebook.com/${user_facebook}`}>
            <i className="fab fa-facebook"></i>
          </a>
          <a href={`https://instagram.com/${user_instagram}`} target="_blank" rel="noopener noreferrer" title={`instagram.com/${user_instagram}`}>
            <i className="fab fa-instagram"></i>
          </a>
          <a href={`https://youtube.com/${user_youtube}`} target="_blank" rel="noopener noreferrer" title={`youtube.com/${user_youtube}`}>
            <i className="fab fa-youtube"></i>
          </a>
          <a href={`https://tiktok.com/@${user_tiktok}`} target="_blank" rel="noopener noreferrer" title={`tiktok.com/@${user_tiktok}`}>
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
    

      </section>

      <section className="copyright">
        <div id="copyright-year">&copy; {currentYear}</div>
        <div className="brand">{brand}<span style={{ fontFamily: 'var(--font-principal)', fontSize: '24px' }}>&reg;</span></div><br />
        <div className="developer">
          <WebDeveloper />
        </div>
      </section>
  
    </footer>
       
  );
}

export default Footer;
