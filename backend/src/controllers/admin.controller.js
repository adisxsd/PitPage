const adminService = require('../services/admin.service.js');

async function getStats(req, res) {
    try {
        const stats = await adminService.getStats();

        return res.status(200).json({
            success: true,
            message: 'Admin statistics retrieved successfully',
            data: stats,
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
}

module.exports = {
    getStats,
};