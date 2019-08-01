import fetch from 'node-fetch';

import { IntrospectionQuery } from './base-schema.graphql';
import { TypeManager } from './types';

class SchemaRegistrar {
    /**
     * @param {String} address
     */
    constructor({ address }) {
        this._address = address;
        this.initialize();
    }

    /**
     * Fulfill query request and fill type cache
     */
    initialize = async () => {
        const res = await fetch(this._address, this.constructor.fetchArgs);
        const { errors, data } = await res.json();

        if (errors) {
            throw new Error('Unable to fetch schema from server');
        }

        this._typeManager = new TypeManager(data.__schema);

        /*  */
    }

    static fetchArgs = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: IntrospectionQuery.loc.source.body
        })
    }

    _address = null;
}

export { SchemaRegistrar };