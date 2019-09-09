import { validateOptions } from './validation';
import { defaultInputVariables as inputVariables } from './variables';

import { validOptions, graphTesterInputs, graphTesterApi } from '../interfaces';

import { SchemaManager } from '../discovery/schema-manager';

const graphTester = async ({ testClient, options = {} }: graphTesterInputs): Promise<graphTesterApi> => {
    const newOptions: validOptions = validateOptions(options);

    const schemaManager: SchemaManager = new SchemaManager({ testClient, inputVariables, options: newOptions });
    await schemaManager.initialize();

    return {
        queries: schemaManager.queries.bind(schemaManager)
    };
}

export { graphTester };