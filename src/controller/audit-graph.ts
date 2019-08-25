import { validateOptions } from './validation';
import { defaultInputVariables as inputVariables } from './variables';

import { validOptions } from '../interfaces';

import { SchemaManager } from '../discovery/schema-manager';

interface GraphTesterApi {
    testClient: any,
    options?: validOptions
};

class GraphTester {
    private schemaManager: SchemaManager;

    constructor({ testClient, options = {} }: GraphTesterApi) {
        const newOptions: validOptions = validateOptions(options);

        this.schemaManager = new SchemaManager({ testClient, inputVariables, options: newOptions });
    }

    initialize = (): Promise<void> => this.schemaManager.initialize();

    async *rootQueries(): any {
        const queries = this.schemaManager.makeQueries();
        for await (let query of queries) {
            yield query;
        }
    }
}

export { GraphTester };