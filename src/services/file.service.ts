import { mkdirSync, writeFileSync, readFileSync, cpSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { formatDayNumber } from './parsing.service';

export {
  getRootFolderName,
  findAdventjsFolderInCurrentLevel,
  SavePath,
  createFile,
  createFolderUnderRoot,
  createRootFolder,
  copyFromTemplates,
  _replaceYearPlaceholder as replaceYearPlaceholder,
  copyFromTemplatesWithYearReplacement as copyFromTemplatesWithReplacement,
  CONFIG_FILE,
};

const ROOT_FOLDER_PREFIX = 'adventjs-';

const getRootFolderName = (year: string | number): string => {
  const rootFolder = `${ROOT_FOLDER_PREFIX}${year}`;
  return rootFolder;
};

const findAdventjsFolderInCurrentLevel = (): string | null => {
  try {
    const files = readdirSync(process.cwd(), { withFileTypes: true });
    const adventjsFolder = files.find(
      (file) => file.isDirectory() && file.name.startsWith(ROOT_FOLDER_PREFIX),
    );
    return adventjsFolder ? adventjsFolder.name : null;
  } catch {
    return null;
  }
};

enum SavePath {
  ROOT = 'root',
  DAY = 'day',
}

enum CONFIG_FILE {
  CONFIG = 'adventjs-cli.json',
  GITIGNORE = '.gitignore',
  VSCODE = '.vscode',
  PRETTIER = '.prettierrc',
  PRETTIER_IGNORE = '.prettierignore',
  ESLINT = 'eslint.config.mjs',
  JEST = 'jest.config.js',
  TSCONFIG = 'tsconfig.json',
  GITHUB = '.github',
  README = 'README.md',
  PACKAGE_JSON = 'package.json',
}

const createFile = (
  year: string | number,
  savePath: SavePath,
  fileName: string,
  content: string,
  day?: string,
): void => {
  const rootFolder = getRootFolderName(year);
  const rootFolderPath = join(process.cwd(), rootFolder);

  // Create root folder if it doesn't exist
  mkdirSync(rootFolderPath, { recursive: true });

  if (savePath === SavePath.DAY && day !== undefined) {
    day = formatDayNumber(day);
    const folderName = `${rootFolder}/${day}`;
    const folderPath = join(process.cwd(), folderName);

    // Create day folder if it doesn't exist
    mkdirSync(folderPath, { recursive: true });

    const filePath = join(folderPath, fileName);
    writeFileSync(filePath, content, 'utf-8');
  } else if (savePath === SavePath.ROOT) {
    const filePath = join(rootFolderPath, fileName);
    writeFileSync(filePath, content, 'utf-8');
  }
};

const createFolderUnderRoot = (year: string | number, folderName: string): void => {
  const rootFolder = getRootFolderName(year);
  const rootFolderPath = join(process.cwd(), rootFolder);

  // Create root folder if it doesn't exist
  mkdirSync(rootFolderPath, { recursive: true });

  const fullFolderPath = join(process.cwd(), rootFolder, folderName);
  // Create specified folder if it doesn't exist
  mkdirSync(fullFolderPath, { recursive: true });
};

const createRootFolder = (year: string | number): void => {
  const rootFolder = getRootFolderName(year);
  const rootFolderPath = join(process.cwd(), rootFolder);

  // Create root folder if it doesn't exist
  mkdirSync(rootFolderPath, { recursive: true });
};

const copyFromTemplates = (
  year: string | number,
  sourceFileName: CONFIG_FILE,
  destinationFileName?: string,
): void => {
  const rootFolder = getRootFolderName(year);
  const rootFolderPath = join(process.cwd(), rootFolder);

  // Get the templates directory path
  const templateSourcePath = join(__dirname, '..', 'templates', sourceFileName);

  // Check if source is a directory or file
  const stat = statSync(templateSourcePath);

  // Determine destination file name (use sourceFileName if destinationFileName not provided)
  const destFileName = destinationFileName || sourceFileName;
  const destinationPath = join(rootFolderPath, destFileName);

  if (stat.isDirectory()) {
    // Copy directory recursively
    cpSync(templateSourcePath, destinationPath, { recursive: true });
  } else {
    // Read and write file
    const fileContent = readFileSync(templateSourcePath, 'utf-8');
    writeFileSync(destinationPath, fileContent, 'utf-8');
  }
};

const _replaceYearPlaceholder = (content: string, year: string | number): string => {
  return content.replace(/\{\{year\}\}/g, String(year));
};

const copyFromTemplatesWithYearReplacement = (
  year: string | number,
  sourceFileName: CONFIG_FILE,
  destinationFileName?: string,
): void => {
  const rootFolder = getRootFolderName(year);
  const rootFolderPath = join(process.cwd(), rootFolder);

  // Get the templates directory path
  const templateSourcePath = join(__dirname, '..', 'templates', sourceFileName);

  // Check if source is a directory or file
  const stat = statSync(templateSourcePath);

  // Determine destination file name (use sourceFileName if destinationFileName not provided)
  const destFileName = destinationFileName || sourceFileName;
  const destinationPath = join(rootFolderPath, destFileName);

  if (stat.isDirectory()) {
    // Copy directory recursively without replacement
    cpSync(templateSourcePath, destinationPath, { recursive: true });
  } else {
    // Read file, replace {{year}}, and write
    let fileContent = readFileSync(templateSourcePath, 'utf-8');
    fileContent = _replaceYearPlaceholder(fileContent, year);
    writeFileSync(destinationPath, fileContent, 'utf-8');
  }
};
