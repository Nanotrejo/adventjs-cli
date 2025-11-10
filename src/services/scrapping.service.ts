import { load } from 'cheerio';
import { getChalkLogger } from './chalk.service';
import { FunctionData } from '../schema/scrapping.schema';

export { getDescription, getFunctionData };

const ID_DESCRIPTION = 'challenge-description';
const CLASS_FUNCTION_BLOCK = '.view-lines';
const chalk = getChalkLogger();

const getDescription = (html: string, day: number): string | null => {
  const $ = load(html);

  const challengeDescription = $(`#${ID_DESCRIPTION}`).html();
  if (!challengeDescription) {
    console.error(
      chalk.red(
        `❌ Could not find the challenge description for day ${day}. The structure of the page may have changed.`,
      ),
    );
    return null;
  }

  return challengeDescription;
};

const getFunctionData = (html: string): FunctionData | null => {
  const $ = load(html);

  const viewLinesDiv = $(CLASS_FUNCTION_BLOCK).first();

  if (viewLinesDiv.length === 0) {
    return null;
  }

  const viewLinesHTML = viewLinesDiv.html();

  if (!viewLinesHTML) {
    return null;
  }

  return _parseFunctionData(viewLinesHTML);
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
