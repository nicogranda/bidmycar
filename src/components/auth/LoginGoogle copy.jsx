// src/components/auth/LoginGoogle.jsx
import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { getConfig } from "../../config/env";
import { useAuth } from "./AuthContext"; // 🔹 Importa el contexto

function LoginGoogle({ mode = "login" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { apiUrl } = getConfig();
  const { setUser } = useAuth(); // 🔹 Actualiza el estado global

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    try {
      const res = await fetch(`${apiUrl}/api/auth/login-google.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
        credentials: "include", // 🔑 mantiene la sesión en cookies
      });

      const data = await res.json();

      if (!data.success) {
        alert("Login fallido, intente nuevamente.");
        return;
      }

      // 🔹 Actualiza AuthContext inmediatamente
      setUser(data.user);

      // 🔹 Determinar redirect seguro
      let redirectTo = "/";
      let stateData = {};

      if (location.state?.redirectTo) {
        redirectTo = location.state.redirectTo;
        stateData = { vehicle_id: location.state.vehicle_id, seller_id: location.state.seller_id };
      } else if (localStorage.getItem("redirectUrl")) {
        redirectTo = localStorage.getItem("redirectUrl");
        try {
          stateData = JSON.parse(localStorage.getItem("redirectData") || "{}");
        } catch {}
      }

      // 🔹 Limpiar datos temporales
      localStorage.removeItem("redirectUrl");
      localStorage.removeItem("redirectData");

      console.log("🔁 Redirigiendo a:", redirectTo, stateData);

      // 🔹 Redirigir con estado
      navigate(redirectTo, { replace: true, state: stateData });

    } catch (err) {
      console.error("Error en autenticación Google:", err);
      alert("Error inesperado en la autenticación.");
    }
  };

  const handleError = () => {
    console.error("Login con Google fallido");
    alert("No se pudo iniciar sesión con Google.");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default LoginGoogle;
