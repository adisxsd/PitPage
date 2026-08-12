const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller.js');
const authenticateToken = require('../middlewares/auth.middleware.js');
const requireAdmin = require('../middlewares/role.middleware.js');

router.get(
    '/stats',
    authenticateToken,
    requireAdmin,
    adminController.getStats
);

module.exports = router;