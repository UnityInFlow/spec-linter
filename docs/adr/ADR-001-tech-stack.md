# ADR-001: Tech Stack for spec-linter

**Status:** Accepted
**Date:** 2026-04-01

## Context

spec-linter is a CLI tool that validates AI spec files. It needs to parse Markdown, run rules against parsed content, and output results. It will be published to npm.

## Decision

- **TypeScript** with strict mode, targeting ES2022, ESM modules
- **tsup** for building (zero-config, ESM+CJS+types, fast)
- **vitest** for testing (native ESM, fast, good TypeScript support)
- **commander** for CLI argument parsing (mature, well-typed)
- **No external Markdown parser** — we parse headings with regex (sections are `## Heading` lines). This avoids a dependency on `marked` or `remark` for what is essentially line-by-line scanning.

## Alternatives Considered

- **esbuild** — faster build but no DTS generation without plugin
- **jest** — slower, ESM support requires workarounds
- **yargs** — heavier API surface than commander for a simple CLI
- **marked/remark** — full AST parser is overkill; our rules operate on heading-level sections and raw line content

## Consequences

- Build is fast and zero-config
- No runtime dependencies except `commander`
- Markdown parsing is limited to heading extraction — if future rules need AST-level analysis (e.g. parsing tables), we may need to revisit and add a parser library (document in ADR-002 if so)
