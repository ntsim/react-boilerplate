const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getStyleLoaders = (
  cssOptions = {},
  preProcessorLoader,
  env = process.env.NODE_ENV,
) => {
  const baseLoader =
    env === 'production'
      ? MiniCssExtractPlugin.loader
      : require.resolve('style-loader');

  const loaders = [
    baseLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        localIdentName: '[name]__[local]--[hash:base64:8]',
        sourceMap: true,
        ...cssOptions,
      },
    },
    { loader: require.resolve('postcss-loader') },
  ];

  if (preProcessorLoader) {
    loaders.push(preProcessorLoader);
  }

  return loaders;
};

module.exports = getStyleLoaders;
