import { describe, it, expect } from "vitest";
import { lint } from "../src/engine.js";

describe("lint", () => {
  it("returns a report with zero results for empty rules", () => {
    const report = lint(
      "/test.md",
      "## Project Overview\n\n## Constraints\n\n## Acceptance Criteria",
      [],
    );
    expect(report.file).toBe("/test.md");
    expect(report.results).toHaveLength(0);
    expect(report.errorCount).toBe(0);
    expect(report.warningCount).toBe(0);
  });

  it("returns a report with file path", () => {
    const report = lint("/path/to/CLAUDE.md", "content", []);
    expect(report.file).toBe("/path/to/CLAUDE.md");
  });

  it("aggregates results from multiple rules", () => {
    const fakeRule = {
      id: "T001",
      name: "test-rule",
      severity: "error" as const,
      description: "test",
      check: () => [
        { ruleId: "T001", severity: "error" as const, message: "fail" },
      ],
    };
    const report = lint("/test.md", "content", [fakeRule]);
    expect(report.results).toHaveLength(1);
    expect(report.errorCount).toBe(1);
    expect(report.warningCount).toBe(0);
  });

  it("counts errors and warnings separately", () => {
    const errorRule = {
      id: "T001",
      name: "error-rule",
      severity: "error" as const,
      description: "test",
      check: () => [
        { ruleId: "T001", severity: "error" as const, message: "err" },
      ],
    };
    const warningRule = {
      id: "T002",
      name: "warning-rule",
      severity: "warning" as const,
      description: "test",
      check: () => [
        { ruleId: "T002", severity: "warning" as const, message: "warn" },
      ],
    };
    const report = lint("/test.md", "content", [errorRule, warningRule]);
    expect(report.errorCount).toBe(1);
    expect(report.warningCount).toBe(1);
    expect(report.results).toHaveLength(2);
  });
});
