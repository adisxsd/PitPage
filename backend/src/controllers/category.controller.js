const categoryService = require('../services/category.service.js');

async function getAllCategories(req, res) {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllCategories,
};