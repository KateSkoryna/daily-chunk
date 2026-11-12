import type { ComponentMeta } from '../components/meta';

function bulletList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n');
}

function definitionList(entries: Record<string, string>) {
  return Object.entries(entries)
    .map(([key, value]) => `- \`${key}\`: ${value}`)
    .join('\n');
}

export function metaToMarkdown(meta: ComponentMeta) {
  const sections = [
    `${meta.description}\n\n*${meta.category}, spec: ${meta.spec}*`,
    `### Use when\n${bulletList(meta.aiHints.useWhen)}`,
    `### Avoid when\n${bulletList(meta.aiHints.avoidWhen)}`,
    `### Never\n${bulletList(meta.aiHints.invalid)}`,
    `### Accessibility\n${bulletList(meta.accessibility)}`,
  ];

  if (Object.keys(meta.props).length > 0) {
    sections.push(`### Props\n${definitionList(meta.props)}`);
  }

  if (meta.variants) {
    sections.push(`### Variants\n${definitionList(meta.variants)}`);
  }

  sections.push(
    `### Tokens\n${bulletList(meta.tokens.color.map((token) => `colour \`${token}\``))}`,
  );

  if (meta.relationships.usedIn) {
    sections.push(
      `### Used in\n${bulletList(meta.relationships.usedIn.map((name) => `\`${name}\``))}`,
    );
  }

  return sections.join('\n\n');
}
