import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';

import typeDefs from './schema.graphql';
import resolvers from './resolvers';

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({})
})

const testClient = createTestClient(server);

module.exports = { testClient, server };
