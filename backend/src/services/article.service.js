const articleRepository = require('../repositories/article.repository.js');

async function getAllArticles() {
    const articles = await articleRepository.findAll();

    return articles;
};

async function getArticleBySlug(slug) {
    const articles = await articleRepository.findBySlug(slug);

    return articles;
};

async function getArticleByDriverId(driverId) {
    const articles = await articleRepository.findByDriverId(driverId);

    if (articles.length === 0) {
        throw new Error("No articles found");
    }
    return articles;
}

async function getArticleByCategoryId(categoryId) {
    const articles = await articleRepository.findByCategoryId(categoryId);

    if (articles.length === 0) {
        throw new Error("No articles found");
    }
    return articles;
};

async function getArticleByAuthorId(authorId) {
    const articles = await articleRepository.findByAuthorId(authorId);

    if (articles.length === 0) {
        throw new Error("No articles found");
    }
    return articles;
};

async function findLatestArticles(limit = 5) {
    const articles = await articleRepository.findLatestArticles(limit);
    return articles;
};

async function createArticle(data) {
    const article = await articleRepository.createArticle(data);
    return article;
};

async function updateArticle(slug, data) {
    const article = await articleRepository.updateArticle(slug, data);
    return article;
};

async function deleteArticle(slug) {
    const article = await articleRepository.deleteArticle(slug);
    return article;
}

module.exports = {
    getAllArticles,
    getArticleBySlug,
    getArticleByDriverId,
    getArticleByCategoryId,
    getArticleByAuthorId,
    findLatestArticles,
    createArticle,
    updateArticle,
    deleteArticle,
};

