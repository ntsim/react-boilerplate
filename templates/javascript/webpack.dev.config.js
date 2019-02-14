const merge = require('webpack-merge');
const { devConfig: baseConfig } = require('../../packages/webpack-config-base');
const { devConfig: reactConfig } = require('../../packages/webpack-config-react');

const config = merge(baseConfig, reactConfig);

module.exports = config;
