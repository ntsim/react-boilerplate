const merge = require('webpack-merge');
const { devConfig: baseConfig } = require('../../../webpack-config-base');
const { devConfig: reactConfig } = require('../../../webpack-config-react-typescript');

const config = merge(baseConfig, reactConfig);

module.exports = config;
