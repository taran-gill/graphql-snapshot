const { ApolloServer } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');

const { GraphTester } = require('../../dist/audit-graph');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({})
})

const testClient = createTestClient(server);

module.exports = { testClient, server };
