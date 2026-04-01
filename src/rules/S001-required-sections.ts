import { Rule, LintResult, ParsedSpecFile } from '../types.js';

const REQUIRED_SECTIONS = [
  'Project Overview',
  'Constraints',
  'Acceptance Criteria',
];

export const requiredSectionsRule: Rule = {
  id: 'S001',
  name: 'required-sections',
  severity: 'error',
  description: 'Spec files must contain required sections: Project Overview, Constraints, Acceptance Criteria',
  check(file: ParsedSpecFile): LintResult[] {
    const headings = file.sections.map((s) => s.heading.toLowerCase());

    return REQUIRED_SECTIONS
      .filter((required) => !headings.includes(required.toLowerCase()))
      .map((missing) => ({
        ruleId: 'S001',
        severity: 'error' as const,
        message: `Missing required section: "${missing}"`,
      }));
  },
};
