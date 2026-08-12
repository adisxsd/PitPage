const express = require("express");
const router = express.Router();

const articleRoutes = require("./article.routes");
const driverRoutes = require("./driver.routes");
const categoryRoutes = require("./category.routes");
const authorRoutes = require("./author.routes");
const authRoutes = require("./auth.routes");
const commentRoutes = require("./comment.routes");
const adminRoutes = require("./admin.routes");

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);
router.use("/drivers", driverRoutes);
router.use("/categories", categoryRoutes);
router.use("/authors", authorRoutes);
router.use("/comments", commentRoutes);

module.exports = router;