import { getChalkLogger } from '../services/chalk.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export { fetchChallenge, fetchChallengeDev };

const CHALLENGE_URL_TEMPLATE = 'https://adventjs.dev/challenges';

// * Change this to load different local HTML files for development
// * Must remove dist folder and run build script after changing
const TEST_HTML_FILE = '2024-4-full.html';

const chalk = getChalkLogger();

const fetchChallenge = async (day: number, year): Promise<Response | null> => {
  const response = await fetch(`${CHALLENGE_URL_TEMPLATE}/${year}/${day}`);
  if (!response.ok) {
    console.error(
      chalk.red(
        `❌ Failed to fetch challenge for day ${day}. Please ensure the day number is correct.`,
      ),
    );
    return null;
  }
  return response;
};

const fetchChallengeDev = async (): Promise<Response | null> => {
  const htmlFileName = TEST_HTML_FILE;
  const htmlFilePath = resolve(__dirname, '../html', htmlFileName);

  try {
    const html = readFileSync(htmlFilePath, 'utf8');
    console.log(chalk.cyan(`📋 Loaded ${htmlFileName} from local files`));

    return new Response(html, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    console.error(chalk.red(`❌ Could not find local HTML file. Expected: ${htmlFileName}`));
    return null;
  }
};
