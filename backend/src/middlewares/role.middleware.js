function requireAdmin(req, res, next) {
    console.log("REQ.USER:", req.user);

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin only.",
        });
    }

    next();
}

module.exports = requireAdmin;