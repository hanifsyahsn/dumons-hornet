// webpack.server.js
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
const nodeExternals = require("webpack-node-externals");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDev ? "development" : "production",
    target: "node",
    externals: [nodeExternals()],
    entry: {
        server: "./src/server/server.tsx",
        prerender: "./src/server/prerender.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist/server"),
        filename: "[name].js",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                loader: "ignore-loader",
            }
        ],
    },
    plugins: [
        // Default route for "/", baked in at build time (see src/constants/routing.ts)
        new webpack.DefinePlugin({
            "process.env.DEFAULT_ROUTE": JSON.stringify(process.env.DEFAULT_ROUTE || ""),
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: isDev ? "inline-source-map" : false,
};
