import { describe, it, expect } from "vitest";
import { noDuplicateHeadersRule } from "../../src/rules/S006-no-duplicate-headers.js";
import { parseSpecFile } from "../../src/parser.js";

describe("S006 no-duplicate-headers", () => {
  const check = (content: string) => {
    const file = parseSpecFile("/test.md", content);
    return noDuplicateHeadersRule.check(file);
  };

  it("passes a file with unique headings", () => {
    const content = "## Overview\n\n## Constraints\n\n## Criteria";
    expect(check(content)).toHaveLength(0);
  });

  it("passes an empty file", () => {
    expect(check("")).toHaveLength(0);
  });

  it("passes headings at different levels with same text", () => {
    const content = "# Overview\n\n## Overview";
    expect(check(content)).toHaveLength(0);
  });

  it("catches duplicate ## headings", () => {
    const content = "## Overview\n\nFirst\n\n## Overview\n\nSecond";
    const results = check(content);
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe("warning");
  });

  it("reports the line of the duplicate, not the original", () => {
    const content = "## Overview\n\nFirst\n\n## Overview\n\nSecond";
    const results = check(content);
    expect(results[0].line).toBe(5);
  });

  it("catches multiple sets of duplicates", () => {
    const content = "## A\n\n## B\n\n## A\n\n## B";
    const results = check(content);
    expect(results).toHaveLength(2);
  });

  it("is case-insensitive", () => {
    const content = "## Overview\n\n## overview";
    const results = check(content);
    expect(results).toHaveLength(1);
  });

  it("has correct rule metadata", () => {
    expect(noDuplicateHeadersRule.id).toBe("S006");
    expect(noDuplicateHeadersRule.severity).toBe("warning");
  });
});
