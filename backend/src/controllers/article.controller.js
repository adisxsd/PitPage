const articleService = require("../services/article.service.js");


async function getAllArticles(req, res) {
    try {
        const articles = await articleService.getAllArticles();

        return res.status(200).json({
            success: true,
            message: "Get all articles successfully",
            data: articles,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function getArticleBySlug(req, res) {
    const { slug } = req.params;

    try {
        const article = await articleService.getArticleBySlug(slug);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get article successfully",
            data: article,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function getArticleByDriverId(req, res) {
    const { id } = req.params;

    try {
        const articles = await articleService.getArticleByDriverId(Number(id));

        return res.status(200).json({
            success: true,
            message: "Get articles by driver successfully",
            data: articles,
        });

    } catch (error) {

        if (error.message === "No articles found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function getArticleByCategoryId(req, res) {
    const { id } = req.params;

    try {
        const articles = await articleService.getArticleByCategoryId(Number(id));

        return res.status(200).json({
            success: true,
            message: "Get articles by category successfully",
            data: articles,
        });

    } catch (error) {

        if (error.message === "No articles found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function getArticleByAuthorId(req, res) {
    const { id } = req.params;

    try {
        const articles = await articleService.getArticleByAuthorId(Number(id));

        return res.status(200).json({
            success: true,
            message: "Get articles by author successfully",
            data: articles,
        });

    } catch (error) {

        if (error.message === "No articles found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function findLatestArticles(req, res) {
    const limit = req.query.limit
        ? parseInt(req.query.limit)
        : 5;

    try {
        const articles = await articleService.findLatestArticles(limit);

        return res.status(200).json({
            success: true,
            message: "Get latest articles successfully",
            data: articles,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function createArticle(req, res) {
    try {
        const article = await articleService.createArticle(
            req.body,
            req.file
        );

        return res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: article,
        });

    } catch (error) {
        console.error("Error creating article:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function updateArticle(req, res) {
    const { slug } = req.params;

    try {

        const article = await articleService.updateArticle(
            slug,
            req.body,
            req.file
        );

        return res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: article,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


async function deleteArticle(req, res) {
    const { slug } = req.params;

    try {

        const article = await articleService.deleteArticle(slug);

        return res.status(200).json({
            success: true,
            message: "Article deleted successfully",
            data: article,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
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