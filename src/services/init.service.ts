import chalk from 'chalk';
import inquirer from 'inquirer';
import { DependenciesAnswer, TestsAnswer, VscodeAnswer, YearAnswer } from '../schema/answer.schema';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
import { DEV_DEPENDENCIES } from '../schema/dependencies.schema';
import { CONFIG_FILE } from '../schema/app.schema';

export { handleInit };

const handleInit = async (): Promise<void> => {
  console.log(
    chalk.bold.cyan('AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡'),
  );

  const { year } = await inquirer.prompt<YearAnswer>({
    type: 'list',
    name: 'year',
    message: 'Choose the year of the AdventJS challenges you want to set up:',
    choices: ['2024'],
  });

  const { tests } = await inquirer.prompt<TestsAnswer>({
    type: 'confirm',
    name: 'tests',
    message: 'Do you want to generate tests files? (Recommended)',
    default: true,
  });

  const { vscode } = await inquirer.prompt<VscodeAnswer>({
    type: 'confirm',
    name: 'vscode',
    message: 'Do you want to generate vscode config files?',
    default: true,
  });

  const { dependencies } = await inquirer.prompt<DependenciesAnswer>({
    type: 'confirm',
    name: 'dependencies',
    message: 'Do you want to install dependencies?',
    default: true,
  });

  const config = { year, tests, vscode, dependencies };
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));

  console.log(chalk.green('✅ Configuration saved to adventjs-cli.json:'), config);

  _generateGitignore();
  _generateEslintConfig();
  _generatePrettierConfig();

  _installDependencies(dependencies);
  _generateVscodeConfig(vscode);
  _generateReadme(year);
  _generateTestsConfig(tests);
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

const _generateVscodeConfig = (shouldGenerate: boolean): void => {
  if (!shouldGenerate) {
    return;
  }
};

const _generateReadme = (year: string): void => {};

const _generateTestsConfig = (shouldGenerate: boolean): void => {
  if (!shouldGenerate) {
    return;
  }
};

const _generateGitignore = (): void => {};

const _generateEslintConfig = (): void => {};

const _generatePrettierConfig = (): void => {};
