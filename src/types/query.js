import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { kinds } from '../const';

import { TypeManager } from './type.js';

class QueryManager extends TypeManager {
    constructor() {
        super(...arguments);
    }

    getRootQueries = () => {
        return Object.entries(this._rootQueries).map(([rootQueryName, rootQueryMetadata]) => {
            let returnType = this._getType(rootQueryMetadata.type);

            const queryObject = this._types[returnType].kind === kinds.SCALAR ?
                { [ rootQueryName ]: returnType } :
                this._getQueryObjectFromType(rootQueryName, returnType);

            // How jsonToGraphQLQuery expects arguments to be passed in
            if (rootQueryMetadata.args && rootQueryMetadata.args.length > 0) {
                queryObject[rootQueryName].__args = this._getArguments(rootQueryMetadata.args);
            }
            
            const query = jsonToGraphQLQuery({ query: queryObject }, { pretty: true });

            return {
                name: rootQueryName,
                query
            };
        });
    }

    _getQueryObjectFromType = (rootQueryName, type) => {
        const query = { [rootQueryName]: null };

        query[rootQueryName] = this._getOperationFields(this._types[type].fields);

        return query;
    }
}

export { QueryManager as default, QueryManager }