import { create } from 'zustand';
import { authService } from '../services/authService';

const useAuthStore = create((set) => ({
  isAuthenticated: !!localStorage.getItem('token'), 
  user: JSON.parse(localStorage.getItem('user')) || null, 
  isModalOpen: false,     
  modalView: 'login',     

  openModal: (view = 'login') => set({ isModalOpen: true, modalView: view }),
  closeModal: () => set({ isModalOpen: false }),
  setModalView: (view) => set({ modalView: view }),
  
  login: async (username, password) => {
    try {
      const response = await authService.login(username, password);

      // Mengambil token & user, baik jika ada di response.data maupun di root response
      const token = response?.data?.token || response?.token;
      const user = response?.data?.user || response?.user;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        set({ isAuthenticated: true, user: user, isModalOpen: false });
        return { success: true };
      }

      return { 
        success: false, 
        message: response?.message || 'Login gagal, token tidak ditemukan.' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Gagal login ke Paddock.' 
      };
    }
  },

  // Fungsi Register
  register: async (name, username, email, password) => {
    try {
      await authService.register(name, username, email, password);
      set({ modalView: 'login' });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Gagal membuat akun.' 
      };
    }
  },

  // Fungsi Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ isAuthenticated: false, user: null });
  },
}));

export default useAuthStore;