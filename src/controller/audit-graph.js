import { SchemaRegistrar } from '../discovery/base-schema.js';

const run = async testClient => {
    const schemaRegistrar = new SchemaRegistrar({ testClient });
    await schemaRegistrar.initialize();
}

export { run };