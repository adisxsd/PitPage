const articleService = require('../services/article.service.js');

async function getAllArticles(req, res) {
    try {
        const articles = await articleService.getAllArticles();
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getArticleBySlug(req, res) {
    const { slug } = req.params;

    try {
        const article = await articleService.getArticleBySlug(slug);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getArticleByDriverId(req, res) {
    const { id } = req.params;

    try {
        const articles = await articleService.getArticleByDriverId(Number(id));

        if (articles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No articles found for this driver",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get articles by driver successfully",
            data: articles,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);

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

        if (articles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No articles found for this category",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Get articles by category successfully",
            data: articles,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

async function getArticleByAuthorId(req, res) {
    const { id } = req.params;
    try {
        const articles = await articleService.getArticleByAuthorId(Number(id));

        if (articles.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No articles found for this author",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Get articles by author successfully",
            data: articles,
        });
    } catch (error) {
        console.error("Error fetching articles:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

async function findLatestArticles(req, res) {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    try {
        const articles = await articleService.findLatestArticles(limit);
        res.status(200).json({
            success: true,
            message: "Get latest articles successfully",
            data: articles,
        });
    } catch (error) {
        console.error("Error fetching latest articles:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};


async function createArticle(req, res) {
    try {
        const article = await articleService.createArticle(req.body);
        res.status(201).json({
            success: true,
            message: "Article created successfully",
            data: article,
        });
    }
        catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    };
};

async function updateArticle(req, res) {
    const { slug } = req.params;
    const data = req.body;

    try {
        const article = await articleService.updateArticle(slug, data);
        res.status(200).json({
            success: true,
            message: "Article updated successfully",
            data: article,
        });
    } catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

async function deleteArticle(req, res) {
    const { slug } = req.params;
    try {
        const article = await articleService.deleteArticle(slug);
        res.status(200).json({
            success: true,
            message: "Article deleted successfully",
            data: article,
        });
    } catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    getAllArticles,
    getArticleBySlug,
    getArticleByDriverId,
    getArticleByCategoryId,
    getArticleByAuthorId,
    createArticle,
    findLatestArticles,
    updateArticle,
    deleteArticle,
};