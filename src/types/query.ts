import { jsonToGraphQLQuery, IJsonToGraphQLOptions } from 'json-to-graphql-query';

import { kinds } from '../const';
import { OperationsManager } from '../interfaces';

import { TypeManager } from './type';

class QueryManager extends TypeManager implements OperationsManager {
    all = (): Array<{ name: string, query: any }> => {
        return Object.entries(this.rootQueries).map(([rootQueryName, rootQueryMetadata]) => {
            let returnType: string = this._getType(rootQueryMetadata.type);

            const queryObject: any = this.types[returnType].kind === kinds.SCALAR ?
                { [ rootQueryName ]: returnType } :
                this._getQueryObjectFromType(rootQueryName, returnType);

            // How jsonToGraphQLQuery expects arguments to be passed in
            if (rootQueryMetadata.args && rootQueryMetadata.args.length > 0) {
                queryObject[rootQueryName].__args = this._getArguments(rootQueryMetadata.args);
            }
            
            const jsonToGraphQLOptions: IJsonToGraphQLOptions = { pretty: true };
            const query: any = jsonToGraphQLQuery({ query: queryObject }, jsonToGraphQLOptions);

            return {
                name: rootQueryName,
                query
            };
        });
    }

    protected _getQueryObjectFromType = (rootQueryName: string, type: string): any => {
        const query: { [path: string]: any } = { [rootQueryName]: null };

        query[rootQueryName] = this._getOperationFields(this.types[type].fields);

        return query;
    }
}

export { QueryManager as default, QueryManager }