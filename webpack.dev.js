const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const path = require('node:path');

const localProxy = {
    target: 'http://localhost:8081',
    ignorePath: false,
    changeOrigin: true,
    secure: false,
};

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        allowedHosts: 'auto',
        static: [
            {directory: path.join(process.cwd(), 'public'), watch: false},
            {directory: process.cwd(), watch: false}
        ],
        hot: true,
        proxy: [
            {context: ['/arches', '/api', '/images', '/node-sage'], ...localProxy }
        ],
        watchFiles: 'src/**/*',
    },
    devtool: 'eval-source-map',
    plugins: []
});
