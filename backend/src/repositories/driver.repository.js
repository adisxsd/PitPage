const prisma = require('../config/prisma.js');

async function findAll() {
    return await prisma.driver.findMany();
};

async function findById(id) {
    return await prisma.driver.findUnique({
        where: {   
            id: id,
        },
    });
};

async function findByName(name) {
    return await prisma.driver.findMany({
        where: {
            name: {
                contains: name,
                mode: 'insensitive',
            },
        },
    });
};

async function createDriver(data) {
    const driver = await prisma.driver.create({
        data: {
            name: data.name,
            number: data.number,
            team: data.team,
        }
    });
    return driver;
};

async function updateDriver(id, data) {
    const driver = await prisma.driver.update({
        where: {
            id: id,
        },
        data: {
            name: data.name,
            number: data.number,
            team: data.team,
        }
    });
    return driver;
};

async function deleteDriver(id) {
    const driver = await prisma.driver.delete({
        where: {
            id: id,
        },
    });
    return driver;
};

module.exports = {
    findAll,
    findById,
    findByName,
    createDriver,
    updateDriver,
    deleteDriver,
    findByName
};