const prisma = require('../config/prisma.js');

async function getStats() {
    const [
        totalArticles,
        publishedArticles,
        draftArticles,
        totalUsers,
        totalAuthors,
        totalAdmins,
        totalDrivers,
        totalCategories,
        totalComments,
    ] = await Promise.all([
        prisma.article.count(),

        prisma.article.count({
            where: {
                status: 'PUBLISHED',
            },
        }),

        prisma.article.count({
            where: {
                status: 'DRAFT',
            },
        }),

        prisma.user.count(),

        prisma.user.count({
            where: {
                role: 'AUTHOR',
            },
        }),

        prisma.user.count({
            where: {
                role: 'ADMIN',
            },
        }),

        prisma.driver.count(),

        prisma.category.count(),

        prisma.comment.count(),
    ]);

    return {
        articles: {
            total: totalArticles,
            published: publishedArticles,
            draft: draftArticles,
        },

        users: {
            total: totalUsers,
            authors: totalAuthors,
            admins: totalAdmins,
        },

        drivers: totalDrivers,
        categories: totalCategories,
        comments: totalComments,
    };
}

module.exports = {
    getStats,
};