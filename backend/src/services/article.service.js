const articleRepository = require('../repositories/article.repository.js');
const cloudinary = require('../config/cloudinary.js');
const streamifier = require('streamifier');



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

async function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'pitpage/articles' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};

async function createArticle(data, file) {

    let thumbnail = null;

    if (file) {
        thumbnail = await uploadToCloudinary(file);
    }

    const article = await articleRepository.createArticle({
        title: data.title,
        slug: data.slug,
        content: data.content,
        thumbnail: thumbnail,
        authorId: Number(data.authorId),
        categoryId: Number(data.categoryId),
        driverId: Number(data.driverId),
    });

    return article;
}

async function updateArticle(slug, data, file) {
    const articleData = {
        title: data.title,
        slug: data.slug,
        content: data.content,
        authorId: Number(data.authorId),
        categoryId: Number(data.categoryId),
        driverId: Number(data.driverId),
        status: data.status,
    };
    if (file) {
        const result = await uploadToCloudinary(file);
        articleData.thumbnail = result.secure_url;
    }
    const article = await articleRepository.updateArticle(slug, articleData);
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
    uploadToCloudinary
};

