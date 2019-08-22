import { validateOptions } from './validation.js';
import { inputVariables } from './variables.js';

import { SchemaManager } from '../discovery/schema-manager.js';

class GraphTester {
    constructor({ testClient, options = {} }) {
        const newOptions = validateOptions(options);

        this._SchemaManager = new SchemaManager({ testClient, inputVariables, options: newOptions });
    }

    initialize = async () => {
        await this._SchemaManager.initialize();
    }

    async *rootQueries() {
        const queries = this._SchemaManager.makeQueries();
        for await (let query of queries) {
            yield query;
        }
    }
}

export { GraphTester };