import React from "react";
import './Legals.css';
const CookiePolicy = () => {
  return (
    <div className="legals-container">
      <h1 style={{ color: "#111" }}>Política de Cookies — BidMyCar</h1>
      <p><strong>Última actualización:</strong> 5 de octubre de 2025</p>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Qué son las cookies</h2>
        <p>Las cookies son pequeños archivos que se almacenan en tu dispositivo para mejorar la experiencia, analizar uso y personalizar funcionalidades.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Tipos de cookies que utilizamos</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "8px", border: "1px solid #eee", textAlign: "left" }}>Categoría</th>
              <th style={{ padding: "8px", border: "1px solid #eee", textAlign: "left" }}>Propósito</th>
              <th style={{ padding: "8px", border: "1px solid #eee", textAlign: "left" }}>Ejemplos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Técnicas / necesarias</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Permiten el funcionamiento básico de la plataforma</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Sesión, autenticación</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Analíticas</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Medir y analizar el tráfico</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Google Analytics</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Personalización</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Recordar preferencias de idioma y vista</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Preferencias de usuario</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Marketing</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Publicidad y seguimiento de campañas</td>
              <td style={{ padding: "8px", border: "1px solid #eee" }}>Pixels publicitarios</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Gestión del consentimiento</h2>
        <p>Al acceder a BidMyCar verás un banner para aceptar, rechazar o configurar cookies. Las cookies necesarias se aplicarán siempre; las demás requieren tu consentimiento.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Cómo desactivar las cookies</h2>
        <p>Puedes desactivar o eliminar cookies desde la configuración de tu navegador; consulta la ayuda del navegador para instrucciones. Ten en cuenta que algunas funciones podrían dejar de funcionar correctamente.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Cookies de terceros</h2>
        <p>Utilizamos servicios de terceros como Google Analytics, YouTube y proveedores de pago. Sus políticas de privacidad y cookies son externas a BidMyCar.</p>
      </section>

        <p>Fecha de última revisión: 5 de octubre de 2025.</p>
 
    </div>
  );
};

export default CookiePolicy;
