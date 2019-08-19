const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        books: [Book!]!,
        authors: [Author!]!,
        openForBusiness: Boolean!
    }

    type Book {
        name: String,
        authorId: ID!,
        isbn: ID!
    }

    type Author {
        name: String
        id: ID!,
        birthplace: String
    }
`;

module.exports = typeDefs;