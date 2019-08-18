/**
 * @fileoverview
 * The TypeManager constructs a list of queries for us to use.
 * 
 * @note
 * - Since __schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import Hjson from 'hjson';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

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
            let returnType
            switch (rootQueryMetadata.type.kind) {
                case kinds.LIST:
                    returnType = rootQueryMetadata.type.ofType.ofType.name;
                    break;
                case kinds.SCALAR:
                    returnType = rootQueryMetadata.type.name;
                    break;
                default:
                    returnType = rootQueryMetadata.type.ofType.name;
            }

            const queryObject = this._types[returnType].kind === kinds.SCALAR ?
                { [ rootQueryName ]: returnType } :
                this._getQueryObjectFromType(rootQueryName, returnType);
            
            const query = jsonToGraphQLQuery({ query: queryObject });

            return {
                name: rootQueryName,
                query
            };
        });
    }

    _getQueryObjectFromType = (rootQueryName, type) => {
        const query= { [rootQueryName]: null };

        query[rootQueryName] = this._types[type].fields.reduce((queryObj, field) => {
            queryObj[field.name] = true;

            return queryObj;
        }, {});

        return query;
    }
}

export { TypeManager };