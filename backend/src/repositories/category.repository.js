const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.category.findMany({
        orderBy: {
            name: 'asc',
        },
    })
};

async function findById(id) {
    return await prisma.category.findUnique({
        where: {   
            id: id,
        },
    });
};

async function createCategory(data) {
    const category = await prisma.category.create({
        data: {
            name: data.name,
            description: data.description,
        }
    });
    return category;
};

async function updateCategory(id, data) {
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            description: data.description,
        }
    });
    return category;
};

async function deleteCategory(id) {
    const category = await prisma.category.delete({
        where: {
            id: id,
        }
    });
    return category;
};

module.exports = {
    findAll,
    findById,
    createCategory,
    updateCategory,
    deleteCategory
};
