/**
 * @fileoverview
 * Reconcile user input with schema information
 */

import gql from 'graphql-tag';

import INTROSPECTION_QUERY from './base-schema.graphql';

import { QueryManager } from '../types/query';

import { inputVariables as inputVariablesType, validOptions } from '../interfaces';

class SchemaManager {
    private testClient: any;
    private options: any;
    private inputVariables: any;

    private queryManager: QueryManager;

    constructor({ testClient, options, inputVariables }: { testClient: any, options: validOptions, inputVariables: inputVariablesType }) {
        this.testClient = testClient;
        this.options = options;
        this.inputVariables = inputVariables;
    }

    /**
     * Fulfill query request and fill type cache
     */
    initialize = async (): Promise<void> => {
        const res: any = await this.testClient.query({
            query: INTROSPECTION_QUERY
        });

        if (res.errors !== undefined || !res.data || !res.data.__schema) {
            console.error(res.errors)
            throw new Error('Unable to fetch schema from server');
        }

        this.queryManager = new QueryManager(res.data.__schema, this.inputVariables, this.options);
    }

    async *queries() {
        const queries = this.queryManager.all();
        for (let queryObject of queries) {
            const results = await this.testClient.query({ query: gql(queryObject.query) });

            yield {
                name: queryObject.name,
                query: queryObject.query,
                results
            };
        }
    }
}

export { SchemaManager };