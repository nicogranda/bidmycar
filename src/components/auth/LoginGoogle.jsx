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
            .then(res => res.json())  // Aquí esperamos la respuesta del backend
            .then(data => {
              console.log("Respuesta del backend:", data);
              if (data.success) {
                localStorage.setItem('userName', data.user.name); // <-- Guardamos el nombre
                // 🔥 Emitir evento personalizado para que Header se actualice
                window.dispatchEvent(new Event('userLogin'));
                //navigate('/');
                const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
                localStorage.removeItem('redirectAfterLogin');
            
                navigate(redirectPath);
              } else {
                alert('Login fallido, por favor intente de nuevo.');
              }
            })
            
            // .then(data => {
            //   //
            //   if (data.success) {
            //     // Si la respuesta es exitosa, redirigimos a la página de sign-up
            //     navigate('/');
            //   } else {
            //     // Si hay un error en el login, mostramos una alerta
            //     alert('Login fallido, por favor intente de nuevo.');
            //   }
            // })
            // //
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