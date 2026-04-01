# @unityinflow/spec-linter

> Lint CLAUDE.md and AI spec files — catches missing sections, secrets, and context bloat.

## Installation

```bash
npm install -g @unityinflow/spec-linter
```

Or run directly:

```bash
npx @unityinflow/spec-linter check CLAUDE.md
```

## Usage

```bash
# Lint a specific file
spec-linter check CLAUDE.md

# Lint all spec files in current directory
spec-linter check .

# JSON output for CI
spec-linter check CLAUDE.md --format json

# Only show errors
spec-linter check CLAUDE.md --quiet

# List available rules
spec-linter rules
```

## Rules

| ID | Name | Severity | Description |
|---|---|---|---|
| S001 | required-sections | error | Must have: Project Overview, Constraints, Acceptance Criteria |
| S003 | no-secrets | error | No API keys, tokens, or private keys |
| S004 | file-size | warning | >30kb warns, >50kb errors (context bloat) |
| S005 | no-wildcard-permissions | error | No `Bash(*:*)` or `"*"` in tool permissions |
| S006 | no-duplicate-headers | warning | No duplicate section headings at same level |

## Exit Codes

- `0` — all checks passed
- `1` — errors found
- `2` — warnings only

## License

MIT
