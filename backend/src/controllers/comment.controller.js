const commentService = require('../services/comment.service.js');

async function getCommentsByArticleId(req, res) {
    const { articleId } = req.params;
    try {
        const comments = await commentService.getCommentsByArticleId(articleId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }  
};

async function createComment(req, res) {
    const { articleId } = req.params;
    const { content } = req.body;

    try {
        const comment = await commentService.createComment({
            articleId: Number(articleId),
            userId: req.user.id,
            content,
        });

        return res.status(201).json({
            success: true,
            message: "Comment created successfully",
            data: comment,
        });
    } catch (error) {
        console.error("Error creating comment:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

async function deleteComment(req, res) {
    const { commentId } = req.params;

    try {
        const comment = await commentService.deleteComment(
            commentId,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: comment,
        });
    } catch (error) {
        if (error.message === "Comment not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "You can only delete your own comment") {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Error deleting comment:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

async function getCommentById(req, res) {
    const { commentId } = req.params;
    try {
        const comment = await commentService.getCommentById(commentId);
        res.status(200).json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
async function updateComment(req, res) {
    const { commentId } = req.params;
    const commentData = req.body;
    try {
        const updatedComment = await commentService.updateComment(commentId, commentData);
        res.status(200).json(updatedComment);
    } catch (error) {
        if (error.message === "Comment not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "You can only edit your own comment") {
            return res.status(403).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Error deleting comment:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
async function findCommentsByUserId(req, res) {
    const { userId } = req.params;
    try {
        const comments = await commentService.findCommentsByUserId(userId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments by user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getCommentsByArticleId,
    createComment,
    deleteComment,
    getCommentById,
    updateComment,
    findCommentsByUserId
};