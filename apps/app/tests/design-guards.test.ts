import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';
import { checkComponentMeta } from '../scripts/check-component-meta.mjs';

const appDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const sourceDirectory = path.join(appDirectory, 'src');
const tokensFile = path.join(sourceDirectory, 'components', 'tokens.ts');
const fixturesDirectory = path.join(
  appDirectory,
  'tests',
  'fixtures',
  'meta-check',
);

const eslint = new ESLint({ cwd: appDirectory });

async function lintMessages(code: string, folder: string) {
  const [result] = await eslint.lintText(code, {
    filePath: path.join(appDirectory, folder, 'Fixture.tsx'),
  });
  if (!result) throw new Error('ESLint returned no result');
  return result.messages.map((message) => message.message);
}

function lintInsideSrc(code: string) {
  return lintMessages(code, path.join('src', 'components'));
}

function lintOutsideSrc(code: string) {
  return lintMessages(code, 'app');
}

describe('design lint rule (DESIGN.md §10.4)', () => {
  it('fails on a hex colour in src', async () => {
    const messages = await lintInsideSrc('export const colour = "#FFD23F";');
    expect(messages.join()).toContain('No hex colours');
  });

  it('fails on a short hex colour in a className', async () => {
    const messages = await lintInsideSrc(
      'export const view = <View className="bg-[#fff]" />;',
    );
    expect(messages.join()).toContain('No hex colours');
  });

  it('fails on a hex colour written as JSX text', async () => {
    const messages = await lintInsideSrc(
      'export const label = <Text>#FFD23F</Text>;',
    );
    expect(messages.join()).toContain('No hex colours');
  });

  it('fails on rgba() in src', async () => {
    const messages = await lintInsideSrc(
      'export const colour = "rgba(255, 210, 63, 0.5)";',
    );
    expect(messages.join()).toContain('No rgb()');
  });

  it('flags a short hex-like word such as #123 (it is a valid colour)', async () => {
    const messages = await lintInsideSrc(
      'export const note = "see issue #123";',
    );
    expect(messages.join()).toContain('No hex colours');
  });

  it('allows words that are not hex colours', async () => {
    const messages = await lintInsideSrc(
      'export const note = "tag #added, #a11y, &#8212; and #1";',
    );
    expect(messages).toEqual([]);
  });

  it('fails on rgb() in src', async () => {
    const messages = await lintInsideSrc(
      'export const colour = "rgb(255, 210, 63)";',
    );
    expect(messages.join()).toContain('No rgb()');
  });

  it('fails on a px value in src', async () => {
    const messages = await lintInsideSrc('export const size = "24px";');
    expect(messages.join()).toContain('No px values');
  });

  it('fails on a px value inside a template string', async () => {
    const messages = await lintInsideSrc('export const size = `${1}px 12px`;');
    expect(messages.join()).toContain('No px values');
  });

  it('passes token classes and rem values', async () => {
    const messages = await lintInsideSrc(
      'import { View } from "react-native"; export const view = <View className="bg-primary px-gutter w-[1.5rem]" />;',
    );
    expect(messages).toEqual([]);
  });

  it('does not apply outside src', async () => {
    const messages = await lintOutsideSrc('export const colour = "#FFD23F";');
    expect(messages).toEqual([]);
  });
});

describe('component meta check (DESIGN.md §14)', () => {
  it('passes for a component with a valid meta', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'valid'),
      tokensFile,
    );
    expect(problems).toEqual([]);
  });

  it('fails when a component has no meta file', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'missing-meta'),
      tokensFile,
    );
    expect(problems.join()).toContain('missing meta file Orphan.meta.ts');
  });

  it('fails when a meta names an unknown token', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'unknown-token'),
      tokensFile,
    );
    expect(problems).toEqual([
      expect.stringContaining('unknown color token "hot-pink"'),
      expect.stringContaining('unknown typography token "huge-title"'),
    ]);
  });

  it('fails when a meta uses values instead of names', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'value-in-meta'),
      tokensFile,
    );
    expect(problems.join()).toContain('unknown color token "#FFD23F"');
    expect(problems.join()).toContain('unknown spacing token "1.5rem"');
  });

  it('finds components in nested folders', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'nested'),
      tokensFile,
    );
    expect(problems).toEqual([]);
  });

  it('does not ask a meta for stories, tests, specs or index files', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'ignored-files'),
      tokensFile,
    );
    expect(problems).toEqual([]);
  });

  it('fails when a meta file has no component next to it', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'orphan-meta'),
      tokensFile,
    );
    expect(problems.join()).toContain(
      'Ghost.meta.ts: meta file has no component',
    );
  });

  it('fails when a token group has the wrong shape', async () => {
    const problems = await checkComponentMeta(
      path.join(fixturesDirectory, 'bad-shape'),
      tokensFile,
    );
    expect(problems.join()).toContain('tokens.color must be an array');
    expect(problems.join()).toContain('tokens.typography must be an array');
  });

  it('passes for the real src folder', async () => {
    const problems = await checkComponentMeta(sourceDirectory, tokensFile);
    expect(problems).toEqual([]);
  });
});
