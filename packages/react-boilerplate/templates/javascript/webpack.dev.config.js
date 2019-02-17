const merge = require('webpack-merge');
const { devConfig: baseConfig } = require('@ntsim/webpack-config-base');
const { devConfig: reactConfig } = require('@ntsim/webpack-config-react');

const config = merge(baseConfig, reactConfig);

module.exports = config;
