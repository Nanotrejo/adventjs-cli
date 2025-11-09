#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import { writeFileSync } from 'fs';
import chalk from 'chalk';
import { exec } from 'child_process';
import { DependenciesAnswer, TestsAnswer, VscodeAnswer, YearAnswer } from './answer.schema';

const program = new Command();
const description = `AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡

📝 Generates TypeScript starter files + tests
📖 Adds challenge description in Markdown format
⚙️ Handles project init, dependencies, and config automatically
📅 Ready for 2024, 2025, and beyond

Focus on solving the challenges, not setting them up! 🚀`;

program.name('adventjs-cli').description(description).version('1.0.0');

const testsDevDependencies = ['@types/jest', 'jest', 'ts-jest'];
const prettierDevDependencies = ['prettier'];
const eslintDevDependencies = [
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
];
const typescriptDevDependencies = ['typescript', 'ts-node'];

const devDependencies = [
  ...testsDevDependencies,
  ...prettierDevDependencies,
  ...eslintDevDependencies,
  ...typescriptDevDependencies,
];

const main = async (): Promise<void> => {
  await init();
  await generateDay();

  program.parse(process.argv);
};

const init = async (): Promise<void> => {
  program
    .command('init')
    .description('Run step-by-step configuration')
    .action(async () => {
      console.log(
        chalk.bold.cyan(
          'AdventJS CLI Generator – Spin up your AdventJS challenges in seconds! 🎄⚡',
        ),
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
      writeFileSync('adventjs-cli.json', JSON.stringify(config, null, 2));

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
    });
};

const generateDay = async (): Promise<void> => {
  program
    .command('g <day>')
    .description('Generate boilerplate for a specific day')
    .action(async (day: string) => {
      const dayNumber = parseInt(day, 10);
      // NOTE: we may need to adjust this range for future years. Some challenges have more than 25 days. Example: 2024 has 26 challenges.
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 25) {
        console.error(chalk.red('❌ Please provide a valid day number between 1 and 25.'));
        return;
      }
    });
};

main();
