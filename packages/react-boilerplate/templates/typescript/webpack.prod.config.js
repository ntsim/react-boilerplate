const fs = require('fs-extra');
const merge = require('webpack-merge');
const { prodConfig: baseConfig } = require('@ntsim/webpack-config-base');
const {
  prodConfig: reactConfig,
} = require('@ntsim/webpack-config-react-typescript');

fs.emptyDirSync('./build');

const config = merge(baseConfig, reactConfig);

module.exports = config;
