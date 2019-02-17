const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const asyncTaskMessages = require('@ntsim/webpack-config-base/utils/asyncTaskMessages');
const baseStartScript = require('@ntsim/webpack-config-base/scripts/start');

const typescriptFormatter = ForkTsCheckerPlugin.createFormatter('codeframe');

module.exports = function startScript(config) {
  const { compiler } = baseStartScript(config);

  compiler.hooks.beforeCompile.tap('beforeCompile', () => {
    asyncTaskMessages.startTask('forkTsChecker');
  });

  ForkTsCheckerPlugin.getCompilerHooks(compiler).receive.tap(
    'afterTypeScriptCheck',
    (diagnostics, lints) => {
      const allMsgs = [...diagnostics, ...lints];

      const format = message =>
        `${message.file}\n${typescriptFormatter(message, true)}`;

      asyncTaskMessages.resolveTaskMessages('forkTsChecker', {
        errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
        warnings: allMsgs.filter(msg => msg.severity === 'warning').map(format),
      });
    },
  );
};
