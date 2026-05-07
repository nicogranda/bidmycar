// src/components/auth/LoginProviders.jsx
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "./LoginGoogle";
// import LoginFacebook from "./LoginFacebook";
// import LoginApple from "./LoginApple";

const clientId = "697331076459-dpugbu7lrcke69o8q5asgdm7e51kfv7n.apps.googleusercontent.com";

function LoginProviders({ mode = "login", onSuccess }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <LoginGoogle mode={mode} onSuccess={onSuccess} />
      </div>
    </GoogleOAuthProvider>
  );
}


export default LoginProviders;
