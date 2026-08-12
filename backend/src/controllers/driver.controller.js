const driverService = require('../services/driver.service.js');

async function getAllDrivers(req, res) {
    try {
        const drivers = await driverService.getAllDrivers();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
};

async function getDriverByName(req, res) {
    const { name } = req.params;
    try {
        const driver = await driverService.getDriverByName(name);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.status(200).json(driver);
    } catch (error) {
        console.error('Error fetching driver by name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
};

async function createDriver(req, res) {
    try {
        const driver = await driverService.createDriver(req.body);

        return res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: driver,
        });
    } catch (error) {
        console.error("Error creating driver:", error);

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}

async function updateDriver(req, res) {
    const { id } = req.params;
    const driverData = req.body;    
    try {
        const updatedDriver = await driverService.updateDriver(id, driverData);
        if (!updatedDriver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.status(200).json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function deleteDriver(req, res) {
    const { id } = req.params;
    try {
        const deletedDriver = await driverService.deleteDriver(id);
        if (!deletedDriver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.status(200).json({ message: 'Driver deleted successfully' });
    } catch (error) {
        console.error('Error deleting driver:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    getAllDrivers,
    getDriverById,
    getDriverByName,
    createDriver,
    updateDriver,
    deleteDriver
};