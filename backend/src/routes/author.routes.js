const express = require('express');
const router = express.Router();

const authorController = require('../controllers/author.controller.js');
const articlesController = require('../controllers/article.controller.js');
const role = require("../middlewares/role.middleware.js");
const authenticateToken = require('../middlewares/auth.middleware.js');
const requireAdmin = require('../middlewares/role.middleware.js');



router.get("/", requireAdmin, authorController.getAllAuthors);
router.get("/:id", authorController.getAuthorById);
router.get("/:id/articles", articlesController.getArticleByAuthorId);
router.put("/:id", authenticateToken, authorController.updateAuthor);
router.delete("/:id", authenticateToken, authorController.deleteAuthor);

module.exports = router;