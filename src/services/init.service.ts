import { getChalkLogger } from './chalk.service';
import inquirer from 'inquirer';
import {
  DependenciesAnswer,
  TestsAnswer,
  ConfigFilesAnswer,
  YearAnswer,
} from '../schema/answer.schema';
import { exec } from 'child_process';
import { DEV_DEPENDENCIES } from '../schema/dependencies.schema';
import {
  CONFIG_FILE,
  copyFromTemplates,
  copyFromTemplatesWithReplacement,
  createRootFolder,
  getRootFolderName,
} from './file.service';
import { isDev } from './dev.service';
import { generateConfig } from './config.service';

export { handleInit };

const chalk = getChalkLogger();

const handleInit = async (): Promise<void> => {
  console.log(
    chalk.bold.cyan('AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡'),
  );

  const dev = isDev();
  let year = '2024';
  let tests = true;
  let configFiles = true;
  let dependencies = true;

  if (!dev) {
    const yearAnswer = await inquirer.prompt<YearAnswer>({
      type: 'list',
      name: 'year',
      message: 'Choose the year of the AdventJS challenges you want to set up:',
      choices: ['2024'],
    });
    year = yearAnswer.year;

    const testsAnswer = await inquirer.prompt<TestsAnswer>({
      type: 'confirm',
      name: 'tests',
      message: 'Do you want to use tests? (Recommended)',
      default: true,
    });
    tests = testsAnswer.tests;

    const configFilesAnswer = await inquirer.prompt<ConfigFilesAnswer>({
      type: 'confirm',
      name: 'configFiles',
      message:
        'Do you want to generate config files for Prettier, VSCode, and other tools? (Recommended)',
      default: true,
    });
    configFiles = configFilesAnswer.configFiles;

    const dependenciesAnswer = await inquirer.prompt<DependenciesAnswer>({
      type: 'confirm',
      name: 'dependencies',
      message: 'Do you want to install dependencies? (Recommended)',
      default: true,
    });
    dependencies = dependenciesAnswer.dependencies;
  }

  createRootFolder(year);

  generateConfig(year, tests, configFiles, dependencies);

  if (configFiles) {
    _generateGitignore(year);
    _generateEslintConfig(year);
    _generatePrettierConfig(year);
    _generateVscodeConfig(year);
    _generateReadme(year);
    _generateTestsConfig(year);
    _generateGithubConfig(year);

    console.log(chalk.green('✅ Configuration files generated'));
  }

  _installDependencies(dependencies);
  console.log(chalk.bold.green('🎉 Your AdventJS project is ready! Happy coding!'));
  console.log(chalk.bold.green('🚀 To get started, cd ' + getRootFolderName(year)));
};

const _installDependencies = (shouldInstall: boolean): void => {
  if (!shouldInstall) {
    return;
  }
  console.log(chalk.blue('Installing dependencies... (this may take a few moments)'));

  exec(
    `npm install --save-dev ${DEV_DEPENDENCIES.join(' ')}`,
    (error: Error | null, stdout: string, stderr: string): void => {
      if (error) {
        console.error(chalk.red(`❌ Error installing dependencies: ${error.message}`));
        return;
      }
      if (stderr) {
        console.error(chalk.yellow(`stderr: ${stderr}`));
        return;
      }
      console.log(chalk.green('✅ Dependencies installed successfully'));
    },
  );
};

const _generateVscodeConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.VSCODE);
};

const _generateReadme = (year: string): void => {
  copyFromTemplatesWithReplacement(year, CONFIG_FILE.README);
  console.log(chalk.blue('Generating README.md file...'));
};

const _generateTestsConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.JEST);
  console.log(chalk.blue('Generating tests configuration...'));
};

const _generateGitignore = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.GITIGNORE);
  console.log(chalk.blue('Generating .gitignore file...'));
};

const _generateEslintConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.ESLINT);
  console.log(chalk.blue('Generating ESLint configuration...'));
};

const _generatePrettierConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.PRETTIER);
  copyFromTemplates(year, CONFIG_FILE.PRETTIER_IGNORE);
  console.log(chalk.blue('Generating Prettier configuration...'));
};

const _generateGithubConfig = (year: string): void => {
  copyFromTemplates(year, CONFIG_FILE.GITHUB);
  console.log(chalk.blue('Generating GitHub configuration...'));
};
