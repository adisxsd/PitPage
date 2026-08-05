const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.article.findMany({
        where : {
            status : "PUBLISHED",
        },
        include: {
            author : {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
            category : {
                select: {
                    id: true,
                    name: true,
                },
            },
            driver : {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            publishedAt: 'desc',
        },
    });
}

async function findBySlug(slug) {
    return await prisma.article.findUnique({
        where: {
            slug: slug,
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
            driver: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
}

async function findByDriverId(driverId) {
    return await prisma.article.findMany({
        where: {
            driverId: driverId,
        },
        include: {
            author : true,
            category : true,
            driver : true,
        },
    });
}

async function findByCategoryId(categoryId) {
    return await prisma.article.findMany({
        where: {
            categoryId: categoryId,
        },
        include: {
            author : true,
            category : true,
            driver : true,
        },
    });
};

async function findByAuthorId(authorId) {
    return await prisma.article.findMany({
        where: {
            authorId: authorId,
        },
        include: {
            author : true,
            category : true,
            driver : true,
        },
    });
};

async function findLatestArticles(limit = 5) {
    return await prisma.article.findMany({
        where: {
            status: "PUBLISHED",
        },
        orderBy: {
            publishedAt: 'desc', },
        take: limit,
        include: {
            author: true,
            category: true,
            driver: true,
        },
    });
};

async function createArticle(data) {
    return await prisma.article.create({
        data: data,
        include : {
            author : true,
            category : true,
            driver : true,
        },
    });
};

async function updateArticle(slug, data) {
    return await prisma.article.update({
        where: {
            slug: slug,
        },
        data: data,
    });
};

async function deleteArticle(slug) {
    return await prisma.article.delete({
        where: {
            slug: slug,
        },
    });
};

module.exports = {
    findAll,
    findBySlug,
    findByDriverId,
    findByCategoryId,
    findByAuthorId,
    findLatestArticles,
    createArticle,
    updateArticle,
    deleteArticle,
};