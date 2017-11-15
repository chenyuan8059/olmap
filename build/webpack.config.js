const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const cfg = require("./webpack.cfg");

module.exports = merge(cfg, {
    plugins: [
        new CleanWebpackPlugin(["dist"], {
            root: path.resolve(__dirname, "./../"),
            verbose: true,
            dry: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        })
    ]
});
