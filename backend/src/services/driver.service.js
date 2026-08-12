const driverRepository = require('../repositories/driver.repository.js');

async function getAllDrivers() {
    const drivers = await driverRepository.findAll();
    return drivers;
};

async function getDriverById(id) {
    const driver = await driverRepository.findById(Number(id));
    return driver;
};

async function getDriverByName(name) {
    const drivers = await driverRepository.findByName(name);
    return drivers;
};

async function createDriver(data) {
    if (!data) {
        throw new Error("Request body is required");
    }

    if (!data.name || !data.number || !data.team) {
        throw new Error("Name, number, and team are required");
    }

    return await driverRepository.createDriver(data);
};

async function updateDriver(id, data) {
    const driver = await driverRepository.updateDriver(Number(id), data);
    return driver;
};

async function deleteDriver(id) {
    const driver = await driverRepository.deleteDriver(Number(id));
    return driver;
};

async function findDriverById(id) {
    const driver = await driverRepository.findById(Number(id));
    return driver;
};



module.exports = {
    getAllDrivers,
    getDriverById,
    getDriverByName,
    createDriver,
    updateDriver,
    deleteDriver,
    findDriverById
};