// SPDX-License-Identifier: MIT
// cli/tests/list.test.js — List command integration tests

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

describe("List Command", () => {
  before(() => {
    assert.ok(
      fs.existsSync(contentDir),
      "content/ must exist — run 'npm run prepare' first"
    );
  });

  it("TC-CLI-050: list output contains category names and template names", () => {
    const output = run(["list"]);
    // Read the real manifest to check for actual template/category names
    const yaml = require("js-yaml");
    const manifest = yaml.load(
      fs.readFileSync(path.join(contentDir, "manifest.yaml"), "utf8")
    );
    for (const [category, items] of Object.entries(manifest.templates || {})) {
      assert.ok(
        output.includes(category),
        `output should contain category '${category}'`
      );
      for (const item of items) {
        assert.ok(
          output.includes(item.name),
          `output should contain template name '${item.name}'`
        );
      }
    }
  });

  it("TC-CLI-051: list --json produces valid JSON", () => {
    const output = run(["list", "--json"]);
    let parsed;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(output);
    }, "output should be valid JSON");
    assert.ok(Array.isArray(parsed), "parsed JSON should be an array");
  });

  it("TC-CLI-052: JSON output items have name, description, category", () => {
    const output = run(["list", "--json"]);
    const items = JSON.parse(output);
    assert.ok(items.length > 0, "should have at least one template");
    for (const item of items) {
      assert.ok("name" in item, `item should have 'name' property`);
      assert.ok(
        "description" in item,
        `item should have 'description' property`
      );
      assert.ok("category" in item, `item should have 'category' property`);
    }
  });

  it("TC-CLI-053: list output contains usage hint, not assemble", () => {
    const output = run(["list"]);
    assert.ok(
      output.includes("promptkit"),
      "output should contain usage hint referencing promptkit"
    );
    assert.ok(
      !output.includes("promptkit assemble"),
      "output should NOT reference 'promptkit assemble'"
    );
  });

  it("TC-CLI-122: list works without lib/manifest.js", () => {
    // Verify that lib/manifest.js does NOT exist
    const manifestModule = path.resolve(__dirname, "..", "lib", "manifest.js");
    assert.ok(
      !fs.existsSync(manifestModule),
      "lib/manifest.js should not exist"
    );
    // And list still works (uses inline yaml parsing)
    const output = run(["list"]);
    assert.ok(output.includes("Available PromptKit templates"));
  });
});
