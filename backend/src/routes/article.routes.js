const express = require("express");
const router = express.Router();

const articleController = require("../controllers/article.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

router.get("/", articleController.getAllArticles);
router.get("/slug/:slug", articleController.getArticleBySlug);
router.post(
    "/",
    authenticateToken,
    articleController.createArticle
);
router.get("/latest", articleController.findLatestArticles);
router.put(
    "/:slug",
    authenticateToken,
    articleController.updateArticle
);

router.delete(
    "/:slug",
    authenticateToken,
    articleController.deleteArticle
);
module.exports = router;