const { books, authors } = require('../fixtures/book-store.json');

module.exports = {
    Query: {
        books: () => {
            return books;
        },
        authors: (root, { id }) => {
            if (id) {
                id = parseInt(id);
                const author = [authors.find((author) => author.id === id)];
                return author.filter((v) => !!v);
            }
            
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