/**
 * @fileoverview
 * The TypeManager constructs and resolves a list of queries for us to use.
 * 
 * @note
 * - Since _schema always converts types to lowercase (and they may not actually be lowercase),
 *      enforce non-case sensitivity.
 */

import { kinds, scalars, skippableTypes } from '../const';
import {
    validOptions,
    inputVariables as inputVariablesType,
    schema as schemaType,
    fullType,
    fieldType,
    inputArguments as schemaInputArguments
} from '../interfaces';

abstract class TypeManager {
    protected schema: schemaType;
    protected inputVariables: inputVariablesType;
    
    protected rootQueries: { [path: string]: any };
    protected rootTypesToSkip: Set<string>;

    protected types: { [path: string]: any };

    protected maxDepth: number;

    constructor(schema: any, inputVariables: inputVariablesType, options: validOptions) {
        this.schema = schema;
        this.inputVariables = inputVariables;

        this.rootQueries = {};
        this.rootTypesToSkip = new Set(skippableTypes);

        this.types = {};

        this._registerRootOperations();
        this._registerTypes();

        this.maxDepth = options.maxDepth;
    }

    /**
     * - Register queries on the root schema
     * - Skip root mutations and subscriptions
     */
    private _registerRootOperations = (): void => {
        const { queryType, mutationType, subscriptionType } = this.schema;

        if (queryType !== null) {
            queryType.fields.forEach((field: any) => this.rootQueries[field.name] = field);
        }

        if (mutationType !== null) {
            mutationType.fields.forEach(({ name }: { name: string }) => this.rootTypesToSkip.add(name.toLowerCase()));
        }

        if (subscriptionType !== null) {
            subscriptionType.fields.forEach(({ name }: { name: string }) => this.rootTypesToSkip.add(name.toLowerCase()));
        }
    }

    private _registerTypes = (): void => {
        const { types } = this.schema;

        this.types = types.reduce((typeCollection: any, type: any) => {
            const lowerCaseName = type.name.toLowerCase();
            if (!this.rootTypesToSkip.has(lowerCaseName)) {
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
    protected _getType = (type: any, depth: number = 4): string|null => {
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
    protected _getOperationFields = (fields: Array<fieldType>, depth: number = this.maxDepth): any => {
        if (depth === 0) return null;

        return fields.reduce((operationObject: { [path: string]: any }, field: fieldType) => {
            let type: string|null = this._getType(field.type);

            if (scalars.has(type)) {
                operationObject[field.name] = true;
            } else {
                let depthFields = type === null ? type : this._getOperationFields(this.types[type].fields, depth - 1);

                if (depthFields !== null) {
                    operationObject[field.name] = depthFields;
                }
            }

            return operationObject
        }, {});
    }

    protected _getArguments = (args: Array<schemaInputArguments>, depth: number = this.maxDepth): any => {
        if (depth === 0) return null;

        return args.reduce((argsObject: { [path: string]: any }, currentArg: schemaInputArguments) => {
            const type: string|null = this._getType(currentArg.type);

            if (scalars.has(type)) {
                argsObject[currentArg.name] = this.inputVariables[type];
            } else {
                let depthFields = type === null ? type : this._getArguments(this.types[type].args, depth - 1);

                if (depthFields !== null) {
                    argsObject[depthFields.name] = depthFields;
                }
            }

            return argsObject;
        } , {});
    }
}

export { TypeManager };
