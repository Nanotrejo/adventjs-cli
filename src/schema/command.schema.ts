import { handleGenerateDay } from '../services/generate-day.service';
import { handleInit } from '../services/init.service';

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
  command: 'g <day>',
  description: 'Generate boilerplate for a specific day',
  function: handleGenerateDay,
};

const ALL_COMMANDS = [InitCommand, GenerateDayCommand];
