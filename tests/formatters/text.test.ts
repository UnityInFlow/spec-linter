import { describe, it, expect } from 'vitest';
import { formatText } from '../../src/formatters/text.js';
import { LintReport } from '../../src/types.js';

describe('formatText', () => {
  it('shows "All checks passed." when no issues', () => {
    const reports: LintReport[] = [
      { file: 'CLAUDE.md', results: [], errorCount: 0, warningCount: 0 },
    ];
    const output = formatText(reports, false);
    expect(output).toContain('All checks passed.');
  });

  it('displays errors with ruleId and line info', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [
          { ruleId: 'S001', severity: 'error', message: 'Missing section: Project Overview', line: 1 },
        ],
        errorCount: 1,
        warningCount: 0,
      },
    ];
    const output = formatText(reports, false);
    expect(output).toContain('CLAUDE.md');
    expect(output).toContain(':1');
    expect(output).toContain('error');
    expect(output).toContain('S001');
    expect(output).toContain('1 error(s), 0 warning(s)');
  });

  it('displays warnings alongside errors', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [
          { ruleId: 'S001', severity: 'error', message: 'Missing section', line: 1 },
          { ruleId: 'S006', severity: 'warning', message: 'Duplicate header', line: 5 },
        ],
        errorCount: 1,
        warningCount: 1,
      },
    ];
    const output = formatText(reports, false);
    expect(output).toContain('error');
    expect(output).toContain('warning');
    expect(output).toContain('1 error(s), 1 warning(s)');
  });

  it('suppresses warnings in quiet mode', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [
          { ruleId: 'S001', severity: 'error', message: 'Missing section', line: 1 },
          { ruleId: 'S006', severity: 'warning', message: 'Duplicate header', line: 5 },
        ],
        errorCount: 1,
        warningCount: 1,
      },
    ];
    const output = formatText(reports, true);
    expect(output).toContain('Missing section');
    expect(output).not.toContain('Duplicate header');
  });

  it('handles results without line numbers', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [
          { ruleId: 'S004', severity: 'warning', message: 'File is large' },
        ],
        errorCount: 0,
        warningCount: 1,
      },
    ];
    const output = formatText(reports, false);
    expect(output).toContain('warning  File is large  (S004)');
    expect(output).not.toContain(':undefined');
  });

  it('handles multiple files', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [{ ruleId: 'S001', severity: 'error', message: 'Missing section' }],
        errorCount: 1,
        warningCount: 0,
      },
      {
        file: 'AGENTS.md',
        results: [{ ruleId: 'S003', severity: 'error', message: 'Secret found' }],
        errorCount: 1,
        warningCount: 0,
      },
    ];
    const output = formatText(reports, false);
    expect(output).toContain('CLAUDE.md');
    expect(output).toContain('AGENTS.md');
    expect(output).toContain('2 error(s), 0 warning(s)');
  });
});
