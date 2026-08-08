const authorService = require('../services/author.service.js');

async function getAllAuthors(req, res) {
    try {
        const authors = await authorService.getAllAuthors();
        res.status(200).json(authors);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

async function getAuthorById(req, res) {
    const { id } = req.params;
    try {
        const author = await authorService.getAuthorById(id);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json(author);
    } catch (error) {
        console.error('Error fetching author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



async function updateAuthor(req, res) {
    const { id } = req.params;
    const authorData = req.body;
    try {
        const updatedAuthor = await authorService.updateAuthor(id, authorData);
        if (!updatedAuthor) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json(updatedAuthor);
    } catch (error) {
        console.error('Error updating author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
async function deleteAuthor(req, res) {
    const { id } = req.params;
    try {
        const deletedAuthor = await authorService.deleteAuthor(id);
        if (!deletedAuthor) {
            return res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (error) {
        console.error('Error deleting author:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
};


