const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.driver.findMany();
}

async function findById(id) {
    return await prisma.driver.findUnique({
        where: {   
            id: id,
        },
    });
}

module.exports = {
    findAll,
    findById,
};