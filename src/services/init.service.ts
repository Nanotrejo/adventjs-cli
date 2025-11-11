import { getChalkLogger } from './chalk.service';
import inquirer from 'inquirer';
import {
  DependenciesAnswer,
  TestsAnswer,
  ConfigFilesAnswer,
  YearAnswer,
  GenerateProjectAnswer,
  GenerateGitProjectAnswer,
} from '../schema/answer.schema';
import { spawn } from 'child_process';
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
  let generateProject = true;
  let generateGitProject = true;

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

    const generateProjectAnswer = await inquirer.prompt<GenerateProjectAnswer>({
      type: 'confirm',
      name: 'generateProject',
      message: 'Do you want to generate the AdventJS project now?',
      default: true,
    });
    generateProject = generateProjectAnswer.generateProject;

    const generateGitProjectAnswer = await inquirer.prompt<GenerateGitProjectAnswer>({
      type: 'confirm',
      name: 'generateGitProject',
      message: 'Do you want to generate a git project?',
      default: true,
    });
    generateGitProject = generateGitProjectAnswer.generateGitProject;
  }

  createRootFolder(year);

  generateConfig(year, tests, configFiles, dependencies);

  await _generateProject(generateProject, year);
  await _generateGitProject(generateGitProject, year);

  _generateConfigFiles(configFiles, year);

  await _installDependencies(dependencies, year);

  console.log(chalk.bold.green('🎉 Your AdventJS project is ready! Happy coding!'));
  console.log(chalk.bold.green('🚀 To get started, cd ' + getRootFolderName(year)));
};

const _installDependencies = (shouldInstall: boolean, year: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldInstall) {
      resolve();
      return;
    }
    console.log(chalk.blue('Installing dependencies... (this may take a few moments)'));

    const child = spawn('npm', ['install', '--save-dev', ...DEV_DEPENDENCIES], {
      cwd: getRootFolderName(year),
      stdio: 'inherit',
    });

    child.on('close', (code: number) => {
      if (code !== 0) {
        console.error(
          chalk.red(`❌ Error installing dependencies: process exited with code ${code}`),
        );
        reject(new Error(`npm install failed with code ${code}`));
        return;
      }
      console.log(chalk.green('✅ Dependencies installed successfully'));
      resolve();
    });

    child.on('error', (error: Error) => {
      console.error(chalk.red(`❌ Error installing dependencies: ${error.message}`));
      reject(error);
    });
  });
};

const _generateProject = (shouldGenerate: boolean, year: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldGenerate) {
      resolve();
      return;
    }
    console.log(chalk.blue('Generating AdventJS project...'));
    try {
      copyFromTemplatesWithReplacement(year, CONFIG_FILE.PACKAGE_JSON);
      console.log(chalk.green('✅ AdventJS project generated successfully'));
      resolve();
    } catch (error) {
      console.error(
        chalk.red(
          `❌ Error generating project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ),
      );
      reject(error);
    }
  });
};

const _generateGitProject = (shouldGenerate: boolean, year: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!shouldGenerate) {
      resolve();
      return;
    }
    console.log(chalk.blue('Generating git project...'));

    const child = spawn('git', ['init'], {
      cwd: getRootFolderName(year),
      stdio: 'inherit',
    });

    child.on('close', (code: number) => {
      if (code !== 0) {
        console.error(
          chalk.red(`❌ Error generating git project: process exited with code ${code}`),
        );
        reject(new Error(`git init failed with code ${code}`));
        return;
      }
      console.log(chalk.green('✅ Git project generated successfully'));
      resolve();
    });

    child.on('error', (error: Error) => {
      console.error(chalk.red(`❌ Error generating git project: ${error.message}`));
      reject(error);
    });
  });
};
const _generateConfigFiles = (shouldGenerate: boolean, year: string): void => {
  if (shouldGenerate) {
    _generateGitignore(year);
    _generateEslintConfig(year);
    _generatePrettierConfig(year);
    _generateVscodeConfig(year);
    _generateReadme(year);
    _generateTestsConfig(year);
    _generateGithubConfig(year);

    console.log(chalk.green('✅ Configuration files generated'));
  }
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
