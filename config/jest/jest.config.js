module.exports = {
    setupFilesAfterEnv: ['./monkey-patches.js'],
    roots: ['../../'],

    moduleFileExtensions: ['js', 'graphql'],
    transform: {
        "\\.(gql|graphql)$": "jest-transform-graphql",
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
};