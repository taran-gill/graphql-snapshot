const { books, authors } = require('../fixtures/book-store.json');

module.exports = {
    Query: {
        books: () => {
            return books.map((book) => ({
                ...book,
                author: authors.find((author) => book.authorId === author.id)
            }));
        },
        authors: () => {
            return authors.map((author) => ({
                ...author,
                books: books.filter((book) => author.id === book.authorId)
            }));
        },
        openForBusiness: () => {
            return true;
        }
    }
}