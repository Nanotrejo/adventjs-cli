import { parseConfig } from './config.service';
import { getChalkLogger } from './chalk.service';
import { addDayHeader, htmlToMarkdown } from './markdown.service';
import { isDev } from './dev.service';
import { fetchChallenge, fetchChallengeDev } from '../api/challenge.api';
import { createFile, createFolderUnderRoot, SavePath } from './file.service';
import { formatDayNumber } from './parsing.service';
import { FunctionData } from '../schema/scrapping.schema';
import { getDescription, getFunctionData } from './scrapping.service';

export { handleGenerateDay };

const chalk = getChalkLogger();

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

  const response = isDev()
    ? await fetchChallengeDev()
    : await fetchChallenge(dayNumber, config.year);

  if (!response) {
    return;
  }

  const html = await response.text();

  const challengeFunctionData = getFunctionData(html);
  if (!challengeFunctionData) {
    console.error(chalk.red(`❌ Could not parse the challenge function for day ${dayNumber}.`));
    return;
  }

  const challengeDescription = getDescription(html, dayNumber);
  if (!challengeDescription) {
    console.error(chalk.red(`❌ Could not parse the challenge description for day ${dayNumber}.`));

    return;
  }

  const markdown = htmlToMarkdown(challengeDescription);
  const markdownWithHeader = addDayHeader(markdown, dayNumber);

  _saveDayFiles(config.year, dayNumber, markdownWithHeader, challengeFunctionData);

  console.log(
    chalk.green(`✅ Challenge ${dayNumber} for year ${config.year} generated successfully.`),
  );
};

const _saveDayFiles = (
  year: string,
  day: number,
  descriptionMarkdown: string,
  functionData: FunctionData,
): void => {
  console.log(chalk.blue(`Generating files for Day ${day}...`));
  const dayFormatted = formatDayNumber(String(day));
  const dayFolderName = dayFormatted;

  // Create day folder under root
  createFolderUnderRoot(year, dayFolderName);

  // Save the description markdown file inside the day folder
  const mdDayFileName = `${dayFormatted}.md`;
  createFile(year, SavePath.DAY, mdDayFileName, descriptionMarkdown, dayFormatted);

  const tsDayFileName = `${dayFormatted}.ts`;
  const exportHeader = `export { ${functionData.functionName} };\n\n`;
  const tsFileContent = `${exportHeader}${functionData.functionCode}\n`;
  createFile(year, SavePath.DAY, tsDayFileName, tsFileContent, dayFormatted);

  const tsTestFileName = `${dayFormatted}.spec.ts`;
  const testFileContent = `import { ${functionData.functionName} } from './${dayFormatted}';\n\ndescribe('Challenge Day ${day}', () => {\n  it('should ...', () => {\n    // TODO: Add test cases\n  });\n});\n`;
  createFile(year, SavePath.DAY, tsTestFileName, testFileContent, dayFormatted);

  // TODO: Save test file and main ts file.
};
