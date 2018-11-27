const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',
  },
  devtool: 'inline-source-map',
  module: {
    strictExportPresence: true,
  },
  plugins: [
    new HtmlPlugin({
      inject: true,
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    compress: true,
    contentBase: false,
    publicPath: '/',
    hot: true,
    overlay: true,
    historyApiFallback: true,
  },
});
