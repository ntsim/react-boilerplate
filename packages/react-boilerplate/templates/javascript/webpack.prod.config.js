const fs = require('fs-extra');
const merge = require('webpack-merge');
const { prodConfig: baseConfig } = require('../../../webpack-config-base');
const { prodConfig: reactConfig } = require('../../../webpack-config-react');

fs.emptyDirSync('./build');

const config = merge(baseConfig, reactConfig);

module.exports = config;
