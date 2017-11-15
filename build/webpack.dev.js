const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const cfg = require("./webpack.cfg");

module.exports = merge(cfg, {
    output: {
        path: path.resolve(__dirname, "./../devdist/")
    },
    plugins: [
        new CleanWebpackPlugin(["devdist"], {
            root: path.resolve(__dirname, "./../"),
            verbose: true,
            dry: false
        })
    ]
});
