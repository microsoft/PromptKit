#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const yaml = require("js-yaml");
const { launchInteractive } = require("../lib/launch");

const contentDir = path.resolve(__dirname, "..", "content");
const pkg = require("../package.json");

function ensureContent() {
  const missing = [];
  if (!fs.existsSync(path.join(contentDir, "bootstrap.md"))) {
    missing.push("bootstrap.md");
  }
  if (!fs.existsSync(path.join(contentDir, "manifest.yaml"))) {
    missing.push("manifest.yaml");
  }
  if (missing.length > 0) {
    console.error(
      `PromptKit content not found (missing: ${missing.join(", ")}).\n` +
        "Run 'npm run prepare' from the cli/ directory, or reinstall the package."
    );
    process.exit(1);
  }
}

const program = new Command();

program
  .name("promptkit")
  .description(
    "Composable prompt toolkit for software engineers.\n" +
      "Launch an interactive LLM session to assemble task-specific\n" +
      "prompts from reusable personas, protocols, formats, and templates."
  )
  .version(pkg.version);

// Default command: interactive mode
program
  .command("interactive", { isDefault: true })
  .description("Launch an interactive session with your LLM CLI (default)")
  .option(
    "--cli <name>",
    "LLM CLI to use (copilot, gh-copilot, claude)"
  )
  .action((opts) => {
    ensureContent();
    launchInteractive(contentDir, opts.cli || null);
  });

// List available templates
program
  .command("list")
  .description("List all available prompt templates")
  .option("--json", "Output as JSON")
  .action((opts) => {
    ensureContent();

    const raw = fs.readFileSync(
      path.join(contentDir, "manifest.yaml"),
      "utf8"
    );
    const manifest = yaml.load(raw);

    const templates = [];
    for (const [category, items] of Object.entries(manifest.templates || {})) {
      for (const item of items) {
        templates.push({ ...item, category });
      }
    }

    if (opts.json) {
      console.log(JSON.stringify(templates, null, 2));
      return;
    }

    const grouped = {};
    for (const t of templates) {
      if (!grouped[t.category]) grouped[t.category] = [];
      grouped[t.category].push(t);
    }

    console.log("\nAvailable PromptKit templates:\n");
    for (const [category, items] of Object.entries(grouped)) {
      console.log(`  ${category}`);
      for (const t of items) {
        const desc = t.description.trim().split("\n")[0].trim();
        console.log(`    ${t.name.padEnd(35)} ${desc}`);
      }
      console.log();
    }

    console.log(
      "\nRun promptkit to start an interactive session and assemble prompts."
    );
  });

program.parse();
