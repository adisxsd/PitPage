const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller.js');
const articleController = require('../controllers/article.controller.js');

router.get("/", categoryController.getAllCategories);
router.get("/:id/articles", articleController.getArticleByCategoryId);

module.exports = router;