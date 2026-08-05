const categoryRepository = require('../repositories/category.repository.js');

async function getAllCategories() {
    const categories = await categoryRepository.findAll();
    return categories;
};

module.exports = {
    getAllCategories,
};