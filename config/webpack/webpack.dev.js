const baseWebpackConfig = require('./webpack.config.js');

module.exports = {
    ...baseWebpackConfig,
    devtool: 'cheap-eval-source-map'
};