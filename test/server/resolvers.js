const { books, authors } = require('../fixtures/book-store.json');

module.exports = {
    Query: {
        books: () => {
            return books;
        },
        authors: () => {
            return authors;
        },
        openForBusiness: () => {
            return true;
        }
    }
}