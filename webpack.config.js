const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'dist/app.js',
        path: __dirname,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    devServer: {
        contentBase: "./public",
        hot: true
    }
};
