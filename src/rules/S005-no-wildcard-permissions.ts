import { Rule, LintResult, ParsedSpecFile } from '../types.js';

const WILDCARD_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\w+\(\*:\*\)/, label: 'Wildcard tool permission (Tool(*:*))' },
  { pattern: /"allow"\s*:\s*\[\s*"\*"\s*\]/, label: 'Wildcard allow list ("allow": ["*"])' },
  { pattern: /permissions\s*:\s*"\*"/, label: 'Wildcard permissions string' },
];

export const noWildcardPermissionsRule: Rule = {
  id: 'S005',
  name: 'no-wildcard-permissions',
  severity: 'error',
  description: 'Tool permissions must not use wildcards — be explicit about allowed tools',
  check(file: ParsedSpecFile): LintResult[] {
    const results: LintResult[] = [];
    const lines = file.raw.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, label } of WILDCARD_PATTERNS) {
        if (pattern.test(line)) {
          results.push({
            ruleId: 'S005',
            severity: 'error',
            message: `${label} — use explicit tool names instead of wildcards.`,
            line: i + 1,
          });
        }
      }
    }
    return results;
  },
};
