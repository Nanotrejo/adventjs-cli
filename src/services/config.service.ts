import chalk from 'chalk';
import { CONFIG_FILE } from '../schema/app.schema';
import { ConfigSchema } from '../schema/config.schema';
import { promisify } from 'util';
import { readFile } from 'fs';

export { parseConfig, readConfigAsync };

const readConfigAsync = promisify(readFile);

const parseConfig = async (): Promise<ConfigSchema | null> => {
  try {
    const data = await readConfigAsync(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    console.error(
      chalk.red(
        '❌ Configuration file adventjs-cli.json not found. Please run "adventjs-cli init" first.',
      ),
    );
    return null;
  }
};
