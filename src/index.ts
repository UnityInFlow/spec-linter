import { Command } from 'commander';
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { lint } from './engine.js';
import { allRules } from './rules/index.js';
import { formatText } from './formatters/text.js';
import { formatJson } from './formatters/json.js';
import { LintReport } from './types.js';

const SPEC_FILE_NAMES = [
  'CLAUDE.md',
  'GEMINI.md',
  'AGENTS.md',
  'REQUIREMENTS.md',
  'PLAN.md',
];

function findSpecFiles(targetPath: string): string[] {
  const resolved = resolve(targetPath);
  const stat = statSync(resolved);

  if (stat.isFile()) {
    return [resolved];
  }

  if (stat.isDirectory()) {
    const files: string[] = [];
    const entries = readdirSync(resolved);
    for (const entry of entries) {
      if (SPEC_FILE_NAMES.includes(entry)) {
        const fullPath = join(resolved, entry);
        const entryStat = statSync(fullPath);
        if (entryStat.isFile()) {
          files.push(fullPath);
        }
      }
    }
    return files;
  }

  return [];
}

const program = new Command();

program
  .name('spec-linter')
  .description('Lint CLAUDE.md and AI spec files')
  .version('0.0.1');

program
  .command('check')
  .description('Lint spec files for common issues')
  .argument('<path>', 'File or directory to lint')
  .option('--format <type>', 'Output format: text or json', 'text')
  .option('--quiet', 'Only show errors, suppress warnings', false)
  .action((targetPath: string, options: { format: string; quiet: boolean }) => {
    const files = findSpecFiles(targetPath);

    if (files.length === 0) {
      console.error(`No spec files found at: ${targetPath}`);
      process.exit(1);
    }

    const reports: LintReport[] = files.map((filePath) => {
      const content = readFileSync(filePath, 'utf-8');
      return lint(filePath, content, allRules);
    });

    const output =
      options.format === 'json'
        ? formatJson(reports)
        : formatText(reports, options.quiet);

    console.log(output);

    const hasErrors = reports.some((r) => r.errorCount > 0);
    const hasWarnings = reports.some((r) => r.warningCount > 0);

    if (hasErrors) {
      process.exit(1);
    } else if (hasWarnings) {
      process.exit(2);
    } else {
      process.exit(0);
    }
  });

program
  .command('rules')
  .description('List all available lint rules')
  .action(() => {
    for (const rule of allRules) {
      const icon = rule.severity === 'error' ? 'ERR' : 'WRN';
      console.log(`  ${rule.id}  [${icon}]  ${rule.name} — ${rule.description}`);
    }
  });

program.parse();
