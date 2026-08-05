const express = require("express");
const router = express.Router();

const articleController = require("../controllers/article.controller.js");

router.get("/", articleController.getAllArticles);
router.get("/slug/:slug", articleController.getArticleBySlug);
router.post("/", articleController.createArticle);
router.get("/latest", articleController.findLatestArticles);
router.put("/update/:slug", articleController.updateArticle);
router.delete("/delete/:slug", articleController.deleteArticle);
module.exports = router;