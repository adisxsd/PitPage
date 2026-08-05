const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.category.findMany()
};

module.exports = {
    findAll,
};
