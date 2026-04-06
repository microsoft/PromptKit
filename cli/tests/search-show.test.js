// SPDX-License-Identifier: MIT
// cli/tests/search-show.test.js — Tests for search, show, and list --all

const { describe, it, before } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cliPath = path.resolve(__dirname, "..", "bin", "cli.js");
const contentDir = path.resolve(__dirname, "..", "content");

function run(args, opts = {}) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    timeout: 15000,
    ...opts,
  });
}

function runFail(args) {
  try {
    execFileSync(process.execPath, [cliPath, ...args], {
      encoding: "utf8",
      timeout: 15000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return null;
  } catch (e) {
    return e;
  }
}

describe("List --all", () => {
  before(() => {
    assert.ok(
      fs.existsSync(contentDir),
      "content/ must exist — run 'npm run prepare' first"
    );
  });

  it("list --all shows all component types", () => {
    const output = run(["list", "--all"]);
    assert.ok(output.includes("persona"), "should include persona type");
    assert.ok(
      output.includes("protocol"),
      "should include protocol type"
    );
    assert.ok(output.includes("format"), "should include format type");
    assert.ok(output.includes("template"), "should include template type");
  });

  it("list --all --json returns all component types", () => {
    const output = run(["list", "--all", "--json"]);
    const items = JSON.parse(output);
    const types = new Set(items.map((i) => i.type));
    assert.ok(types.has("persona"), "JSON should include personas");
    assert.ok(types.has("protocol"), "JSON should include protocols");
    assert.ok(types.has("format"), "JSON should include formats");
    assert.ok(types.has("template"), "JSON should include templates");
    assert.ok(items.length > 100, "should have 100+ components");
  });

  it("list --type protocol shows only protocols", () => {
    const output = run(["list", "--type", "protocol", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should have protocols");
    for (const item of items) {
      assert.strictEqual(item.type, "protocol");
    }
  });

  it("list --type persona shows only personas", () => {
    const output = run(["list", "--type", "persona", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should have personas");
    for (const item of items) {
      assert.strictEqual(item.type, "persona");
    }
  });

  it("list --language C++ filters protocols by language", () => {
    const output = run(["list", "--language", "C++", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should have C++ protocols");
    for (const item of items) {
      assert.strictEqual(item.language, "C++");
    }
  });

  it("list without flags still shows only templates (backward compat)", () => {
    const output = run(["list", "--json"]);
    const items = JSON.parse(output);
    for (const item of items) {
      assert.strictEqual(
        item.type,
        "template",
        `default list should only show templates, got ${item.type}`
      );
    }
  });
});

describe("Search", () => {
  it("search finds components by keyword in name", () => {
    const output = run(["search", "memory-safety", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should find memory-safety components");
    assert.ok(
      items.some((i) => i.name.includes("memory-safety")),
      "should match by name"
    );
  });

  it("search finds components by keyword in description", () => {
    const output = run(["search", "deadlock", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should find deadlock-related components");
  });

  it("search with --type filters results", () => {
    const output = run(["search", "security", "--type", "template", "--json"]);
    const items = JSON.parse(output);
    for (const item of items) {
      assert.strictEqual(item.type, "template");
    }
  });

  it("search with no matches returns empty array", () => {
    const output = run([
      "search",
      "xyznonexistent12345",
      "--json",
    ]);
    const items = JSON.parse(output);
    assert.strictEqual(items.length, 0);
  });

  it("search is case-insensitive", () => {
    const lower = run(["search", "rfc", "--json"]);
    const upper = run(["search", "RFC", "--json"]);
    const lowerItems = JSON.parse(lower);
    const upperItems = JSON.parse(upper);
    assert.strictEqual(lowerItems.length, upperItems.length);
  });
});

describe("Show", () => {
  it("show displays component details", () => {
    const output = run(["show", "review-code"]);
    assert.ok(output.includes("review-code"), "should show component name");
    assert.ok(output.includes("template"), "should show type");
    assert.ok(
      output.includes("systems-engineer"),
      "should show persona"
    );
  });

  it("show --json returns structured detail", () => {
    const output = run(["show", "review-code", "--json"]);
    const detail = JSON.parse(output);
    assert.strictEqual(detail.name, "review-code");
    assert.strictEqual(detail.type, "template");
    assert.ok(detail.persona, "should have persona");
    assert.ok(detail.protocols, "should have protocols");
    assert.ok(detail.format, "should have format");
  });

  it("show for protocol includes usedByTemplates", () => {
    const output = run(["show", "anti-hallucination", "--json"]);
    const detail = JSON.parse(output);
    assert.strictEqual(detail.type, "protocol");
    assert.ok(
      Array.isArray(detail.usedByTemplates),
      "should have usedByTemplates"
    );
    assert.ok(
      detail.usedByTemplates.length > 0,
      "anti-hallucination should be used by templates"
    );
  });

  it("show for persona includes usedByTemplates", () => {
    const output = run(["show", "systems-engineer", "--json"]);
    const detail = JSON.parse(output);
    assert.strictEqual(detail.type, "persona");
    assert.ok(detail.usedByTemplates.length > 0);
  });

  it("show for nonexistent component exits with error", () => {
    const err = runFail(["show", "nonexistent-component-xyz"]);
    assert.ok(err, "should fail for nonexistent component");
  });
});
