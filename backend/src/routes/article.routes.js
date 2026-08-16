const express = require("express");
const router = express.Router();

const articleController = require("../controllers/article.controller.js");
const authorController = require("../controllers/author.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/upload.middleware.js");


router.get("/", articleController.getAllArticles);
router.get("/author/:id", articleController.getArticleByAuthorId);
router.get("/slug/:slug", articleController.getArticleBySlug);
router.post(
    "/",
    authenticateToken,
    upload.single('thumbnail'),
    articleController.createArticle
);

router.get("/latest", articleController.findLatestArticles);
router.put(
    "/:slug",
    authenticateToken,
    upload.single('thumbnail'),
    articleController.updateArticle
);

router.delete(
    "/:slug",
    authenticateToken,
    articleController.deleteArticle
);
module.exports = router;