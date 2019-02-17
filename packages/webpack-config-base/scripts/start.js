const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const addEntries = require('webpack-dev-server/lib/utils/addEntries');
const webpack = require('webpack');
const { argv } = require('yargs');
const asyncTaskMessages = require('../utils/asyncTaskMessages');

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
  );
}

module.exports = function startScript(config) {
  const serverOptions = config.devServer;

  if (argv.host || !serverOptions.host) {
    serverOptions.host = argv.host || 'localhost';
  }

  if (argv.port || !serverOptions.port) {
    serverOptions.port = argv.port || 8080;
  }

  addEntries(config, serverOptions);

  let compiler;
  let devServer;

  try {
    compiler = webpack(config);
  } catch (err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  compiler.hooks.done.tap('done', async stats => {
    clearConsole();

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const { errors, warnings } = await asyncTaskMessages.getMessages();
    statsData.errors.push(...errors);
    statsData.warnings.push(...warnings);

    stats.compilation.errors.push(...errors);
    stats.compilation.warnings.push(...warnings);

    clearConsole();

    if (errors.length > 0) {
      devServer.sockWrite(devServer.sockets, 'errors', errors);
    } else if (warnings.length > 0) {
      devServer.sockWrite(devServer.sockets, 'warnings', warnings);
    }

    const messages = statsData;

    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }

    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));
      return;
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n'));
    }
  });

  devServer = new WebpackDevServer(compiler, { ...serverOptions });

  devServer.listen(serverOptions.port, serverOptions.host, err => {
    if (err) {
      console.log(err);
    }

    clearConsole();

    console.log(chalk.cyan('Starting development server...'));
  });

  ['SIGINT', 'SIGTERM'].forEach(sig => {
    process.on(sig, () => {
      devServer.close();
      process.exit();
    });
  });

  return {
    compiler,
    devServer,
  };
};
