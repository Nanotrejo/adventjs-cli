import { handleGenerateDay } from '../services/generate-day.service';
import { handleInit } from '../services/init.service';
import { Language } from './scrapping.schema';

// Shared context for commands
const CLI_CONTEXT: { language: Language } = { language: Language.TS };

export { ALL_COMMANDS };

interface Command {
  command: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function: (...args: any[]) => any;
}

const InitCommand: Command = {
  command: 'init',
  description: 'Run step-by-step configuration',
  function: handleInit,
};

const GenerateDayCommand: Command = {
  command: 'g <day> <language>',
  description: 'Generate boilerplate for a specific day',
  function: async (day: string, language: Language): Promise<void> => {
    const validLanguages = Object.values(Language);
    if (!validLanguages.includes(language)) {
      console.error(
        `❌ Invalid language '${language}'. Please choose one of the following: ${validLanguages.join(', ')}.`,
      );
      process.exit(1);
    }
    await handleGenerateDay(day, language);
  },
};

const LanguageCommand: Command = {
  command: 'lang <language>',
  description: 'Set the programming language (ts or py)',
  function: async (language: Language): Promise<void> => {
    const validLanguages = Object.values(Language);
    if (!validLanguages.includes(language)) {
      console.error(
        `❌ Invalid language '${language}'. Please choose one of the following: ${validLanguages.join(', ')}.`,
      );
      process.exit(1);
    }
    CLI_CONTEXT.language = language;
  },
};

const ALL_COMMANDS = [InitCommand, GenerateDayCommand, LanguageCommand];
