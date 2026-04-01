import { Rule, LintResult, ParsedSpecFile } from "../types.js";

const SECRET_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /sk-[a-zA-Z0-9_-]{20,}/, label: "OpenAI/Anthropic API key" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/, label: "GitHub personal access token" },
  { pattern: /gho_[a-zA-Z0-9]{36}/, label: "GitHub OAuth token" },
  { pattern: /ghs_[a-zA-Z0-9]{36}/, label: "GitHub server token" },
  { pattern: /AKIA[0-9A-Z]{16}/, label: "AWS access key" },
  { pattern: /-----BEGIN\s+\w*\s*PRIVATE KEY-----/, label: "Private key" },
  { pattern: /xoxb-[0-9]{10,}-[a-zA-Z0-9-]+/, label: "Slack bot token" },
  { pattern: /xoxp-[0-9]{10,}-[a-zA-Z0-9-]+/, label: "Slack user token" },
];

export const noSecretsRule: Rule = {
  id: "S003",
  name: "no-secrets",
  severity: "error",
  description: "Spec files must not contain secrets, API keys, or credentials",
  check(file: ParsedSpecFile): LintResult[] {
    const results: LintResult[] = [];
    const lines = file.raw.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, label } of SECRET_PATTERNS) {
        if (pattern.test(line)) {
          results.push({
            ruleId: "S003",
            severity: "error",
            message: `Possible ${label} detected. Remove before committing.`,
            line: i + 1,
          });
        }
      }
    }

    return results;
  },
};
