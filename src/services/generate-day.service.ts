import chalk from 'chalk';
import { parseConfig } from './config.service';

export { handleGenerateDay };

const handleGenerateDay = async (day: string): Promise<void> => {
  const config = await parseConfig();
  if (!config) {
    return;
  }

  const dayNumber = parseInt(day, 10);
  // NOTE: we may need to adjust this range for future years. Some challenges have more than 25 days. Example: 2024 has 26 challenges.
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 25) {
    console.error(chalk.red('❌ Please provide a valid day number between 1 and 25.'));
    return;
  }

  //await fetch(`https://adventjs.dev/challenges/${config.year}/${dayNumber}`);
};
