import puppeteer, { Browser, Page } from 'puppeteer';
import { getChalkLogger } from './chalk.service';

export { launchBrowser, getPuppeteerConfig, createPage, getChallengeDataFromPage };

const chalk = getChalkLogger();

const PUPPETEER_CONFIG = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

const NAVIGATION_CONFIG = {
  waitUntil: 'networkidle2' as const,
  timeout: 30000,
};

const getPuppeteerConfig = (): typeof PUPPETEER_CONFIG => PUPPETEER_CONFIG;

const launchBrowser = async (): Promise<Browser> => {
  try {
    const browser = await puppeteer.launch(PUPPETEER_CONFIG);
    return browser;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error launching browser: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    throw error;
  }
};

const createPage = async (browser: Browser, url: string): Promise<Page> => {
  const page = await browser.newPage();
  await page.goto(url, NAVIGATION_CONFIG);
  return page;
};

interface ChallengeDataStructure {
  props: {
    pageProps: {
      description: string;
      defaultCode: {
        typescript: string;
      };
      [key: string]: unknown;
    };
  };
}

const getChallengeDataFromPage = async (page: Page): Promise<ChallengeDataStructure | null> => {
  try {
    const jsonData = await page.evaluate(() => {
      // Look for Next.js data in __NEXT_DATA__
      const nextDataScript = document.getElementById('__NEXT_DATA__');
      if (nextDataScript && nextDataScript.textContent) {
        try {
          const data = JSON.parse(nextDataScript.textContent);
          return data;
        } catch {
          return null;
        }
      }
      return null;
    });

    return jsonData as ChallengeDataStructure | null;
  } catch (error) {
    console.warn(
      chalk.yellow(
        `⚠️  Could not extract Next.js data from page: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};
