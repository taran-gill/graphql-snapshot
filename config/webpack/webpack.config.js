const path = require('path')

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, '../../src/index.ts'),
    output: {
        library: '',
        libraryTarget: 'commonjs',
        filename: 'graphql-snapshot.js',
        path: path.resolve(__dirname, '../../dist/')
    },
    resolve: {
        extensions: ['.js', '.d.ts', '.ts', '.graphql']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                        ]
                    }
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: {
                    loader: 'graphql-tag/loader'
                }
            }
        ]
    }
}