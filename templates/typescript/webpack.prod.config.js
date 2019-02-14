const fs = require('fs-extra');
const merge = require('webpack-merge');
const { prodConfig: baseConfig } = require('../../packages/webpack-config-base');
const { prodConfig: reactConfig } = require('../../packages/webpack-config-react-typescript');

fs.emptyDirSync('./build');

const config = merge(baseConfig, reactConfig);

module.exports = config;
