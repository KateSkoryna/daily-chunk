import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkComponentMeta } from './check-component-meta.mjs';

const appDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const sourceDirectory = path.join(appDirectory, 'src');
const tokensFile = path.join(sourceDirectory, 'components', 'tokens.ts');

const problems = await checkComponentMeta(sourceDirectory, tokensFile);

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log('Component meta check passed');
