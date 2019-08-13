/**
 * @fileoverview
 * Reconcile user input with schema information
 */

import fetch from 'node-fetch';

import INTROSPECTION_QUERY from './base-schema.graphql';

import { TypeManager } from './types';

class SchemaRegistrar {
    constructor({ testClient }) {
        this._testClient = testClient;
    }

    /**
     * Fulfill query request and fill type cache
     */
    initialize = async () => {
        const res = await this._testClient.query({
            query: INTROSPECTION_QUERY
        });

        if (res.errors !== undefined || !res.data || !res.data.__schema) {
            console.error(res.errors)
            throw new Error('Unable to fetch schema from server');
        }

        this._typeManager = new TypeManager(res.data.__schema);
    }
}

export { SchemaRegistrar };