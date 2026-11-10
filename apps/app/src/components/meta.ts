import type {
  OtherToken,
  SemanticToken,
  SpacingToken,
  TextVariant,
} from './tokens';

export type ComponentMeta = {
  name: string;
  category: 'atom' | 'molecule' | 'organism';
  description: string;
  base?: string;
  spec: string;
  props: Record<string, string>;
  variants?: Record<string, string>;
  states: string[];
  relationships: {
    composedOf?: string[];
    usedIn?: string[];
    pairsWith?: string[];
    alternatives?: Record<string, string>;
  };
  tokens: {
    color: SemanticToken[];
    typography?: TextVariant[];
    spacing?: SpacingToken[];
    other?: OtherToken[];
  };
  accessibility: string[];
  aiHints: {
    useWhen: string[];
    avoidWhen: string[];
    invalid: string[];
  };
};
