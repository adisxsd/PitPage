import axios from 'axios';

// Membuat instance Axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'http://127.0.0.1:3000', // Gunakan titik dua (:), bukan garis miring (/)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Menempelkan Token secara otomatis ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // Sesuai permintaan Adis: "Authorization: Bearer <JWT_TOKEN>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;