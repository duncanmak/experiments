var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/app.ts'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    plugins: [
        new webpack.NoErrorsPlugin()
    ],

    debug: true,
    devtool: 'source-map',

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
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
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
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