import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false, // Status apakah user sudah login
  isModalOpen: false,     // Status apakah pop-up terbuka
  modalView: 'login',     // Menentukan form yang tampil ('login' atau 'register')

  // Fungsi navigasi pop-up
  openModal: (view = 'login') => set({ isModalOpen: true, modalView: view }),
  closeModal: () => set({ isModalOpen: false }),
  setModalView: (view) => set({ modalView: view }),
  
  // Fungsi simulasi aksi
  login: () => set({ isAuthenticated: true, isModalOpen: false }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;