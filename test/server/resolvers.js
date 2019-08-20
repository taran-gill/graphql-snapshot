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
    },
    Book: {
        author: ({ authorId }) => authors.find((author) => authorId === author.id)
    },
    Author: {
        books: ({ id }) => books.filter((book) => id === book.authorId)
    }
}