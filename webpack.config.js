const webpack = require('webpack');
const path = require('path');
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry:  path.join(__dirname, '/dashboard/src/js/Index.js'),
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    output: {
      path: path.join(__dirname, '/dashboard/static/js/'),
      filename: 'app.bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    },
    module: {
        rules: [
          //parse css files
          {
            test: /\.css$/,
            loader:[ 'style-loader', 'css-loader']
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            loader: 'url-loader'
          },
          {
            test: /\.js?/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader', // creates style nodes from JS strings
              },
              {
                loader: 'css-loader', // translates CSS into CommonJS
              },
              {
                loader: 'less-loader', // compiles Less to CSS
                options: {
                  sourceMap: false
                },
              },
            ],
          },
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "StayHome Dashboard",
        template: path.join(__dirname, '/dashboard/src/index.html'),
        filename: path.join(__dirname, '/dashboard/templates/index.html'),
        favicon: path.join(__dirname, '/dashboard/src/assets/img/favicon.ico'),
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          terserOptions: {
            compress: {
              comparisons: false
            },
            mangle: {
              safari10: true
            },
            output: {
              comments: false,
              ascii_only: true
            },
            warnings: false
          }
        }),
        new OptimizeCssAssetsPlugin(),
      ],
      splitChunks: {
        chunks: "all",
        minSize: 0,
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `${cacheGroupKey}.${packageName.replace("@", "")}`;
            }
          },
          common: {
            minChunks: 2,
            priority: -10
          }
        }
      }
    }
};

module.exports = config;
