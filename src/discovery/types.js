/**
 * @fileoverview
 * The TypeManager constructs and resolves a list of queries for us to use.
 * 
 * @note
 * - Since __schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { kinds, scalars, skippableTypes } from '../const';

/**
 * @protected {Hash<Type, MetaData>} this._queryTypes
 * @protected {Set} this._rootTypesToSkip - Types found on the root object that we should not consider when making queries
 * @protected {Hash<Type, MetaData>} this._types - All valid types queries may resolve to
 * @protected {Hash<Type, MetaData>} this._inputTypes - Inputs to queries will default to appropriate values
 */
class TypeManager {
    constructor(schema, options = {}) {
        this._schema = schema;

        this._queryTypes = {};
        this._rootTypesToSkip = new Set(skippableTypes);

        this._types = {};
        this._inputTypes = {};

        this._registerRootTypes();
        this._registerTypes();

        this._maxDepth = options.maxDepth;
    }

    getRootQueries = () => {
        return Object.entries(this._queryTypes).map(([rootQueryName, rootQueryMetadata]) => {
            let returnType = this._getType(rootQueryMetadata.type);

            const queryObject = this._types[returnType].kind === kinds.SCALAR ?
                { [ rootQueryName ]: returnType } :
                this._getQueryObjectFromType(rootQueryName, returnType);
            
            const query = jsonToGraphQLQuery({ query: queryObject }, { pretty: true });

            return {
                name: rootQueryName,
                query
            };
        });
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

    _getQueryObjectFromType = (rootQueryName, type) => {
        const query = { [rootQueryName]: null };

        query[rootQueryName] = this._getQueryFields(this._types[type].fields);

        return query;
    }

    /**
     * Utility function for retrieving the type a root query falls under
     * 
     * @param {Number} depth - We use a depth of 4 because each node may have up to four recursive traversals
     *                         (case of [type!]!)
     */
    _getType = (type, depth = 4) => {
        if (depth === 0) return null;

        switch (type.kind) {
            case kinds.LIST: // Fallthrough
            case kinds.NON_NULL:
                return this._getType(type.ofType, depth - 1);
            case kinds.OBJECT: // Fallthrough
            case kinds.SCALAR:
                return type.name;
            default:
                return null;
        }
    }

    /**
     * Utility function for retrieving the fields of a type
     * - Due to the recursive nature of traversing graphs, we stop early to avoid circular queries
     */
    _getQueryFields = (fields, depth = this._maxDepth) => {
        if (depth === 0) return null;

        return fields.reduce((queryObject, field) => {
            let type = this._getType(field.type);

            if (scalars.has(type)) {
                queryObject[field.name] = true;
            } else {
                let depthFields = type === null ? type : this._getQueryFields(this._types[type].fields, depth - 1);
                // console.log(type, depthFields)
                if (depthFields !== null) {
                    queryObject[field.name] = depthFields;
                }
            }

            return queryObject
        }, {});
    }
}

export { TypeManager };
