const driverService = require('../services/driver.service.js');

async function getAllDrivers(req, res) {
    try {
        const drivers = await driverService.getAllDrivers();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getDriverById(req, res) {
    const { id } = req.params;

    try {
        const driver = await driverService.getDriverById(id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (error) {
        console.error('Error fetching driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    getAllDrivers,
    getDriverById,
};