import { Rule, LintResult, ParsedSpecFile } from "../types.js";

const WARN_THRESHOLD = 30 * 1024;
const ERROR_THRESHOLD = 50 * 1024;

export const fileSizeRule: Rule = {
  id: "S004",
  name: "file-size",
  severity: "warning",
  description: "Spec files over 30kb warn (context bloat), over 50kb error",
  check(file: ParsedSpecFile): LintResult[] {
    if (file.sizeBytes > ERROR_THRESHOLD) {
      return [
        {
          ruleId: "S004",
          severity: "error",
          message: `File is ${Math.round(file.sizeBytes / 1024)}kb — exceeds 50kb limit. Split into smaller files to avoid context bloat.`,
        },
      ];
    }
    if (file.sizeBytes > WARN_THRESHOLD) {
      return [
        {
          ruleId: "S004",
          severity: "warning",
          message: `File is ${Math.round(file.sizeBytes / 1024)}kb — over 30kb warning threshold. Consider splitting.`,
        },
      ];
    }
    return [];
  },
};
