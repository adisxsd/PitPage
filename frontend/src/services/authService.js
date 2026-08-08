import api from './api'; // Memanggil konfigurasi axios yang sudah kita buat

export const authService = {
  login: async (username, password) => {
    // Sesuai daftar endpoint di awal: POST /auth/login
    const response = await api.post('/auth/login', { username, password });
    return response.data; 
  },
  
  register: async (name, username, email, password) => {
    // Sesuai daftar endpoint di awal: POST /auth/register
    const response = await api.post('/auth/register', { name, username, email, password });
    return response.data;
  }
};