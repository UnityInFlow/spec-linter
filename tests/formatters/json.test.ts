import { describe, it, expect } from 'vitest';
import { formatJson } from '../../src/formatters/json.js';
import { LintReport } from '../../src/types.js';

describe('formatJson', () => {
  it('returns valid JSON array', () => {
    const reports: LintReport[] = [
      { file: 'CLAUDE.md', results: [], errorCount: 0, warningCount: 0 },
    ];
    const output = formatJson(reports);
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(1);
  });

  it('includes all report fields', () => {
    const reports: LintReport[] = [
      {
        file: 'CLAUDE.md',
        results: [
          { ruleId: 'S001', severity: 'error', message: 'Missing section', line: 1 },
        ],
        errorCount: 1,
        warningCount: 0,
      },
    ];
    const output = formatJson(reports);
    const parsed = JSON.parse(output);
    expect(parsed[0]).toHaveProperty('file', 'CLAUDE.md');
    expect(parsed[0]).toHaveProperty('results');
    expect(parsed[0]).toHaveProperty('errorCount', 1);
    expect(parsed[0]).toHaveProperty('warningCount', 0);
    expect(parsed[0].results[0]).toHaveProperty('ruleId', 'S001');
    expect(parsed[0].results[0]).toHaveProperty('line', 1);
  });

  it('returns pretty-printed JSON', () => {
    const reports: LintReport[] = [
      { file: 'CLAUDE.md', results: [], errorCount: 0, warningCount: 0 },
    ];
    const output = formatJson(reports);
    expect(output).toContain('\n');
    expect(output).toContain('  ');
  });

  it('handles multiple reports', () => {
    const reports: LintReport[] = [
      { file: 'CLAUDE.md', results: [], errorCount: 0, warningCount: 0 },
      { file: 'AGENTS.md', results: [], errorCount: 0, warningCount: 0 },
    ];
    const output = formatJson(reports);
    const parsed = JSON.parse(output);
    expect(parsed).toHaveLength(2);
  });
});
