import { getChalkLogger } from './chalk.service';
import { launchBrowser, createPage, getChallengeDataFromPage } from './puppeteer.service';
import { FunctionData, ChallengeData } from '../schema/scrapping.schema';

export { getChallengeDataFromJson };

const chalk = getChalkLogger();

const getChallengeDataFromJson = async (
  url: string,
  day: number,
): Promise<ChallengeData | null> => {
  try {
    const browser = await launchBrowser();
    const page = await createPage(browser, url);

    // Extract JSON data that was already loaded with the page
    const jsonData = await getChallengeDataFromPage(page);

    await browser.close();

    if (!jsonData || !jsonData.props || !jsonData.props.pageProps) {
      console.error(chalk.red(`❌ Could not find JSON data in page for day ${day}.`));
      return null;
    }

    const pageProps = jsonData.props.pageProps;
    const description = pageProps.description;
    const typescriptCode = pageProps.defaultCode?.typescript;

    if (!description || !typescriptCode) {
      console.error(
        chalk.red(`❌ Missing description or TypeScript code in page data for day ${day}.`),
      );
      return null;
    }

    // Parse function data from TypeScript code
    const functionData = _parseFunctionData(typescriptCode);
    if (!functionData) {
      console.error(chalk.red(`❌ Could not parse the function data for day ${day}.`));
      return null;
    }

    chalk.green(`✓ Challenge data extracted from page JSON for day ${day}`);

    return {
      description,
      functionData,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Error fetching challenge data from JSON for day ${day}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ),
    );
    return null;
  }
};

const _parseFunctionData = (codeText: string): FunctionData | null => {
  // First, split by \n to preserve line breaks from JSON
  let lines = codeText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Decode any HTML entities
  lines = lines.map((line) => {
    let decoded = line;
    decoded = decoded.replace(/&nbsp;/g, ' ');
    decoded = decoded.replace(/&lt;/g, '<');
    decoded = decoded.replace(/&gt;/g, '>');
    decoded = decoded.replace(/&amp;/g, '&');
    decoded = decoded.replace(/&quot;/g, '"');
    // eslint-disable-next-line quotes
    decoded = decoded.replace(/&#39;/g, "'");
    return decoded;
  });

  // Join back with newlines to preserve structure
  let cleaned = lines.join('\n').trim();

  // Find export statement if exists and remove it (export will be added separately)
  const exportMatch = cleaned.match(/export\s*{\s*(\w+)\s*}/);
  let functionName = '';

  if (exportMatch && exportMatch[1]) {
    functionName = exportMatch[1];
    // Remove export from the code
    cleaned = cleaned.replace(/export\s*{\s*(\w+)\s*}\s*;?\n?/g, '');
  }

  // If no export found, try to find function name from declaration
  if (!functionName) {
    const functionNameMatch = cleaned.match(
      /(?:type\s+\w+.*?\n)?(?:function|const)\s+(\w+)\s*(?:\(|=)/,
    );
    if (functionNameMatch && functionNameMatch[1]) {
      functionName = functionNameMatch[1];
    }
  }

  if (!functionName) {
    return null;
  }

  // Clean up any remaining multiple blank lines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');

  // Final trim
  cleaned = cleaned.trim();

  return {
    functionName,
    functionCode: cleaned,
  };
};
