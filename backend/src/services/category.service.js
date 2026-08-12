const categoryRepository = require('../repositories/category.repository.js');

async function getAllCategories() {
    const categories = await categoryRepository.findAll();
    return categories;
};

async function getCategoryById(id) {
    const category = await categoryRepository.findById(Number(id));
    return category;
};

async function createCategory(data) {
    const category = await categoryRepository.createCategory(data);
    return category;
};

async function updateCategory(id, data) {
    const category = await categoryRepository.updateCategory(Number(id), data);
    return category;
};

async function deleteCategory(id) {
    const category = await categoryRepository.deleteCategory(Number(id));
    return category;
};


module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};