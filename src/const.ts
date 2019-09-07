export type KindsType = { [key: string]: string };

export const kinds: KindsType = {
    'OBJECT': 'OBJECT',
    'INPUT_OBJECT': 'INPUT_OBJECT',
    'LIST': 'LIST',
    'NON_NULL': 'NON_NULL',
    'SCALAR': 'SCALAR'
};

export const scalars: Set<string> = new Set([
    'Boolean',
    'Float',
    'ID',
    'Int',
    'String'
]);

/**
 * List of types that the TypeManager can safely ignore
 * - Since the TypeManager compares types as lower case, we write them as such here
 */
export const skippableTypes: Array<string> = [
    'mutation',
    '_modelmutationtype',
    'query',
    '_querymeta',
    '__directive',
    '__directivelocation',
    '__enumvalue',
    '__field',
    '__inputvalue',
    '__schema',
    '__type',
    '__typekind'
];

export const MAX_NODES: number = 2;