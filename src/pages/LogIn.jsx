// src/pages/LogIn.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/auth/AuthContext";
import LoginProviders from "../components/auth/LoginProviders";

function LogIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Ruta a la que volver tras login
  // const from = location.state?.from?.pathname || "/";
  const from = location.state?.from || { pathname: "/" }; // no solo pathname
   navigate(from.pathname, { replace: true, state: from.state });


  const handleLoginSuccess = async (userData) => {
    await login(userData);
    navigate(from, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email login aún no implementado:", email, password);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
      <div style={{ margin: "2rem 0" }}>
        <LoginProviders
          mode="login"
          onSuccess={handleLoginSuccess}
        />
      </div>
    </div>
  );
}

export default LogIn;
