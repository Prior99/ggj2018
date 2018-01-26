const Webpack = require('webpack');
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const path = require('path');

const gitRevision = new GitRevisionPlugin({ lightweightTags: true });

module.exports = {
    entry: {
        bundle: path.resolve(__dirname, "src"),
    },
    context: __dirname + "/dist/",
    output: {
        path: __dirname + "/dist/",
        filename: "[name].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        alias: {
            pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            "phaser-ce": path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|woff|ttf|woff2|eot|ase)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            hash: "sha512",
                            digest: "hex",
                            name: "[hash].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.tsx?/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /pixi\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "PIXI"
                    }
                ]
            },
            {
                test: /phaser-split\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "Phaser"
                    }
                ]
            },
            {
                test: /p2\.js$/,
                use: [
                    {
                        loader: "expose-loader",
                        options: "p2"
                    }
                ]
            }
        ]
    },
    devtool: "source-map",
    devServer: {
        port: 4000,
        historyApiFallback: true,
        contentBase: __dirname + "/dist/"
    },
    plugins: [
        new Webpack.DefinePlugin({
            // Taken and adapted from the official README.
            // See: https://www.npmjs.com/package/git-revision-webpack-plugin
            "SOFTWARE_VERSION": JSON.stringify(gitRevision.version()),
        })
    ]
};
