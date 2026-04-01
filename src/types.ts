export type Severity = 'error' | 'warning';

export interface Section {
  heading: string;
  level: number;
  line: number;
  content: string;
}

export interface ParsedSpecFile {
  path: string;
  raw: string;
  sections: Section[];
  sizeBytes: number;
}

export interface LintResult {
  ruleId: string;
  severity: Severity;
  message: string;
  line?: number;
}

export interface Rule {
  id: string;
  name: string;
  severity: Severity;
  description: string;
  check(file: ParsedSpecFile): LintResult[];
}

export interface LintReport {
  file: string;
  results: LintResult[];
  errorCount: number;
  warningCount: number;
}
