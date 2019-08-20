import { validateOptions } from './validation.js';

import { SchemaRegistrar } from '../discovery/base-schema.js';

class GraphTester {
    constructor({ testClient, options = {} }) {
        const newOptions = validateOptions(options);
        // console.log(newOptions)
        this._schemaRegistrar = new SchemaRegistrar({ testClient, options: newOptions });
    }

    initialize = async () => {
        await this._schemaRegistrar.initialize();
    }

    async *rootQueries() {
        const queries = this._schemaRegistrar.makeQueries();
        for await (let query of queries) {
            yield query;
        }
    }
}

export { GraphTester };