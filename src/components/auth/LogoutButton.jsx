import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return <button onClick={handleLogout}>Cerrar sesión</button>;
};

export default LogoutButton;
