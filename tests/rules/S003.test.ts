import { describe, it, expect } from 'vitest';
import { noSecretsRule } from '../../src/rules/S003-no-secrets.js';
import { parseSpecFile } from '../../src/parser.js';

describe('S003 no-secrets', () => {
  const check = (content: string) => {
    const file = parseSpecFile('/test.md', content);
    return noSecretsRule.check(file);
  };

  it('passes a file with no credentials', () => {
    const content = '## Project Overview\n\nThis is a normal spec file with no secrets.';
    expect(check(content)).toHaveLength(0);
  });

  it('passes a file that mentions key patterns in prose without actual keys', () => {
    const content = '## Constraints\n\nDo not commit API keys. Use environment variables for sk- prefixed tokens.';
    expect(check(content)).toHaveLength(0);
  });

  it('passes a file with short strings that look like prefixes but are not keys', () => {
    const content = '## Notes\n\nThe sk-prefix is used by OpenAI.';
    expect(check(content)).toHaveLength(0);
  });

  it('catches an OpenAI API key', () => {
    const content = '## Config\n\nOPENAI_API_KEY=sk-1234567890abcdefghij1234567890abcdefghij12345678';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].severity).toBe('error');
    expect(results[0].ruleId).toBe('S003');
  });

  it('catches a GitHub personal access token', () => {
    const content = '## Auth\n\ntoken: ghp_abcdefghijklmnopqrstuvwxyz1234567890';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('catches an AWS access key', () => {
    const content = '## Infra\n\nAWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('catches a private key block', () => {
    const content = '## Keys\n\n-----BEGIN RSA PRIVATE KEY-----\nMIIBogIBAAJ';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('catches an Anthropic API key pattern', () => {
    const content = '## Config\n\nsk-ant-api03-abcdefghijklmnopqrstuvwxyz123456';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('reports the correct line number', () => {
    const content = 'Line 1\nLine 2\nsk-1234567890abcdefghij1234567890abcdefghij12345678\nLine 4';
    const results = check(content);
    expect(results[0].line).toBe(3);
  });

  it('catches multiple secrets on different lines', () => {
    const content = 'sk-1234567890abcdefghij1234567890abcdefghij12345678\n\nghp_abcdefghijklmnopqrstuvwxyz1234567890';
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('has correct rule metadata', () => {
    expect(noSecretsRule.id).toBe('S003');
    expect(noSecretsRule.severity).toBe('error');
  });
});
