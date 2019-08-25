import schema from '../fixtures/schema.json';

import { QueryManager } from '../../src/types/query.ts';
import { defaultInputVariables as inputVariables } from '../../src/controller/variables.ts';

const options = { maxDepth: 3 };

const queryManager = new QueryManager(schema, inputVariables, options);

describe('QueryManager', () => {
    it('should return an array of GraphQL queries and their names', () => {
        const allQueries = queryManager.all();

        expect(Array.isArray(allQueries)).toBe(true);

        const booksQuery = allQueries.find(({ name }) => name === 'books');

        expect(typeof booksQuery.query).toBe('string');
    });

    it('should return a query object derived from the type', () => {
        const queryObject = queryManager._getQueryObjectFromType('books', 'Book');

        expect(queryObject.books).toHaveProperty('author');
        expect(queryObject.books.author).toHaveProperty('books'); // Check for circular dependency (depth >= 3 allows for that)
    });
});