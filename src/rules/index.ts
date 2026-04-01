import { Rule } from '../types.js';
import { requiredSectionsRule } from './S001-required-sections.js';
import { noSecretsRule } from './S003-no-secrets.js';
import { fileSizeRule } from './S004-file-size.js';
import { noWildcardPermissionsRule } from './S005-no-wildcard-permissions.js';
import { noDuplicateHeadersRule } from './S006-no-duplicate-headers.js';

export const allRules: Rule[] = [
  requiredSectionsRule,
  noSecretsRule,
  fileSizeRule,
  noWildcardPermissionsRule,
  noDuplicateHeadersRule,
];
