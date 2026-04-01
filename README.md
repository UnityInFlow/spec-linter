# @unityinflow/spec-linter

> Lint CLAUDE.md and AI spec files — catches missing sections, secrets, and context bloat.

## The Problem

CLAUDE.md, GEMINI.md, and AI spec files are written by hand with zero validation. Common mistakes:

- Missing required sections — the agent builds the wrong thing
- Accidentally committed API keys — security breach waiting to happen
- 80kb spec files — context window saturated, agent performance degrades

These mistakes degrade agent performance **silently**. No error is thrown. The agent just produces subtly wrong output.

## Examples of Errors Caught

**Missing required sections:**
```
$ spec-linter check my-project/CLAUDE.md

my-project/CLAUDE.md
  error  Missing required section: "Project Overview"  (S001)
  error  Missing required section: "Acceptance Criteria"  (S001)

2 error(s), 0 warning(s)
```

**Accidentally committed secret:**
```
$ spec-linter check my-project/CLAUDE.md

my-project/CLAUDE.md
  :15 error  Possible OpenAI/Anthropic API key detected. Remove before committing.  (S003)

1 error(s), 0 warning(s)
```

**Wildcard tool permissions:**
```
$ spec-linter check my-project/CLAUDE.md

my-project/CLAUDE.md
  :42 error  Wildcard tool permission (Tool(*:*)) — use explicit tool names instead of wildcards.  (S005)

1 error(s), 0 warning(s)
```

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
