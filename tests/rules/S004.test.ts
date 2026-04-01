import { describe, it, expect } from "vitest";
import { fileSizeRule } from "../../src/rules/S004-file-size.js";
import { parseSpecFile } from "../../src/parser.js";

describe("S004 file-size", () => {
  const check = (content: string) => {
    const file = parseSpecFile("/test.md", content);
    return fileSizeRule.check(file);
  };

  it("passes a small file", () => {
    expect(check("Small file content")).toHaveLength(0);
  });

  it("passes a file just under 30kb", () => {
    const content = "x".repeat(29 * 1024);
    expect(check(content)).toHaveLength(0);
  });

  it("warns for a file over 30kb", () => {
    const content = "x".repeat(31 * 1024);
    const results = check(content);
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe("warning");
    expect(results[0].ruleId).toBe("S004");
  });

  it("errors for a file over 50kb", () => {
    const content = "x".repeat(51 * 1024);
    const results = check(content);
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe("error");
  });

  it("errors at exactly the 50kb boundary", () => {
    const content = "x".repeat(50 * 1024 + 1);
    const results = check(content);
    expect(results).toHaveLength(1);
    expect(results[0].severity).toBe("error");
  });

  it("passes an empty file", () => {
    expect(check("")).toHaveLength(0);
  });

  it("has correct rule metadata", () => {
    expect(fileSizeRule.id).toBe("S004");
    expect(fileSizeRule.name).toBe("file-size");
  });
});
