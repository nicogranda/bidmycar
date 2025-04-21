//GoogleSingIn
// import React, { useEffect } from 'react';

// const GoogleSignIn = () => {
//   useEffect(() => {
//     window.gapi.load('auth2', () => {
//       window.gapi.auth2.init({
//         client_id: 'TU_CLIENT_ID', // Reemplaza con tu propio Client ID
//       });
//     });
//   }, []);

//   const onSignIn = (googleUser) => {
//     const profile = googleUser.getBasicProfile();
//     const id_token = googleUser.getAuthResponse().id_token;

//     console.log('ID Token:', id_token);
//     // Envía el token al backend para verificar la autenticidad del usuario
//   };

//   return (
//     <div>
//       <div className="g-signin2" data-onsuccess={onSignIn}></div>
//     </div>
//   );
// };

// export default GoogleSignIn;
//GoogleSingIn
import React, { useEffect } from 'react';

const GoogleSignIn = () => {
  useEffect(() => {
    const start = () => {
      const auth2 = window.gapi.auth2.init({
        client_id: '697331076459-dpugbu7lrcke69o8q5asgdm7e51kfv7n.apps.googleusercontent.com', // Reemplaza con tu client ID completo
      });

      auth2.attachClickHandler(
        document.getElementById('googleButton'),
        {},
        googleUser => {
          const profile = googleUser.getBasicProfile();
          const name = profile.getName();
          const email = profile.getEmail();
          const id_token = googleUser.getAuthResponse().id_token;

          // Guardar en localStorage
          localStorage.setItem('userName', name);
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userToken', id_token);

          // Emitir evento para que Header actualice estado
          window.dispatchEvent(new CustomEvent('userLogin'));

          // Enviar el token al backend
          fetch('http://localhost:8888/bidmycar/backend/api/google-login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: id_token }), // Asegúrate de que 'id_token' es el token de Google
            credentials: 'include', // Si estás utilizando cookies o sesiones
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log('Usuario verificado en backend:', data.user);
            } else {
                console.error('Error desde backend:', data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
        
        },
        error => {
          console.error('❌ Google Sign-In error:', error);
        }
      );
    };

    // Cargar GAPI
    window.gapi.load('auth2', start);
  }, []);

  return (
    <div id="googleButton" style={{ cursor: 'pointer' }}>
      <img
        src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
        alt="Google Sign-In"
        width="180"
      />
    </div>
  );
};

export default GoogleSignIn;

