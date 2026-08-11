import api from './api';

export const articleService = {
  getAllArticles: async () => {
    const response = await api.get('/articles');
    return response.data; 
  },

  getLatestArticles: async (limit = 5) => {
    const response = await api.get(`/articles/latest?limit=${limit}`);
    return response.data;
  },

  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/slug/${slug}`);
    return response.data;
  },

createArticle: async (formData) => {
    const response = await api.post('/articles', formData);
    return response.data;
  },

  updateArticle: async (slug, formData) => {
    const response = await api.put(`/articles/${slug}`, formData);
    return response.data;
  },

  deleteArticle: async (slug) => {
    const response = await api.delete(`/articles/${slug}`);
    return response.data;
  }
};