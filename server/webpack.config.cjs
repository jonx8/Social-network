const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    context: path.resolve(__dirname, 'admin'),
    entry: {
        'user-detail': "./javascript/user-detail.js",
        'index': "./javascript/users-list.js",
        'friends': "./javascript/friends.js",
        'news-list': "./javascript/news-list.js",
        'conversations': "./javascript/conversations.js",
        'conversation-detail': "./javascript/conversation-detail.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/public'),
        publicPath: "/public/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {presets: ["@babel/preset-env"]}
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.less$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /.pug$/,
                use: ['pug-loader']
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: `views/index.pug`,
            filename: `./index.html`,
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: `views/user-detail.pug`,
            filename: `./user-detail.html`,
            chunks: ['user-detail']
        }),
        new HtmlWebpackPlugin({
            template: `views/friends.pug`,
            filename: `./friends.html`,
            chunks: ['friends']
        }),
        new HtmlWebpackPlugin({
            template: `views/news-list.pug`,
            filename: "news-list.html",
            chunks: ['news-list']
        }),
        new HtmlWebpackPlugin({
            template: `views/conversations.pug`,
            filename: "conversations.html",
            chunks: ['conversations']
        }),
        new HtmlWebpackPlugin({
            template: `views/conversation-detail.pug`,
            filename: "conversation-detail.html",
            chunks: ['conversation-detail']
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{
                from: 'images',
                to: 'images'
            }]
        })
    ],
}