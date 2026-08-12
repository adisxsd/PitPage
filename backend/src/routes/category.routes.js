const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller.js');
const articleController = require('../controllers/article.controller.js');
const requireAdmin = require('../middlewares/role.middleware.js');
const authenticateToken = require('../middlewares/auth.middleware.js');

router.get("/", authenticateToken, categoryController.getAllCategories);
router.get("/:id/articles", authenticateToken, articleController.getArticleByCategoryId);
router.post("/", authenticateToken, requireAdmin, categoryController.createCategory);
router.put("/:id", authenticateToken, requireAdmin, categoryController.updateCategory);
router.delete("/:id", authenticateToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;