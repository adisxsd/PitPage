const commentRepository = require('../repositories/comment.repository.js');

async function getCommentsByArticleId(articleId) {
    return await commentRepository.getCommentsByArticleId(
        Number(articleId)
    );
}

async function createComment(commentData) {
    return await commentRepository.createComment(commentData);
}

async function deleteComment(commentId, userId, role) {
    const comment = await commentRepository.findById(
        Number(commentId)
    );

    if (!comment) {
        throw new Error("Comment not found");
    }

    if (role !== "ADMIN" && comment.userId !== userId) {
        throw new Error("You can only delete your own comment");
    }

    return await commentRepository.deleteComment(
        Number(commentId)
    );
}

async function getCommentById(commentId) {
    return await commentRepository.getCommentById(
        Number(commentId)
    );
}

async function updateComment(commentId, userId, role, commentData) {
    const comment = await commentRepository.findById(
        Number(commentId)
    );

    if (!comment) {
        throw new Error("Comment not found");
    }

    // ADMIN boleh mengedit komentar siapa pun
    // AUTHOR hanya boleh mengedit komentar sendiri
    if (role !== "ADMIN" && comment.userId !== userId) {
        throw new Error("You can only edit your own comment");
    }

    return await commentRepository.updateComment(
        Number(commentId),
        commentData
    );
}

async function findCommentsByUserId(userId) {
    return await commentRepository.findCommentsByUserId(
        Number(userId)
    );
}

module.exports = {
    getCommentsByArticleId,
    createComment,
    deleteComment,
    getCommentById,
    updateComment,
    findCommentsByUserId,
};