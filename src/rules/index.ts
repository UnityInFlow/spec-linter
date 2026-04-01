import { Rule } from '../types.js';
import { requiredSectionsRule } from './S001-required-sections.js';
import { noSecretsRule } from './S003-no-secrets.js';

export const allRules: Rule[] = [
  requiredSectionsRule,
  noSecretsRule,
];
