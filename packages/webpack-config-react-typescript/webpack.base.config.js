const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  plugins: [
    new ForkTsCheckerPlugin({
      async: true,
      checkSyntacticErrors: true,
      reportFiles: ['src/**/*.{ts,tsx}'],
      tslint: true,
      useTypescriptIncrementalApi: true,
      watch: './src',
      silent: true,
    }),
  ],
};
