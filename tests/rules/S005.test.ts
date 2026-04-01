import { describe, it, expect } from 'vitest';
import { noWildcardPermissionsRule } from '../../src/rules/S005-no-wildcard-permissions.js';
import { parseSpecFile } from '../../src/parser.js';

describe('S005 no-wildcard-permissions', () => {
  const check = (content: string) => {
    const file = parseSpecFile('/test.md', content);
    return noWildcardPermissionsRule.check(file);
  };

  it('passes a file with no permission blocks', () => {
    expect(check('## Overview\n\nJust a normal spec.')).toHaveLength(0);
  });

  it('passes specific tool permissions', () => {
    const content = '## Permissions\n\nBash(git:*)\nRead(src/*)';
    expect(check(content)).toHaveLength(0);
  });

  it('passes a file with no wildcards', () => {
    const content = '## Config\n\nallow: ["Read", "Write"]';
    expect(check(content)).toHaveLength(0);
  });

  it('catches Bash(*:*) wildcard', () => {
    const content = '## Permissions\n\nBash(*:*)';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].severity).toBe('error');
  });

  it('catches "allow": ["*"] in JSON-like blocks', () => {
    const content = '## Config\n\n"allow": ["*"]';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('catches permissions: "*"', () => {
    const content = '## Tools\n\npermissions: "*"';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('reports the correct line number', () => {
    const content = 'Line 1\nLine 2\nBash(*:*)\nLine 4';
    const results = check(content);
    expect(results[0].line).toBe(3);
  });

  it('catches multiple wildcards', () => {
    const content = 'Bash(*:*)\n\n"allow": ["*"]';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('has correct rule metadata', () => {
    expect(noWildcardPermissionsRule.id).toBe('S005');
    expect(noWildcardPermissionsRule.severity).toBe('error');
  });
});
