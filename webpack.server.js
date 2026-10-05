// webpack.server.js
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
const nodeExternals = require("webpack-node-externals");

const isDev = process.env.NODE_ENV !== "production";

// Maintenance mode (see src/constants/routing.ts). Fail-safe: builds of the production
// branch (Netlify sets BRANCH) default to on unless MAINTENANCE_MODE is set explicitly.
const maintenanceMode =
    process.env.MAINTENANCE_MODE ?? (process.env.BRANCH === "production" ? "true" : "false");

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
        // Maintenance mode flag, baked in at build time (see src/constants/routing.ts)
        new webpack.DefinePlugin({
            "process.env.MAINTENANCE_MODE": JSON.stringify(maintenanceMode),
        }),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: isDev ? "inline-source-map" : false,
};
