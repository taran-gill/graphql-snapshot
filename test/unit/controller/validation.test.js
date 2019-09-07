import { validateOptions } from '../../../src/controller/validation.ts';

describe('API Validation', () => {
    it('should use default options when none are specified', () => {
        const options = validateOptions({});

        expect(options).toHaveProperty('maxDepth');
    });

    it('should error out when invalid options are specified', () => {
        expect(() => {
            validateOptions({ maxDepth: Infinity });
        }).toThrow();
    })
});