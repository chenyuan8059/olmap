const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/olmap.js",
    output: {
        publicPath: "/",
        path: path.resolve(__dirname, "./../dist"),
        filename: "olmap.min.js",
        library: "olmap",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ["es2015"]
                }
            }
        ]
    },
    resolve: {
        extensions: [".json", ".js", ".css"],
        alias: {
            // openlayers:path.resolve(__dirname, './../src/libs/v4.4.2-dist/ol')
        }
    },
    externals: {
        openlayers:'ol'
    },
    // devtool: "source-map",
    plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.NoErrorsPlugin()]
};
