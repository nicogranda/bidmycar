import React from "react";
import './Legals.css';

const PrivacyPolicy = () => {
  return (
    <div className="legals-container">

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>Responsable</h2>
        <p>BidMyCar S.L. — Email: <a href="mailto:info@bidmycar.com">info@bidmycar.com</a></p>
        <p>Esta política cumple con el Reglamento (UE) 2016/679 (GDPR) y la normativa española aplicable.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>1. Datos que recopilamos</h2>
        <ul>
          <li>Datos de identificación y contacto: nombre, apellidos, email, teléfono.</li>
          <li>Datos de registro y pago: tarjeta (tokenizada), facturación.</li>
          <li>Datos del vehículo: matrícula, VIN, características, fotos e historial.</li>
          <li>Datos técnicos y de comportamiento: IP, cookies, registros de acceso.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>2. Finalidades y bases legales</h2>
        <ul>
          <li>Gestión y ejecución del servicio de subastas — <em>ejecución de contrato</em>.</li>
          <li>Comunicación con usuarios y notificaciones — <em>interés legítimo / consentimiento</em>.</li>
          <li>Marketing y promociones — <em>consentimiento</em>.</li>
          <li>Prevención de fraude y seguridad — <em>interés legítimo</em>.</li>
          <li>Cumplimiento de obligaciones legales (fiscales, contables) — <em>obligación legal</em>.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>3. Conservación</h2>
        <p>Los datos se conservan mientras la cuenta esté activa y según obligaciones legales (por ejemplo, conservación fiscal durante 5 años). Cuando los datos ya no sean necesarios serán eliminados o anonimizados.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>4. Destinatarios</h2>
        <p>Podemos compartir datos con proveedores de hosting, pasarelas de pago, servicios de correo, proveedores de análisis y autoridades legales cuando proceda. En caso de transferencias fuera de la UE adoptaremos garantías adecuadas (cláusulas contractuales tipo u otros mecanismos legales).</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>5. Derechos</h2>
        <p>Puedes ejercitar los derechos de acceso, rectificación, supresión, limitación, oposición, portabilidad y retirada del consentimiento enviando tu solicitud a <a href="mailto:info@bidmycar.com">info@bidmycar.com</a>. También puedes presentar una reclamación ante la AEPD.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>6. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas razonables: cifrado SSL, controles de acceso, backups, y políticas internas de seguridad para proteger tus datos.</p>
      </section>

      <section style={{ marginBottom: "18px" }}>
        <h2 style={{ color: "#111" }}>7. Menores</h2>
        <p>El servicio no está dirigido a menores de 16 años. Si tenemos conocimiento de que se han recabado datos de un menor sin el consentimiento apropiado, los eliminaremos.</p>
      </section>

      <article style={{ fontSize: "0.9em", color: "#555", marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "12px" }}>
        <p>Fecha de última revisión: 5 de octubre de 2025. Recomendamos conservar esta página para tu referencia y revisar periódicamente las actualizaciones.</p>
      </article>
    </div>
  );
};

export default PrivacyPolicy;
