// webpack.client.js
const path = require("path");
const webpack = require("webpack");
require("dotenv").config();
const fs = require("fs");
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV !== "production";

// Maintenance mode (see src/constants/routing.ts). Fail-safe: builds of the production
// branch (Netlify sets BRANCH) default to on unless MAINTENANCE_MODE is set explicitly.
const maintenanceMode =
    process.env.MAINTENANCE_MODE ?? (process.env.BRANCH === "production" ? "true" : "false");

// Bundle and stylesheet names carry a hash of their content, so a page can only ever load the
// files it was built with: a browser (or in-app WebView) still holding an older bundle.js next
// to newer HTML failed to hydrate and left buttons dead until a refresh. The names go to
// dist/client-assets.json, which render.tsx reads.
const ASSETS_MANIFEST = path.resolve(__dirname, "dist/client-assets.json");

class AssetsManifestPlugin {
    apply(compiler) {
        compiler.hooks.done.tap("AssetsManifestPlugin", (stats) => {
            const files = Object.keys(stats.compilation.assets);
            const find = (ext) => files.find((file) => file.startsWith("_app/") && file.endsWith(ext));
            fs.writeFileSync(ASSETS_MANIFEST, JSON.stringify({ js: `/${find(".js")}`, css: `/${find(".css")}` }));
        });
    }
}

module.exports = {
    mode: isDev ? "development" : "production",
    entry: "./src/client/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist/client"),
        // Under /_app/ so Netlify can cache them for good (see the _headers file from prerender)
        filename: "_app/bundle.[contenthash:8].js",
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
            filename: "_app/styles.[contenthash:8].css",
        }),
        new AssetsManifestPlugin(),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    devtool: isDev ? "cheap-module-source-map" : false, // source maps only in dev
};