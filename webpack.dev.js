const path = require("path");
// const uglify = require("uglifyjs-webpack-plugin");
const htmlPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
module.exports = {
    target: "electron-renderer",
    devtool: 'cheap-module-eval-source-map',
    mode: "development",
    entry: {
        main: "./app/index.tsx"
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js",
        publicPath: '/',
        chunkFilename: "[name].chunk.js"
    },
    module: {
        rules: [
            // { test: /\.tsx?$/, loader: "ts-loader" },
            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
               test: /\.(ts|tsx|jsx|js)$/,
               use: {
                   loader: 'babel-loader',
                   options: {
                       presets: [
                        ["@babel/preset-env", {
                            targets: {
                              electron: "8.2.0"
                            }
                          }],
                          "@babel/preset-react",
                          "@babel/preset-typescript"
                       ],
                       "plugins": [
                            "@babel/plugin-transform-runtime",
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-proposal-class-properties',
                            ["import", {
                                "libraryName": "antd",
                                "libraryDirectory": "es",
                                "style": "css" // `style: true` 会加载 less 文件
                            }]
                        ]
                   }
               },
               exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "sass-loader"},
                    {loader: "postcss-loader"}
                ]
            },
            // {
            //     test: /\.(png|jpg|gif|jpeg)/,
            //     use: [
            //         {
            //             loader: "url-loader",
            //             options: {
            //                 limit: 500,
            //                 name: ("imgs/[name].[hash:5].[ext]"),
            //                 publicPath: "./"
            //             }
            //         }
            //     ]
            // },
            
            {
                test: /\.(woff|woff2|svg|eot|ttf|png)$/,
                loader: 'file-loader',
                options: {
                    name: ("static/[name].[hash:5].[ext]"),
                    publicPath: "./"
                }
            }
        ]
    },
    plugins: [
        // new uglify()
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            // hash: true,
            template: "./index.html",
            favicon: "./favicon.png",
            // chunks: ["vendor", "myCommon", "main"]
        }),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('production'),
            _DEV_: JSON.stringify(true),
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new ErrorOverlayPlugin(),
        new ForkTsCheckerWebpackPlugin({
            // 将async设为false，可以阻止Webpack的emit以等待类型检查器/linter，并向Webpack的编译添加错误。
            async: false
        }),
        // 将TypeScript类型检查错误以弹框提示
        // 如果fork-ts-checker-webpack-plugin的async为false时可以不用
        // 否则建议使用，以方便发现错误
        // new ForkTsCheckerNotifierWebpackPlugin({
        //     title: 'TypeScript',
        //     excludeWarnings: true,
        //     skipSuccessful: true,
        // })
    ],
    resolve: {
        alias: {
          "@ant-design/icons/lib/dist$": path.resolve(__dirname, "./app/components/icons.js"),
          "@node-addEventListener": "rc-util/lib/Dom/addEventListener",
          "@app-component": path.resolve(__dirname, "./app/components"),
          "@app-data": path.resolve(__dirname, "./app/data"),
          "@app-util": path.resolve(__dirname, "./app/util"),
          "@app-store": path.resolve(__dirname, "./app/store"),
          "@app": path.resolve(__dirname, "./app"),
        },
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    externals: {
        puppeteer: 'require("puppeteer-core")',
        // ...
    },
    // node: {
    //   fs: "empty"
    // },
    node: {
      __dirname: false
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./dist"),
        host: "localhost",
        compress: true,
        port: 8888,
        hot: true,
        proxy: {
            '/api/*': {
                target: 'http://122.152.198.220',
                // pathRewrite: {'^/api' : ''},
                secure: false,
                changeOrigin: true,
            },
            '/QertImage/*': {
                target: 'http://122.152.198.220',
                // pathRewrite: {'^/api' : ''},
                secure: false,
                changeOrigin: true,
            }
        }
    }
};