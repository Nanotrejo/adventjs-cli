import { getChalkLogger } from './chalk.service';
import { launchBrowser, createPage, waitForElement, getElementContent } from './puppeteer.service';
import { FunctionData, ChallengeData } from '../schema/scrapping.schema';

export { getChallengeData };

const ID_DESCRIPTION = 'challenge-description';
const CLASS_FUNCTION_BLOCK = '.view-lines';
const chalk = getChalkLogger();

const getChallengeData = async (url: string, day: number): Promise<ChallengeData | null> => {
  try {
    const browser = await launchBrowser();
    const page = await createPage(browser, url);

    await waitForElement(page, `#${ID_DESCRIPTION}`);
    await waitForElement(page, CLASS_FUNCTION_BLOCK);

    const challengeDescription = await getElementContent(page, `#${ID_DESCRIPTION}`);
    const functionBLockHTML = await getElementContent(page, CLASS_FUNCTION_BLOCK);

    await browser.close();

    if (!challengeDescription) {
      console.error(
        chalk.red(
          `❌ Could not find the challenge description for day ${day}. The structure of the page may have changed.`,
        ),
      );
      return null;
    }

    if (!functionBLockHTML) {
      console.error(
        chalk.red(
          `❌ Could not find the challenge function for day ${day}. The structure of the page may have changed.`,
        ),
      );
      return null;
    }

    // Parse function data
    const functionData = _parseFunctionData(functionBLockHTML);
    if (!functionData) {
      console.error(chalk.red(`❌ Could not parse the function data for day ${day}.`));
      return null;
    }

    return {
      description: challengeDescription,
      functionData,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error fetching challenge data for day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const _parseFunctionData = (htmlCode: string): FunctionData | null => {
  let cleaned = htmlCode.replace(/<div[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/div>/g, '');
  cleaned = cleaned.replace(/<span[^>]*>/g, '');
  cleaned = cleaned.replace(/<\/span>/g, '');

  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&amp;/g, '&');

  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  const functionNameMatch = cleaned.match(/(?:function|const)\s+(\w+)\s*(?:\(|=)/);

  if (!functionNameMatch || !functionNameMatch[1]) {
    return null;
  }

  const functionName = functionNameMatch[1];

  return {
    functionName,
    functionCode: cleaned,
  };
};
