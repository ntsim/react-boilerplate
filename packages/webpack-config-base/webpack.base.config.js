const DotEnvPlugin = require('dotenv-webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

const getStyleLoaders = require('./utils/getStyleLoaders');

module.exports = {
  entry: {
    main: ['./src/main'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(png|svg|jpe?g|gif)(\?.*)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: require.resolve('url-loader'),
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
          require.resolve('sass-loader'),
        ),
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: getStyleLoaders(
          {
            importLoaders: 2,
          },
          require.resolve('sass-loader'),
        ),
        sideEffects: true,
      },
    ],
  },
  resolve: {
    alias: {
      src: path.resolve(process.cwd(), 'src'),
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
    new StyleLintPlugin(),
  ],
};
