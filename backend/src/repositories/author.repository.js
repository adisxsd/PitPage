const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.user.findMany({
        where : {
            role : "AUTHOR",
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            createdAt: true,
        }
    });
};

async function findById(id) {
    return await prisma.user.findUnique({
        where: {        
            id: id,
        },
        select: {
            id: true,
            name: true,
            username: true,
            email: true,
            createdAt: true,
        }
    });
}



async function updateAuthor(id, data) {
    return await prisma.user.update({
        where: { id: id },
        data: data,
    });
};

async function deleteAuthor(id) {
    return await prisma.user.delete({
        where: { id: id },
    });
};

module.exports = {
    findAll,
    findById,
    updateAuthor,
    deleteAuthor,
};