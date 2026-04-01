import { LintReport } from '../types.js';

export function formatJson(reports: LintReport[]): string {
  return JSON.stringify(reports, null, 2);
}
