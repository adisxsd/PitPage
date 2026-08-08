const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.controller.js');
const authenticateToken = require('../middlewares/auth.middleware.js');

router.get('/articles/:articleId', commentController.getCommentsByArticleId);
router.post('/articles/:articleId', authenticateToken, commentController.createComment);
router.delete('/:commentId', authenticateToken, commentController.deleteComment);
router.get('/:commentId', commentController.getCommentById);
router.put('/:commentId', authenticateToken, commentController.updateComment);
router.get('/user/:userId', authenticateToken, commentController.findCommentsByUserId);

module.exports = router;
