import React from "react";
import './Legals.css';

const TermsAndConditions = () => {
  return (
    <div className="legals-container">
      <h1 style={{ color: "#111" }}>Términos y Condiciones de Uso — BidMyCar</h1>
      <p><strong>Última actualización:</strong> 5 de octubre de 2025</p>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>1. Objeto del sitio</h2>
        <p>BidMyCar es una plataforma de subastas de coches para entusiastas, destinada a facilitar la compra y venta de vehículos interesantes. La web es propiedad y está gestionada por <strong>BidMyCar S.L.</strong> (Domicilio: [DIRECCIÓN]; Email: <a href="mailto:info@bidmycar.com">info@bidmycar.com</a>).</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>2. Registro y cuentas de usuario</h2>
        <p>Para participar en subastas es necesario registrarse con datos verídicos. El usuario es responsable de mantener la confidencialidad de su cuenta. BidMyCar puede suspender cuentas que incumplan estas condiciones.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>3. Funcionamiento de las subastas</h2>

        <h3>Para compradores</h3>
        <ul>
          <li>Registro con tarjeta válida y número de teléfono.</li>
          <li>Comisión del 5% sobre el precio final (mínimo 250 € y máximo 7.500 €).</li>
          <li>Las pujas son vinculantes; el mejor postor está obligado a completar la compra si se alcanza la reserva.</li>
          <li>Si hay puja en el último minuto, se reinicia el cronómetro a 1 minuto.</li>
        </ul>

        <h3>Para vendedores</h3>
        <ul>
          <li>Publicar es gratuito.</li>
          <li>El vendedor recibe el 100% del precio final.</li>
          <li>El equipo revisa y aprueba cada anuncio antes de su publicación.</li>
          <li>El vendedor garantiza la veracidad de la información facilitada.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>4. SafePay y pagos</h2>
        <p>BidMyCar ofrece <strong>SafePay</strong> para facilitar pagos seguros. El pago debe completarse en un plazo máximo de 7 días tras finalizar la subasta. La entrega del vehículo solo se realizará tras la recepción del pago completo.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>5. Responsabilidad</h2>
        <p>Los usuarios se comprometen a usar la plataforma de forma legal y honesta. BidMyCar no se responsabiliza por defectos ocultos del vehículo ni por incumplimientos entre comprador y vendedor. La responsabilidad máxima en caso de daños estará limitada, salvo disposición legal en contrario, al importe de la transacción.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>6. Propiedad intelectual</h2>
        <p>Todo el contenido del sitio es propiedad de BidMyCar S.L. o de sus licenciantes. Está prohibido reproducir o distribuir contenido sin autorización.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>7. Modificaciones</h2>
        <p>BidMyCar puede modificar estos términos publicando la versión actualizada en el sitio. El uso continuado del servicio implica aceptación de los cambios.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>8. Legislación aplicable</h2>
        <p>Estos términos se rigen por la legislación española. Para cualquier controversia serán competentes los tribunales de [Ciudad/Provincia] salvo disposición imperativa en contrario.</p>
      </section>

      <section style={{ fontSize: "0.9em", color: "#555", marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "12px", background: "#f7f7f7", paddingLeft: "12px", borderLeft: "4px solid #ccc" }}>
        <p><strong>Nota legal:</strong> Este documento es una versión base preparada para su publicación en la web. Recomendamos revisión legal final por un abogado antes de su uso definitivo.</p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
