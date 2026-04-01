import { describe, it, expect } from "vitest";
import { parseSpecFile } from "../src/parser.js";

describe("parseSpecFile", () => {
  it("parses sections from markdown headings", () => {
    const raw =
      "# Title\n\nSome content\n\n## Overview\n\nOverview text\n\n## Constraints\n\nConstraint text";
    const result = parseSpecFile("/test.md", raw);

    expect(result.sections).toHaveLength(3);
    expect(result.sections[0]).toMatchObject({
      heading: "Title",
      level: 1,
      line: 1,
    });
    expect(result.sections[1]).toMatchObject({
      heading: "Overview",
      level: 2,
      line: 5,
    });
    expect(result.sections[2]).toMatchObject({
      heading: "Constraints",
      level: 2,
      line: 9,
    });
  });

  it("captures section content between headings", () => {
    const raw = "## First\n\nFirst content\n\n## Second\n\nSecond content";
    const result = parseSpecFile("/test.md", raw);

    expect(result.sections[0].content).toContain("First content");
    expect(result.sections[1].content).toContain("Second content");
  });

  it("returns empty sections for empty input", () => {
    const result = parseSpecFile("/empty.md", "");
    expect(result.sections).toHaveLength(0);
    expect(result.sizeBytes).toBe(0);
  });

  it("handles file with no headings", () => {
    const raw = "Just some text without any headings";
    const result = parseSpecFile("/no-headings.md", raw);
    expect(result.sections).toHaveLength(0);
  });

  it("calculates sizeBytes correctly", () => {
    const raw = "Hello world";
    const result = parseSpecFile("/test.md", raw);
    expect(result.sizeBytes).toBe(Buffer.byteLength(raw, "utf-8"));
  });

  it("handles headings inside code blocks by ignoring them", () => {
    const raw =
      "## Real Heading\n\n```\n## Not A Heading\n```\n\n## Another Real Heading";
    const result = parseSpecFile("/test.md", raw);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].heading).toBe("Real Heading");
    expect(result.sections[1].heading).toBe("Another Real Heading");
  });
});
