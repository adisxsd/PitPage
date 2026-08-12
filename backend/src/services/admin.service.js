const adminRepository = require('../repositories/admin.repository.js');

async function getStats() {
    return await adminRepository.getStats();
}

module.exports = {
    getStats,
};