const driverRepository = require('../repositories/driver.repository.js');

async function getAllDrivers() {
    const drivers = await driverRepository.findAll();
    return drivers;
};

async function getDriverById(id) {
    const driver = await driverRepository.findById(Number(id));
    return driver;
};


module.exports = {
    getAllDrivers,
    getDriverById,
};