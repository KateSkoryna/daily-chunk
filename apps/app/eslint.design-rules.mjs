const hexColourPattern =
  '(?<![\\w&#])#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b';
const functionalColourPattern = '\\brgba?\\(';
const pixelValuePattern = '\\b\\d+(\\.\\d+)?px\\b';

const forbiddenValues = [
  {
    pattern: hexColourPattern,
    message:
      'No hex colours in src/. Use a semantic token class such as bg-primary (DESIGN.md §10.4).',
  },
  {
    pattern: functionalColourPattern,
    message:
      'No rgb()/rgba() in src/. Use a semantic token class such as bg-primary (DESIGN.md §10.4).',
  },
  {
    pattern: pixelValuePattern,
    message:
      'No px values in src/. Use rem token classes such as px-gutter or text-label (DESIGN.md §10.4).',
  },
];

const restrictedSyntax = forbiddenValues.flatMap(({ pattern, message }) => [
  { selector: `Literal[value=/${pattern}/]`, message },
  { selector: `TemplateElement[value.raw=/${pattern}/]`, message },
  { selector: `JSXText[value=/${pattern}/]`, message },
]);

export const designRules = {
  files: ['src/**/*.{ts,tsx}'],
  rules: { 'no-restricted-syntax': ['error', ...restrictedSyntax] },
};
