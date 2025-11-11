import puppeteer, { Browser, Page } from 'puppeteer';
import { getChalkLogger } from './chalk.service';

export { launchBrowser, getPuppeteerConfig, createPage, waitForElement, getElementContent };

const chalk = getChalkLogger();

const PUPPETEER_CONFIG = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

const NAVIGATION_CONFIG = {
  waitUntil: 'networkidle2' as const,
  timeout: 30000,
};

const SELECTOR_WAIT_CONFIG = {
  timeout: 5000,
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

const waitForElement = async (page: Page, selector: string): Promise<boolean> => {
  try {
    await page.waitForSelector(selector, SELECTOR_WAIT_CONFIG);
    return true;
  } catch {
    console.warn(
      chalk.yellow(`⚠️  Element not found: "${selector}", but continuing with page content...`),
    );
    return false;
  }
};

const getElementContent = async (page: Page, selector: string): Promise<string | null> => {
  try {
    const content = await page.$eval(selector, (el) => el.innerHTML);
    return content;
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error getting element content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};
