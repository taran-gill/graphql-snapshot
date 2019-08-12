/**
 * @fileoverview
 * The TypeManager constructs a list of queries for us to use.
 * - If a query fails, we can subquery its fields to know which query in particular failed.
 * 
 * @note
 * - Since __schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import Hjson from 'hjson';

import { OBJECT, INPUT_OBJECT } from '../const.js';
import skippable from './skip-types.hjson';

class TypeManager {
    constructor(schema) {
        this._schema = schema;

        this.queryTypes = {};
        this._rootTypesToSkip = new Set(Hjson.parse(skippable));

        this._types = {};
        this._inputTypes = {};

        this._registerRootTypes();
        this._registerTypes();
    }

    /**
     * - Register queries on the root schema
     * - Skip root mutations and subscriptions
     */
    _registerRootTypes = () => {
        const { queryType, mutationType, subscriptionType } = this._schema;
        
        if (queryType !== null) {
            queryType.fields.forEach(field => this.queryTypes[field.name] = field);
        }

        if (mutationType !== null) {
            mutationType.fields.forEach(({ name }) => this._rootTypesToSkip.add(name.toLowerCase()));
        }

        if (subscriptionType !== null) {
            subscriptionType.fields.forEach(({ name }) => this._rootTypesToSkip.add(name.toLowerCase()));
        }
    }

    _registerTypes = () => {
        const { types } = this._schema;

        this._types = types.reduce((typeCollection, type) => {
            const name = type.name.toLowerCase();
            if (!this._rootTypesToSkip.has(name)) {
                typeCollection[name] = type;
            }

            return typeCollection;
        }, {});
    }
}

export { TypeManager };