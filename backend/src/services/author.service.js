const authorRepository = require('../repositories/author.repository.js');

async function getAllAuthors() {
    const authors = await authorRepository.findAll();
    return authors;
};

async function getAuthorById(id) {
    const author = await authorRepository.findById(Number(id));
    return author;
};

module.exports = {
    getAllAuthors,
    getAuthorById,
};