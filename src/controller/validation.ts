import { MAX_NODES } from '../const';

import { validOptions } from '../interfaces';

const validateOptions = (options: validOptions|undefined): validOptions => {
    const newOptions: validOptions = {
        maxDepth: MAX_NODES
    };

    if (Reflect.has(options, 'maxDepth') && !isNaN(options.maxDepth) && options.maxDepth > 0 && options.maxDepth < Infinity) {
        newOptions.maxDepth = options.maxDepth;
    } else if (Reflect.has(options, 'maxDepth')) {
        console.warn(`[Audit-Graph] Invalid graph depth ${options.maxDepth}. Setting default ${MAX_NODES}`);
    }

    return newOptions;
}

export { validateOptions as default, validateOptions };