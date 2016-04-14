var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        main: [
            'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
            // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
            './src/main.ts'
        ],
        vendor: [
            'lodash',
            'react',
            'react-dom',
            'rx',
            'rx-dom'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: "/dist",
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor', filename: 'vendor.js'
        })
    ],

    debug: true,
    devtool: 'source-map',
    devServer: {
        port: 3000,
        // It suppress error shown in console, so it has to be set to false.
        quiet: false,
        // It suppress everything except error, so it has to be set to false as well
        // to see success build.
        noInfo: false,
        publicPath: '/dist',
        stats: {
            // Config for minimal console.log mess.
            assets: false,
            colors: true,
            version: true,
            hash: false,
            timings: true,
            chunks: true,
            chunkModules: false
        }
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.tsx', '.ts', '.js']
    },

    module: {
        noParse: /node_modules\/json-schema\/lib\/validate\.js/,

        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader!ts-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?cacheDirectory'
            },
            {
                test: /\.json$/,
                loaders: ['json-loader']
            }
        ]
    },
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
}