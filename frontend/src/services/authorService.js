import api from './api';

export const authorService = {
  // Mengambil Semua Author (Public)
  getAllAuthors: async () => {
    const response = await api.get('/authors');
    return response.data; // Back-End Adis me-return array langsung [...]
  },

  // Mengambil Detail Author berdasarkan ID (Public)
  getAuthorById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data; // Back-End Adis me-return object langsung {...}
  },

  // Mengupdate Author (Protected - Hanya diri sendiri / Admin)
  updateAuthor: async (id, authorData) => {
    // authorData berisi: { name, username, email }
    const response = await api.put(`/authors/${id}`, authorData);
    return response.data;
  },

  // Menghapus Author (Protected - Hanya Admin / Pemilik Akun)
  deleteAuthor: async (id) => {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  },

  // Mengambil Semua Artikel milik Author Tertentu (Public)
  getArticlesByAuthor: async (id) => {
    const response = await api.get(`/authors/${id}/articles`);
    return response.data; // Back-End Adis me-return format { success, data: [...] }
  }
};