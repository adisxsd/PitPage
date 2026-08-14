import api from './api';

export const articleService = {
  getAllArticles: async (searchKeyword = '') => {
    const config = searchKeyword ? { params: { search: searchKeyword } } : {};
    const response = await api.get('/articles', config);
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

  getArticlesByDriver: async (driverId) => {
    const response = await api.get(`/articles/driver/${driverId}`);
    return response.data;
  },

  getArticlesByAuthor: async (authorId) => {
    const response = await api.get(`/articles/author/${authorId}`);
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