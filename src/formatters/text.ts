import { LintReport } from '../types.js';

export function formatText(reports: LintReport[], quiet: boolean): string {
  const lines: string[] = [];

  for (const report of reports) {
    const filtered = quiet ? report.results.filter((r) => r.severity === 'error') : report.results;
    if (filtered.length === 0) continue;

    lines.push(`\n${report.file}`);
    for (const result of filtered) {
      const lineInfo = result.line ? `:${result.line}` : '';
      const icon = result.severity === 'error' ? 'error' : 'warning';
      lines.push(`  ${lineInfo} ${icon}  ${result.message}  (${result.ruleId})`);
    }
  }

  const totalErrors = reports.reduce((sum, r) => sum + r.errorCount, 0);
  const totalWarnings = reports.reduce((sum, r) => sum + r.warningCount, 0);

  if (totalErrors === 0 && totalWarnings === 0) {
    lines.push('All checks passed.');
  } else {
    lines.push(`\n${totalErrors} error(s), ${totalWarnings} warning(s)`);
  }

  return lines.join('\n');
}
