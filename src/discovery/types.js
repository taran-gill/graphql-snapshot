/**
 * @fileoverview
 * The TypeManager constructs a list of queries for us to use.
 * 
 * @note
 * - Since __schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import Hjson from 'hjson';

import skippable from './skip-types.hjson';

import { kinds } from '../const';

/**
 * @protected {Hash<Type, MetaData>} this._queryTypes
 * @protected {Set} this._rootTypesToSkip - Types found on the root object that we should not consider when making queries
 * @protected {Hash<Type, MetaData>} this._types - All valid types queries may resolve to
 * @protected {Hash<Type, MetaData>} this._inputTypes - Inputs to queries will default to appropriate values
 */
class TypeManager {
    constructor(schema) {
        this._schema = schema;

        this._queryTypes = {};
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
            queryType.fields.forEach(field => this._queryTypes[field.name] = field);
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
            const lowerCaseName = type.name.toLowerCase();
            if (!this._rootTypesToSkip.has(lowerCaseName)) {
                typeCollection[type.name] = type;
            }

            return typeCollection;
        }, {});
    }

    getRootQueries = () => {
        return Object.entries(this._queryTypes).map(([rootQueryName, rootQueryMetadata]) => {
            const returnType = rootQueryMetadata.type.kind === kinds.LIST ?
                rootQueryMetadata.type.ofType.ofType.name :
                rootQueryMetadata.type.ofType.name;

            const queryObject = this._types[returnType].kind === kinds.SCALAR ?
                returnType :
                this._getQueryObjectFromType(returnType);

            return {
                name: rootQueryName,
                queryObject
            };
        });
    }

    _getQueryObjectFromType = type => {
        // TODO: Create object from fields
        return this._types[type].reduce();
    }
}

export { TypeManager };