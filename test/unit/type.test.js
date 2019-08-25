import schema from '../fixtures/schema.json';

import { TypeManager } from '../../src/types/type.ts';
import { defaultInputVariables as inputVariables } from '../../src/controller/variables.ts';

const options = { maxDepth: 3 };

/**
 * Since TypeManager is an abstract class, we need to subclass it before testing
 */
class SubclassedTypeManager extends TypeManager {}

const typeManager = new SubclassedTypeManager(schema, inputVariables, options);

describe('TypeManager', () => {
    it('should recognize return types', () => {
        const bookQuery = schema.queryType.fields.find((field) => field.name === 'books');
        const returnType = typeManager._getType(bookQuery.type);

        expect(returnType).toEqual('Book');
    });

    it('should recognize fields on types', () => {
        const authorType = schema.types.find((type) => type.name === 'Author');
        const fields = typeManager._getOperationFields(authorType.fields);

        // Test against a few of the fields we're expecting
        const expectedFields = {
            birthplace: true,
            id: true,
            name: true
        };

        expect(fields).toMatchObject(expectedFields);
        expect(fields).toHaveProperty('books');
        expect(fields.books).toHaveProperty('author'); // Test for recursiveness
    });

    it('should test for arguments', () => {
        const authorQuery = schema.queryType.fields.find((field) => field.name === 'authors');
        const args = typeManager._getArguments(authorQuery.args);

        expect(args.id).toBeDefined();
    });
})