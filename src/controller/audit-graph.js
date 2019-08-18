import { SchemaRegistrar } from '../discovery/base-schema.js';

class GraphTester {
    constructor({ testClient }) {
        this._schemaRegistrar = new SchemaRegistrar({ testClient });
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