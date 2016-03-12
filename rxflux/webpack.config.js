var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/main.ts'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
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
        stats: {
            // Config for minimal console.log mess.
            assets: false,
            colors: true,
            version: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false
        }
    },

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.tsx', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader!ts-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?cacheDirectory'
            }]
    }
    //   },
    //     module: {
    //         loaders: [
    //             // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
    //             { test: /\.tsx?$/, loader: 'babel?loose=all!ts', include: path.join(__dirname, 'src') }
    //         ]
    //     }
}