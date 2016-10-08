const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './app/main.js',
    output: {
        path: path.resolve(__dirname, './static'),
        filename: 'build.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    babel: {
        "presets": ["es2015"],
        "plugins": ["transform-runtime"]
    },
    plugins: [
        new webpack.ExternalsPlugin("commonjs", [
            'electron'
        ])
    ],
    resolve: {
        alias: {vue: 'vue/dist/vue.js'}
    }
}
