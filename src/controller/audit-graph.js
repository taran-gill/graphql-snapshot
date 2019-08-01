import { SchemaRegistrar } from '../discovery/base-schema.js';

const run = () => {
    new SchemaRegistrar({ address: 'https://swapi.graph.cool/' });
}

export { run };