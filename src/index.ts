#!/usr/bin/env node
import { Command } from 'commander';
import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from './schema/app.schema';
import { ALL_COMMANDS } from './schema/command.schema';
import { isDev, loadEnv } from './services/dev.service';

const program = new Command();

program.name(APP_NAME).description(APP_DESCRIPTION).version(APP_VERSION);

const main = async (): Promise<void> => {
  loadEnv();
  const devMode = isDev();
  if (devMode) {
    console.log('🔧 DEV MODE ENABLED');
  }
  await initAllCommands();
  program.parse(process.argv);
};

const initAllCommands = async (): Promise<void> => {
  const commands = ALL_COMMANDS;
  commands.forEach((cmd) => {
    program
      .command(cmd.command)
      .description(cmd.description)
      .action((...args: unknown[]) => cmd.function(...args));
  });
};

main();
