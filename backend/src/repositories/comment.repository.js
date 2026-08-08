const prisma = require('../config/prisma.js');

async function getCommentsByArticleId(articleId) {
    return await prisma.comment.findMany({
        where: {
            articleId: Number(articleId),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

async function createComment(commentData) {
    return await prisma.comment.create({
        data: {
            content: commentData.content,

            article: {
                connect: {
                    id: commentData.articleId,
                },
            },

            user: {
                connect: {
                    id: commentData.userId,
                },
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
    });
}

async function findById(commentId) {
    return await prisma.comment.findUnique({
        where: {
            id: Number(commentId),
        },
    });
}

async function deleteComment(commentId) {
    return await prisma.comment.delete({
        where: {
            id: Number(commentId),
        },
    });
}

async function getCommentById(commentId) {
    return await prisma.comment.findUnique({
        where: {
            id: Number(commentId),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
    });
}

async function updateComment(commentId, commentData) {
    return await prisma.comment.update({
        where: {
            id: Number(commentId),
        },
        data: {
            content: commentData.content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
    });
}

async function findCommentsByUserId(userId) {
    return await prisma.comment.findMany({
        where: {
            userId: Number(userId),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

module.exports = {
    getCommentsByArticleId,
    createComment,
    findById,
    deleteComment,
    getCommentById,
    updateComment,
    findCommentsByUserId,
};