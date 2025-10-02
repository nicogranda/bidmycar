import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import { getConfig } from '../../config/env';

function LoginGoogle() {
  const navigate = useNavigate();
  const location = useLocation();
  const { apiUrl } = getConfig();

  const redirectPath = location.state?.redirectTo || '/';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          fetch(`${apiUrl}/api/login-google.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: credentialResponse.credential }),
            credentials: 'include' // <<--- 🔥 clave mágica
          })          
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('user_id', data.user.id);
                console.log("el user_id", data.user_id);
                window.dispatchEvent(new Event('userLogin'));
                navigate(redirectPath);
              } else {
                alert('Login fallido, intente nuevamente.');
              }
            })
            .catch(() => alert('Error en la autenticación.'));
        }}
        onError={() => console.log('Login con Google fallido')}
      />
    </div>
  );
}

export default LoginGoogle;