import { MAX_NODES } from '../const.js';

/**
 * @param {Object} options
 * @returns {Object} options
 */
const validateOptions = (options = {}) => {
    const newOptions = {
        maxDepth: MAX_NODES
    };

    if (Reflect.has(options, 'maxDepth') && !isNaN(options.maxDepth) && options.maxDepth > 0 && options.maxDepth < Infinity) {
        newOptions.maxDepth = options.maxDepth;
    } else if (Reflect.has(options, 'maxDepth')) {
        console.warn(`[Audit-Graph] Invalid graph depth ${options.maxDepth}. Setting default ${this._options.maxDepth}`);
    }

    return newOptions;
}

export { validateOptions as default, validateOptions }