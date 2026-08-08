const authorRepository = require('../repositories/author.repository.js');

async function getAllAuthors() {
    const authors = await authorRepository.findAll();
    return authors;
};

async function getAuthorById(id) {
    const author = await authorRepository.findById(Number(id));
    return author;
};


async function updateAuthor(id, authorData) {
    const updatedAuthor = await authorRepository.updateAuthor(Number(id), authorData);
    return updatedAuthor;
};

async function deleteAuthor(id) {
    const deletedAuthor = await authorRepository.deleteAuthor(Number(id));
    return deletedAuthor;
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
};
