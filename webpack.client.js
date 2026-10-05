// webpack.client.js
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV !== "production";

// Maintenance mode (see src/constants/routing.ts). Fail-safe: builds of the production
// branch (Netlify sets BRANCH) default to on unless MAINTENANCE_MODE is set explicitly.
const maintenanceMode =
    process.env.MAINTENANCE_MODE ?? (process.env.BRANCH === "production" ? "true" : "false");

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
        // Maintenance mode flag, baked in at build time (see src/constants/routing.ts)
        new webpack.DefinePlugin({
            "process.env.MAINTENANCE_MODE": JSON.stringify(maintenanceMode),
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