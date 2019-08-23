/**
 * @fileoverview
 * Reconcile user input with schema information
 */

import fetch from 'node-fetch';
import gql from 'graphql-tag';

import INTROSPECTION_QUERY from './base-schema.graphql';

import { QueryManager } from '../types/query.js';

class SchemaManager {
    constructor({ testClient, options = {}, inputVariables }) {
        this._testClient = testClient;
        this._options = options;
        this._inputVariables = inputVariables;
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

        this._queryManager = new QueryManager(res.data.__schema, this._inputVariables, this._options);
    }

    async *makeQueries() {
        const queries = this._queryManager.getRootQueries();
        for (let queryObject of queries) {
            const results = await this._testClient.query({ query: gql(queryObject.query) });

            yield {
                name: queryObject.name,
                query: queryObject.query,
                results
            };
        }
    }
}

export { SchemaManager };