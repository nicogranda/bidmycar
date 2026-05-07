import React, { useState } from "react";
import { getConfig } from '../config/env';  

const EmailForm = () => {
  const { apiUrl } = getConfig();
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    body: "",
    fromName: "",
    fromEmail: "",
  });

  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
  
    const formBody = new URLSearchParams(formData).toString();
  
    try {
      const response = await fetch(`${apiUrl}/index.php?page=marketing&action=Email`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });
  
      // Primero lee el texto crudo
      const text = await response.text();
      console.log("Raw server response:", text);
  
      // Luego parsea seguro
      let result;
      try {
        result = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON:", err);
        setStatus("Server returned invalid JSON ❌");
        return;
      }
  
      console.log("Parsed JSON:", result);
  
      if (result.success) {
        setStatus("Email sent successfully ✅");
      } else {
        setStatus("Failed to send email ❌");
      }
  
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus("Connection error ❌");
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Enviar Email Comercial</h2>

      <label>
        De (Nombre):
        <input
          type="text"
          name="fromName"
          value={formData.fromName}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        De (Email):
        <input
          type="email"
          name="fromEmail"
          value={formData.fromEmail}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Para:
        <input
          type="email"
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Asunto:
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Mensaje:
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          required
          rows={8}
        />
      </label>

      <button type="submit">Enviar Email</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default EmailForm;
