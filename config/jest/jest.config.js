module.exports = {
    rootDir: '../../',
    setupFilesAfterEnv: ['./config/jest/monkey-patches.js'],

    moduleFileExtensions: ['js', 'ts', 'graphql'],
    testRegex: './test/.*.test.(ts|js)$',
    transform: {
        '\\.(gql|graphql)$': 'jest-transform-graphql',
        '^.+\\.(js|jsx)?$': 'babel-jest',
        '\\.(ts|tsx)$': 'ts-jest'
    },

    // Coverage needs to be enabled through the --coverage flag
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    coveragePathIgnorePatterns: ['@types'],
    coverageReporters: ['json', 'text']
};