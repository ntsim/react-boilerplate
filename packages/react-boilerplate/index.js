#!/usr/bin/env node

const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const printSuccess = message => console.log(chalk.green(message));
const printWarning = message => console.log(chalk.yellow(message));
const printError = message => console.error(chalk.red(message));

const runScript = async () => {
  const { projectDir, template } = await inquirer.prompt([
    {
      name: 'projectDir',
      message: 'What should the project directory be called?',
      validate(value) {
        return !!value;
      },
    },
    {
      name: 'template',
      type: 'list',
      message: 'What React project template do you want to use?',
      choices: [
        {
          name: 'Javascript',
          value: 'javascript',
        },
        {
          name: 'Typescript',
          value: 'typescript',
        },
      ],
    },
  ]);

  const templatePath = path.resolve(__dirname, 'templates', template);

  if (!fs.existsSync(templatePath)) {
    console.error('Template could not be found');
    return;
  }

  const appPath = path.resolve(process.cwd(), projectDir);

  if (fs.existsSync(appPath)) {
    printWarning(
      'Project directory already exists. Existing files could be overwritten!',
    );

    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        message: chalk.yellow('Are you sure you want to continue?'),
        type: 'confirm',
      },
    ]);

    if (!confirm) {
      printSuccess('Exiting. Did not generate anything.');
      process.exit(0);
    }
  }

  fs.copySync(templatePath, appPath);

  // Modify package.json with any dynamic fields
  const packageJsonPath = path.join(appPath, 'package.json');
  const packageJson = require(packageJsonPath);

  packageJson.name = projectDir;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  printSuccess('Finished generating project!');
};

runScript().catch(error => {
  printError(error);
  process.exit(1);
});
