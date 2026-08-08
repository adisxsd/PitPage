import api from './api';

export const articleService = {
  // Mengambil Semua Artikel
  getAllArticles: async () => {
    const response = await api.get('/articles');
    return response.data; 
  },

  // Mengambil Artikel Terbaru
  getLatestArticles: async (limit = 5) => {
    const response = await api.get(`/articles/latest?limit=${limit}`);
    return response.data;
  },

  // Mengambil Detail Artikel 
  getArticleBySlug: async (slug) => {
    // Ditambahkan kata '/slug/' di antara /articles/ dan slug-nya
    const response = await api.get(`/articles/slug/${slug}`);
    return response.data;
  },

  // ... (fungsi service lainnya tetap sama seperti sebelumnya)
  createArticle: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  updateArticle: async (slug, updateData) => {
    const response = await api.put(`/articles/${slug}`, updateData);
    return response.data;
  },

  deleteArticle: async (slug) => {
  const response = await api.delete(`/articles/${slug}`);
  return response.data;
  }
};
