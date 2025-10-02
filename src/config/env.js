// src/config/env.jsx
// const environment = process.env.REACbT_APP_ENV || 'production'; 
const environment = process.env.REACT_APP_ENV || 'development'; 
const config = {
  development: {
    apiUrl: 'http://localhost:8888/bidmycar/backend',
    frontendUrl: 'http://localhost:3000',
  },
  production: {
    apiUrl: 'https://bidmycar.es/backend',
    frontendUrl: 'https://bidmycar.es',
  },
};

export const getConfig = () => config[environment];