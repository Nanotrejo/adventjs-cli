import chalk from 'chalk';
import inquirer from 'inquirer';
import { DependenciesAnswer, TestsAnswer, VscodeAnswer, YearAnswer } from '../schema/answer.schema';
import { devDependencies } from '../schema/dependencies.schema';
import { exec } from 'child_process';
import { writeFileSync } from 'fs';
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

  if (dependencies) {
    console.log(chalk.blue('Installing dependencies... (this may take a few moments)'));

    exec(
      `npm install --save-dev ${devDependencies.join(' ')}`,
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
  }
};
