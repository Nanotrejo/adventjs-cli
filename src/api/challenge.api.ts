import { getChalkLogger } from '../services/chalk.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import puppeteer from 'puppeteer';

export { fetchChallenge, fetchChallengeDev };

const CHALLENGE_URL_TEMPLATE = 'https://adventjs.dev/challenges';

// * Change this to load different local HTML files for development
// * Must remove dist folder and run build script after changing
const TEST_HTML_FILE = '2024-4-full.html';

const chalk = getChalkLogger();

const fetchChallenge = async (day: number, year): Promise<Response | null> => {
  const url = `${CHALLENGE_URL_TEMPLATE}/${year}/${day}`;

  try {
    console.log(chalk.cyan(`🌐 Fetching challenge from ${url}...`));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    try {
      await page.waitForSelector('.view-lines', { timeout: 5000 });
    } catch {
      console.warn(chalk.yellow('⚠️  View lines not found, but continuing...'));
    }

    const html = await page.content();
    await browser.close();

    console.log(chalk.green('✅ Successfully fetched challenge content'));

    return new Response(html, {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Failed to fetch challenge for day ${day}. Please ensure the day number is correct. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const fetchChallengeDev = async (): Promise<Response | null> => {
  const htmlFileName = TEST_HTML_FILE;
  const htmlFilePath = resolve(__dirname, '../examples', htmlFileName);

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
