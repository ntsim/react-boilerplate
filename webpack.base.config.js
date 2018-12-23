const DotEnvPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const getStyleLoaders = (
  cssOptions = {},
  preProcessorLoader,
  env = process.env.NODE_ENV,
) => {
  const baseLoader =
    env === 'production' ? MiniCssExtractPlugin.loader : 'style-loader';

  const loaders = [
    baseLoader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        localIdentName: '[name]__[local]--[hash:base64:8]',
        sourceMap: true,
        ...cssOptions,
      },
    },
    { loader: 'postcss-loader' },
  ];

  if (preProcessorLoader) {
    loaders.push(preProcessorLoader);
  }

  return loaders;
};

module.exports = {
  entry: {
    main: './src/main.js',
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(png|svg|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: getStyleLoaders(),
        sideEffects: true,
      },
      {
        test: /\.module\.scss$/,
        use: getStyleLoaders(
          {
            importLoaders: 2,
            modules: true,
          },
          'sass-loader',
        ),
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: getStyleLoaders(
          {
            importLoaders: 2,
          },
          'sass-loader',
        ),
        sideEffects: true,
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: '-',
      chunks: 'all',
    },
    runtimeChunk: {
      name: 'manifest',
    },
  },
  plugins: [
    new DotEnvPlugin({
      path: process.env.ENV_FILE ? `./.env.${process.env.ENV_FILE}` : './.env',
      safe: true,
    }),
  ],
};
