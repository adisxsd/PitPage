import api from './api';

export const authorService = {
  getAllAuthors: async () => {
    const response = await api.get('/authors');
    return response.data;
  },

  getAuthorById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  getArticlesByAuthor: async (id) => {
    const response = await api.get(`/articles/author/${id}`);
    return response.data;
  },

  updateAuthor: async (id, data) => {
    const response = await api.put(`/authors/${id}`, data);
    return response.data;
  },

  // Menghapus author (Admin Only)
  deleteAuthor: async (id) => {
    const response = await api.delete(`/authors/${id}`);
    return response.data;
  }
};