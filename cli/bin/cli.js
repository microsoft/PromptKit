#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { loadManifest, getTemplates } = require("../lib/manifest");
const { assemble } = require("../lib/assemble");
const { launchInteractive, detectCli } = require("../lib/launch");

const contentDir = path.resolve(__dirname, "..", "content");
const pkg = require("../package.json");

function ensureContent() {
  if (!fs.existsSync(path.join(contentDir, "manifest.yaml"))) {
    console.error(
      "PromptKit content not found. Run 'npm run prepare' from the cli/ directory,\n" +
        "or reinstall the package."
    );
    process.exit(1);
  }
}

const program = new Command();

program
  .name("promptkit")
  .description(
    "Composable prompt toolkit for software engineers.\n" +
      "Assemble task-specific prompts from reusable components."
  )
  .version(pkg.version);

// Default command: interactive mode
program
  .command("interactive", { isDefault: true })
  .description("Launch an interactive session with your LLM CLI (default)")
  .option("--cli <name>", "LLM CLI to use (copilot, claude)")
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
    const manifest = loadManifest(contentDir);
    const templates = getTemplates(manifest);

    if (opts.json) {
      console.log(JSON.stringify(templates, null, 2));
      return;
    }

    // Group by category
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
      "Use: promptkit assemble <template> --output <file> to assemble a prompt."
    );
  });

// Assemble a specific template
program
  .command("assemble <template>")
  .description("Assemble a prompt from a template")
  .option("-o, --output <file>", "Output file path", "assembled-prompt.md")
  .option(
    "-p, --param <key=value>",
    "Template parameter (repeatable)",
    collectParams,
    {}
  )
  .action((templateName, opts) => {
    ensureContent();
    const manifest = loadManifest(contentDir);
    const templates = getTemplates(manifest);
    const template = templates.find((t) => t.name === templateName);

    if (!template) {
      console.error(`Template '${templateName}' not found.\n`);
      console.error("Available templates:");
      for (const t of templates) {
        console.error(`  ${t.name}`);
      }
      process.exit(1);
    }

    const assembled = assemble(contentDir, manifest, template, opts.param);

    const outputPath = path.resolve(opts.output);
    fs.writeFileSync(outputPath, assembled, "utf8");
    console.log(`Assembled prompt written to: ${outputPath}`);
    console.log(`Template: ${template.name}`);
    console.log(`Persona: ${template.persona}`);
    console.log(`Protocols: ${(template.protocols || []).join(", ")}`);
    if (template.format) {
      console.log(`Format: ${template.format}`);
    }

    // Report unfilled params
    const unfilled = assembled.match(/\{\{[a-z_]+\}\}/g);
    if (unfilled) {
      const unique = [...new Set(unfilled)];
      console.log(
        `\nNote: ${unique.length} unfilled parameter(s): ${unique.join(", ")}`
      );
      console.log("Use --param key=value to fill them.");
    }
  });

function collectParams(value, previous) {
  const [key, ...rest] = value.split("=");
  previous[key] = rest.join("=");
  return previous;
}

program.parse();
