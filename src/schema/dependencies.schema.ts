const _testsDevDependencies = ['@types/jest', 'jest', 'ts-jest'];
const _prettierDevDependencies = ['prettier'];
const _eslintDevDependencies = [
  'eslint',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
];
const _typescriptDevDependencies = ['typescript', 'ts-node'];

const DEV_DEPENDENCIES = [
  ..._testsDevDependencies,
  ..._prettierDevDependencies,
  ..._eslintDevDependencies,
  ..._typescriptDevDependencies,
];

export { DEV_DEPENDENCIES };
