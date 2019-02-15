const chalk = require('chalk');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackDevServer = require('webpack-dev-server');
const addEntries = require('webpack-dev-server/lib/utils/addEntries');
const webpack = require('webpack');
const argv = require('yargs').argv;

const devConfig = require('../webpack.dev.config');

const typescriptFormatter = ForkTsCheckerPlugin.createFormatter('codeframe');

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

let compiler;
let devServer;

const serverOptions = devConfig.devServer;

if (argv.host || !serverOptions.host) {
  serverOptions.host = argv.host || 'localhost';
}

if (argv.port || !serverOptions.port) {
  serverOptions.port = argv.port || 8080;
}

addEntries(devConfig, serverOptions);

try {
  compiler = webpack(devConfig);
} catch (err) {
  console.log(chalk.red('Failed to compile.'));
  console.log();
  console.log(err.message || err);
  console.log();
  process.exit(1);
}

let tsMessagesPromise;
let tsMessagesResolver;

compiler.hooks.beforeCompile.tap('beforeCompile', () => {
  tsMessagesPromise = new Promise(resolve => {
    tsMessagesResolver = msgs => {
      resolve(msgs);
    };
  });
});

ForkTsCheckerPlugin.getCompilerHooks(compiler).receive.tap(
  'afterTypeScriptCheck',
  (diagnostics, lints) => {
    const allMsgs = [...diagnostics, ...lints];

    const format = message => {
      return `${message.file}\n${typescriptFormatter(message, true)}`;
    };

    tsMessagesResolver({
      errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
      warnings: allMsgs.filter(msg => msg.severity === 'warning').map(format),
    });
  },
);

let isFirstCompile = true;

compiler.hooks.done.tap('done', async stats => {
  clearConsole();

  const statsData = stats.toJson({
    all: false,
    warnings: true,
    errors: true,
  });

  const { errors, warnings } = await tsMessagesPromise;
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

  isFirstCompile = false;

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
