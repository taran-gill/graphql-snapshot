const path = require('path')

const { BannerPlugin } = require('webpack')

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, '../../src/index.js'),
    output: {
        filename: 'audit-graph.js',
        path: path.resolve(__dirname, '../../dist/')
    },
    plugins: [
        new BannerPlugin({
          banner: '#!/usr/bin/env node',
          raw: true,
        }),
    ],
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
                test: /\.graphql$/,
                exclude: /node_modules/,
                use: {
                    loader: 'graphql-tag/loader'
                }
            },
            {
                test: /\.hjson$/,
                exclude: /node_modules/,
                use: {
                    loader: 'raw-loader'
                }
            }
        ]
    }
}