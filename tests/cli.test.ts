import { describe, it, expect, beforeAll } from 'vitest';
import { execaNode, execaCommand } from 'execa';
import { resolve } from 'node:path';

const CLI_PATH = resolve('dist/index.js');
const VALID_FIXTURE = resolve('tests/fixtures/valid-claude.md');
const INVALID_FIXTURE = resolve('tests/fixtures/invalid-claude.md');

describe('CLI integration', () => {
  beforeAll(async () => {
    await execaCommand('npm run build');
  });

  it('exits 0 for a valid file', async () => {
    const result = await execaNode(CLI_PATH, ['check', VALID_FIXTURE]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('passed');
  });

  it('exits 1 for a file with errors', async () => {
    try {
      await execaNode(CLI_PATH, ['check', INVALID_FIXTURE]);
      expect.unreachable('Should have thrown');
    } catch (error: unknown) {
      const execaError = error as { exitCode: number; stdout: string };
      expect(execaError.exitCode).toBe(1);
      expect(execaError.stdout).toContain('error');
    }
  });

  it('outputs JSON with --format json', async () => {
    const result = await execaNode(CLI_PATH, ['check', VALID_FIXTURE, '--format', 'json']);
    const parsed = JSON.parse(result.stdout);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0]).toHaveProperty('file');
    expect(parsed[0]).toHaveProperty('results');
  });

  it('suppresses warnings with --quiet', async () => {
    try {
      await execaNode(CLI_PATH, ['check', INVALID_FIXTURE, '--quiet']);
    } catch (error: unknown) {
      const execaError = error as { stdout: string };
      // Individual warning lines (icon "warning") should be filtered out
      expect(execaError.stdout).not.toContain('Duplicate heading');
      // Errors should still appear
      expect(execaError.stdout).toContain('error');
    }
  });

  it('lists rules with the rules command', async () => {
    const result = await execaNode(CLI_PATH, ['rules']);
    expect(result.stdout).toContain('S001');
    expect(result.stdout).toContain('S003');
    expect(result.stdout).toContain('S004');
    expect(result.stdout).toContain('S005');
    expect(result.stdout).toContain('S006');
  });
});
