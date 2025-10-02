import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function LoginGoogle() {
  const navigate = useNavigate();

  return (
 
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log('Google credential:', credentialResponse);
          fetch('http://localhost:8888/bidmycar/backend/api/google-login.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              credential: credentialResponse.credential,
            }),
          })
            .then(res => res.json())
            .then(data => {
              console.log("Respuesta del backend:", data);
              if (data.success) {
                // Guardamos el nombre y el user_id
                localStorage.setItem('userName', data.user.name);
                localStorage.setItem('user_id', data.user.id);
                console.log('user_id guardado en localStorage:', data.user.id);

                // Emitir evento personalizado para que Header se actualice
                window.dispatchEvent(new Event('userLogin'));

                const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
                localStorage.removeItem('redirectAfterLogin');

                navigate(redirectPath);
              } else {
                alert('Login fallido, por favor intente de nuevo.');
              }
            })
            .catch(error => {
              console.error('Error en la autenticación de Google:', error);
              alert('Hubo un problema al intentar iniciar sesión. Por favor, intente nuevamente.');
            });
        }}
        onError={() => {
          console.log('Login con Google fallido');
        }}
      />
    </div>

  );
}

export default LoginGoogle;
