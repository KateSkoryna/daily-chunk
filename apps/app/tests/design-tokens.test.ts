import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import {
  otherTokens,
  semanticTokens,
  spacingTokens,
  textVariants,
} from '../src/components/tokens';

const require = createRequire(import.meta.url);
const { theme } = require('../tailwind.config.js');
const {
  colors,
  fontSize,
  spacing,
  maxWidth,
  transitionDuration,
  borderRadius,
  borderWidth,
} = theme.extend;

function flattenColourNames(colourEntries: Record<string, unknown>) {
  return Object.entries(colourEntries).flatMap(([name, value]) => {
    if (typeof value === 'string') return [name];
    const nested = value as Record<string, string>;
    return Object.keys(nested).map((key) =>
      key === 'DEFAULT' ? name : `${name}-${key}`,
    );
  });
}

describe('token lists match tailwind.config.js', () => {
  it('semanticTokens equals the colour names', () => {
    expect([...semanticTokens].sort()).toEqual(
      flattenColourNames(colors).sort(),
    );
  });

  it('textVariants equals the font sizes without desktop sizes', () => {
    const scaleNames = Object.keys(fontSize).filter(
      (name) => !name.endsWith('-desktop'),
    );
    expect([...textVariants].sort()).toEqual(scaleNames.sort());
  });

  it('every spacing key is a spacing or an other token', () => {
    const known: string[] = [...spacingTokens, ...otherTokens];
    for (const key of Object.keys(spacing)) {
      expect(known, `spacing "${key}"`).toContain(key);
    }
  });

  it('every max width is an other token', () => {
    for (const key of Object.keys(maxWidth)) {
      const tokenName = key === 'reading' ? 'reading-max' : key;
      expect(otherTokens as readonly string[], `maxWidth "${key}"`).toContain(
        tokenName,
      );
    }
  });

  it('every duration is an other token', () => {
    for (const key of Object.keys(transitionDuration)) {
      expect(otherTokens as readonly string[], `duration "${key}"`).toContain(
        `duration-${key}`,
      );
    }
  });

  it('every spacing alias exists in the config', () => {
    const aliases = spacingTokens.filter((token) =>
      Number.isNaN(Number(token)),
    );
    for (const alias of aliases) {
      expect(Object.keys(spacing), `spacing alias "${alias}"`).toContain(alias);
    }
  });

  it('every other token that comes from the config exists there', () => {
    const configOtherNames = [
      ...Object.keys(spacing),
      ...Object.keys(maxWidth).map((key) =>
        key === 'reading' ? 'reading-max' : key,
      ),
      ...Object.keys(borderRadius).filter((key) => key === 'segment'),
      ...Object.keys(borderWidth)
        .filter((key) => key === '3')
        .map((key) => `border-${key}`),
      ...Object.keys(transitionDuration).map((key) => `duration-${key}`),
    ];
    const tokensWithoutConfigEntry = ['shadow-hard', 'shadow-hard-lg'];
    for (const token of otherTokens) {
      if (tokensWithoutConfigEntry.includes(token)) continue;
      expect(configOtherNames, `other token "${token}"`).toContain(token);
    }
  });
});
