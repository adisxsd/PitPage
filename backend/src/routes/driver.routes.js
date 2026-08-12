const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller.js');
const articleController = require('../controllers/article.controller.js');
const requireAdmin = require('../middlewares/role.middleware.js');
const authenticateToken = require('../middlewares/auth.middleware.js');

router.get("/", authenticateToken, driverController.getAllDrivers);
router.get("/:id", authenticateToken, driverController.getDriverById);
router.get("/search/:name", authenticateToken, driverController.getDriverByName);
router.get("/:id/articles", authenticateToken, articleController.getArticleByDriverId);
router.post("/", authenticateToken, requireAdmin, driverController.createDriver);
router.put("/:id", authenticateToken, requireAdmin, driverController.updateDriver);
router.delete("/:id", authenticateToken, requireAdmin, driverController.deleteDriver);

module.exports = router;