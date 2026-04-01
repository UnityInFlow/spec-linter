# Contributing to spec-linter

## Adding a New Rule

1. Create `src/rules/SXXX-rule-name.ts` implementing the `Rule` interface
2. Create `tests/rules/SXXX.test.ts` with at least 3 passing and 3 failing cases
3. Register the rule in `src/rules/index.ts`
4. Update `README.md` rules table
5. Run `npm test` — all green
6. Submit a PR with the rule name in the title

## Rule Interface

```typescript
import { Rule, LintResult, ParsedSpecFile } from '../types.js';

export const myRule: Rule = {
  id: 'SXXX',
  name: 'rule-name',
  severity: 'error', // or 'warning'
  description: 'What this rule checks',
  check(file: ParsedSpecFile): LintResult[] {
    // Return array of issues found
    return [];
  },
};
```

## Development

```bash
npm install          # install deps
npm test             # run tests
npm run test:watch   # watch mode
npm run build        # build to dist/
npm run lint         # type check
```

## Commit Convention

```
feat: add SXXX rule-name rule
fix: S001 false positive on nested headers
test: add edge cases for empty file input
docs: update README with SXXX examples
```
