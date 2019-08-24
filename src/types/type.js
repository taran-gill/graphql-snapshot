/**
 * @fileoverview
 * The TypeManager constructs and resolves a list of queries for us to use.
 * 
 * @note
 * - Since __schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import { kinds, scalars, skippableTypes } from '../const';

/**
 * @protected {Hash<Type, MetaData>} this._rootQueries
 * @protected {Set} this._rootTypesToSkip - Types found on the root object that we should not consider when making queries
 * @protected {Hash<Type, MetaData>} this._types - All valid types queries may resolve to
 * @protected {Hash<Type, MetaData>} this._inputTypes - Inputs to queries will default to appropriate values
 */
class TypeManager {
    constructor(schema, inputVariables, options) {
        this._schema = schema;
        this._inputVariables = inputVariables;

        this._rootQueries = {};
        this._rootTypesToSkip = new Set(skippableTypes);

        this._types = {};
        this._inputTypes = {};

        this._registerRootOperations();
        this._registerTypes();

        this._maxDepth = options.maxDepth;
    }

    /**
     * - Register queries on the root schema
     * - Skip root mutations and subscriptions
     */
    _registerRootOperations = () => {
        const { queryType, mutationType, subscriptionType } = this._schema;

        if (queryType !== null) {
            queryType.fields.forEach(field => this._rootQueries[field.name] = field);
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

    /**
     * Utility function for retrieving the type a root operation falls under
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
    _getOperationFields = (fields, depth = this._maxDepth) => {
        if (depth === 0) return null;

        return fields.reduce((operationObject, field) => {
            let type = this._getType(field.type);

            if (scalars.has(type)) {
                operationObject[field.name] = true;
            } else {
                let depthFields = type === null ? type : this._getOperationFields(this._types[type].fields, depth - 1);

                if (depthFields !== null) {
                    operationObject[field.name] = depthFields;
                }
            }

            return operationObject
        }, {});
    }

    _getArguments = (args, depth = this._maxDepth) => {
        if (depth === 0) return null;

        return args.reduce((argsObject, currentArg) => {
            const type = this._getType(currentArg.type);

            if (scalars.has(type)) {
                argsObject[currentArg.name] = this._inputVariables[type];
            } else {
                let depthFields = type === null ? type : this._getArguments(this._types[type].args, depth - 1);

                if (depthFields !== null) {
                    operationObject[field.name] = depthFields;
                }
            }

            return argsObject;
        } , {});
    }
}

export { TypeManager };
