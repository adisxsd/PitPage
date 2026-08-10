import api from './api';

export const commentService = {
  // Mengambil semua komentar di artikel (Public)
  getCommentsByArticle: async (articleId) => {
    const response = await api.get(`/comments/articles/${articleId}`);
    // Endpoint Adis langsung mengembalikan array [...] untuk GET ini
    return response.data; 
  },

  // Membuat komentar baru (Protected)
  createComment: async (articleId, content) => {
    const response = await api.post(`/comments/articles/${articleId}`, { content });
    return response.data; // Mengembalikan { success, message, data }
  },

  // Menghapus komentar (Protected)
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Mengubah komentar (Protected)
  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
};