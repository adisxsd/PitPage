const express = require('express');
const router = express.Router();

const driverController = require('../controllers/driver.controller.js');
const articleController = require('../controllers/article.controller.js');

router.get("/", driverController.getAllDrivers);
router.get("/:id", driverController.getDriverById);
router.get("/:id/articles", articleController.getArticleByDriverId);
module.exports = router;