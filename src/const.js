export const kinds = {
    'OBJECT': 'OBJECT',
    'INPUT_OBJECT': 'INPUT_OBJECT',
    'LIST': 'LIST',
    'NON_NULL': 'NON_NULL',
    'SCALAR': 'SCALAR'
};

export const scalars = new Set([
    'Boolean',
    'ID',
    'Number',
    'String'
]);

export const MAX_NODES = 7;