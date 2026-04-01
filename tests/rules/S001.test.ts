import { describe, it, expect } from "vitest";
import { requiredSectionsRule } from "../../src/rules/S001-required-sections.js";
import { parseSpecFile } from "../../src/parser.js";

describe("S001 required-sections", () => {
  const check = (content: string) => {
    const file = parseSpecFile("/test.md", content);
    return requiredSectionsRule.check(file);
  };

  it("passes when all required sections are present", () => {
    const content =
      "## Project Overview\n\nOverview\n\n## Constraints\n\nConstraints\n\n## Acceptance Criteria\n\nCriteria";
    expect(check(content)).toHaveLength(0);
  });

  it("passes with different heading levels for required sections", () => {
    const content =
      "# Project Overview\n\n## Constraints\n\n### Acceptance Criteria";
    expect(check(content)).toHaveLength(0);
  });

  it("passes when required sections exist among other sections", () => {
    const content =
      "## Intro\n\n## Project Overview\n\n## Stack\n\n## Constraints\n\n## Notes\n\n## Acceptance Criteria";
    expect(check(content)).toHaveLength(0);
  });

  it("fails when Project Overview is missing", () => {
    const content = "## Constraints\n\n## Acceptance Criteria";
    const results = check(content);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.message.includes("Project Overview"))).toBe(
      true,
    );
  });

  it("fails when Constraints is missing", () => {
    const content = "## Project Overview\n\n## Acceptance Criteria";
    const results = check(content);
    expect(results.some((r) => r.message.includes("Constraints"))).toBe(true);
  });

  it("fails when Acceptance Criteria is missing", () => {
    const content = "## Project Overview\n\n## Constraints";
    const results = check(content);
    expect(results.some((r) => r.message.includes("Acceptance Criteria"))).toBe(
      true,
    );
  });

  it("fails when all required sections are missing", () => {
    const content = "## Random Section\n\nSome text";
    const results = check(content);
    expect(results).toHaveLength(3);
  });

  it("fails on empty file", () => {
    const results = check("");
    expect(results).toHaveLength(3);
  });

  it("is case-insensitive for section matching", () => {
    const content =
      "## project overview\n\n## constraints\n\n## acceptance criteria";
    expect(check(content)).toHaveLength(0);
  });

  it("has correct rule metadata", () => {
    expect(requiredSectionsRule.id).toBe("S001");
    expect(requiredSectionsRule.severity).toBe("error");
  });
});
