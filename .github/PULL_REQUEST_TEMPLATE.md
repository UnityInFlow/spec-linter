## What
<!-- One sentence: what this PR does -->

## Why
<!-- Link to milestone, or brief rationale -->

## Checklist

### Code
- [ ] No `any` types in production code
- [ ] No secrets, API keys, or credentials
- [ ] No `console.log` debug output left in
- [ ] Named exports only (no default exports)

### Tests
- [ ] New tests added for new functionality
- [ ] All tests pass locally (`npm test`)
- [ ] Edge cases covered (empty input, large input, malformed input)

### Docs
- [ ] ADR written if a non-obvious decision was made
- [ ] README updated (if milestone boundary)
- [ ] Inline JSDoc on public APIs

### Verification
- [ ] CI green on this branch
- [ ] Manual smoke test passed (command + expected output noted below)

### Self-Review
- [ ] I re-read the diff top-to-bottom
- [ ] No unrelated changes bundled in
- [ ] Commit messages follow convention (`feat:`, `fix:`, `test:`, `docs:`)

### Smoke Test Evidence
```
<!-- paste the command you ran and its output -->
```
