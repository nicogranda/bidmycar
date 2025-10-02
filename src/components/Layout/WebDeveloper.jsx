import React from 'react';
import './WebDeveloper.css'; // Asegúrate de definir los estilos

const WebDeveloper = () => {
  return (
      <a href="https://ikusa.net" target="_blank" rel="noopener noreferrer" title="Ikusa Diseño y Desarrollo de Páginas Web">
      <img 
        src={`${process.env.PUBLIC_URL}/images/ikusa-paginas-web.svg`} 
        className="agency" 
        alt="Ikusa Diseño de Páginas Web" 
        />
      </a>
 
  );
};

export default WebDeveloper;
