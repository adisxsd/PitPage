const express = require("express");
const router = express.Router();

const articleRoutes = require("./article.routes");
const driverRoutes = require("./driver.routes");
const categoryRoutes = require("./category.routes");
const authorRoutes = require("./author.routes");

router.use("/articles", articleRoutes);
router.use("/drivers", driverRoutes);
router.use("/categories", categoryRoutes);
router.use("/authors", authorRoutes);

module.exports = router;