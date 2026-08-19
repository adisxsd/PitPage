import api from './api';

export const commentService = {
  getCommentsByArticle: async (articleId) => {
    const response = await api.get(`/comments/articles/${articleId}`);
    return response.data; 
  },

  createComment: async (articleId, content) => {
    const response = await api.post(`/comments/articles/${articleId}`, { content });
    return response.data; 
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  updateComment: async (commentId, content) => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },
};