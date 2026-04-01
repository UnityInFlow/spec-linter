import { parseSpecFile } from "./parser.js";
import { LintReport, Rule } from "./types.js";

export function lint(
  filePath: string,
  content: string,
  rules: Rule[],
): LintReport {
  const file = parseSpecFile(filePath, content);
  const results = rules.flatMap((rule) => rule.check(file));

  return {
    file: filePath,
    results,
    errorCount: results.filter((r) => r.severity === "error").length,
    warningCount: results.filter((r) => r.severity === "warning").length,
  };
}
