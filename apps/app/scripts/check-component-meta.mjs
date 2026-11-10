import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ignoredComponentSuffixes = ['.stories.tsx', '.test.tsx', '.spec.tsx'];
const ignoredComponentNames = ['index.tsx'];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
    }),
  );
  return nested.flat();
}

function isComponentFile(filePath) {
  return (
    filePath.endsWith('.tsx') &&
    !ignoredComponentNames.includes(path.basename(filePath)) &&
    !ignoredComponentSuffixes.some((suffix) => filePath.endsWith(suffix))
  );
}

async function importModule(filePath) {
  return import(pathToFileURL(filePath).href);
}

function findUnknownNames(names = [], knownNames) {
  return names.filter((name) => !knownNames.includes(name));
}

function findOrphanMetaFiles(files) {
  return files
    .filter((filePath) => filePath.endsWith('.meta.ts'))
    .filter(
      (metaFile) => !files.includes(metaFile.replace(/\.meta\.ts$/, '.tsx')),
    )
    .map((metaFile) => `${metaFile}: meta file has no component next to it`);
}

function findShapeProblems(metaFile, meta) {
  const arrayGroups = ['color', 'typography', 'spacing', 'other'];
  const problems = [];
  if (!Array.isArray(meta.tokens.color)) {
    problems.push(`${metaFile}: tokens.color must be an array`);
  }
  for (const group of arrayGroups.slice(1)) {
    const names = meta.tokens[group];
    if (names !== undefined && !Array.isArray(names)) {
      problems.push(`${metaFile}: tokens.${group} must be an array`);
    }
  }
  return problems;
}

function describeUnknownNames(metaFile, group, names, knownNames) {
  return findUnknownNames(names, knownNames).map(
    (name) => `${metaFile}: unknown ${group} token "${name}"`,
  );
}

function readMeta(metaModule) {
  return Object.values(metaModule).find(
    (exported) => exported && typeof exported === 'object' && exported.tokens,
  );
}

export async function checkComponentMeta(sourceDirectory, tokensFile) {
  const knownTokens = await importModule(tokensFile);
  const files = await listFiles(sourceDirectory);
  const componentFiles = files.filter(isComponentFile);
  const problems = findOrphanMetaFiles(files);

  for (const componentFile of componentFiles) {
    const metaFile = componentFile.replace(/\.tsx$/, '.meta.ts');
    if (!files.includes(metaFile)) {
      problems.push(
        `${componentFile}: missing meta file ${path.basename(metaFile)}`,
      );
      continue;
    }

    const meta = readMeta(await importModule(metaFile));
    if (!meta) {
      problems.push(`${metaFile}: no exported meta object with tokens`);
      continue;
    }

    const shapeProblems = findShapeProblems(metaFile, meta);
    if (shapeProblems.length > 0) {
      problems.push(...shapeProblems);
      continue;
    }

    problems.push(
      ...describeUnknownNames(
        metaFile,
        'color',
        meta.tokens.color,
        knownTokens.semanticTokens,
      ),
      ...describeUnknownNames(
        metaFile,
        'typography',
        meta.tokens.typography,
        knownTokens.textVariants,
      ),
      ...describeUnknownNames(
        metaFile,
        'spacing',
        meta.tokens.spacing,
        knownTokens.spacingTokens,
      ),
      ...describeUnknownNames(
        metaFile,
        'other',
        meta.tokens.other,
        knownTokens.otherTokens,
      ),
    );
  }

  return problems;
}
