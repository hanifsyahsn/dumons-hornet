// webpack.client.js
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
    mode: isDev ? "development" : "production",
    entry: "./src/client/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist/client"),
        filename: "bundle.js",
        clean: true,
        publicPath: "/",
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
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                ],
            },
        ],
    },
    plugins: [
        // Default route for "/", baked in at build time (see src/constants/routing.ts)
        new webpack.DefinePlugin({
            "process.env.DEFAULT_ROUTE": JSON.stringify(process.env.DEFAULT_ROUTE || ""),
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css",
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: isDev ? "cheap-module-source-map" : false, // source maps only in dev
};