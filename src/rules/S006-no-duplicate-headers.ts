import { Rule, LintResult, ParsedSpecFile } from '../types.js';

export const noDuplicateHeadersRule: Rule = {
  id: 'S006',
  name: 'no-duplicate-headers',
  severity: 'warning',
  description: 'Duplicate section headings at the same level cause confusion',
  check(file: ParsedSpecFile): LintResult[] {
    const results: LintResult[] = [];
    const seen = new Map<string, number>();
    for (const section of file.sections) {
      const key = `${section.level}:${section.heading.toLowerCase()}`;
      if (seen.has(key)) {
        results.push({
          ruleId: 'S006',
          severity: 'warning',
          message: `Duplicate heading "${section.heading}" (level ${section.level}) — first seen on line ${seen.get(key)}.`,
          line: section.line,
        });
      } else {
        seen.set(key, section.line);
      }
    }
    return results;
  },
};
