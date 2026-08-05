const express = require('express');
const router = express.Router();

const authorController = require('../controllers/author.controller.js');
const articlesController = require('../controllers/article.controller.js');


router.get("/", authorController.getAllAuthors);
router.get("/:id", authorController.getAuthorById);
router.get("/:id/articles", articlesController.getArticleByAuthorId);

module.exports = router;