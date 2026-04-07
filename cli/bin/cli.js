#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { launchInteractive } = require("../lib/launch");
const {
  loadManifest,
  allComponents,
  searchComponents,
  filterComponents,
  showComponent,
} = require("../lib/manifest");

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

function formatDescription(desc) {
  return (desc || "").trim().split("\n")[0].trim();
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
  .option(
    "--dry-run",
    "Print the spawn command and args without launching the LLM CLI"
  )
  .action((opts) => {
    ensureContent();
    launchInteractive(contentDir, opts.cli || null, { dryRun: !!opts.dryRun });
  });

// List components
program
  .command("list")
  .description("List available components")
  .option("--all", "Show all component types (not just templates)")
  .option(
    "--type <type>",
    "Filter by type (persona, protocol, format, taxonomy, template)"
  )
  .option("--category <category>", "Filter by category")
  .option("--language <language>", "Filter protocols by language")
  .option("--json", "Output as JSON")
  .action((opts) => {
    ensureContent();
    const { components } = loadManifest(contentDir);

    let results;
    if (opts.type || opts.category || opts.language) {
      results = filterComponents(components, {
        type: opts.type,
        category: opts.category,
        language: opts.language,
      });
    } else if (opts.all) {
      results = allComponents(components);
    } else {
      // Default: templates only (backward compatible)
      results = components.templates;
    }

    if (opts.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    if (results.length === 0) {
      console.log("\nNo components match the given filters.\n");
      return;
    }

    // Group by type, then by category
    const grouped = {};
    for (const c of results) {
      const group = c.category ? `${c.type} / ${c.category}` : c.type;
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(c);
    }

    const showingAll = opts.all || opts.type;
    console.log(
      showingAll
        ? `\nPromptKit components (${results.length}):\n`
        : "\nAvailable PromptKit templates:\n"
    );

    for (const [group, items] of Object.entries(grouped)) {
      console.log(`  ${group}`);
      for (const c of items) {
        const desc = formatDescription(c.description);
        const suffix = c.language ? ` [${c.language}]` : "";
        console.log(`    ${c.name.padEnd(35)} ${desc}${suffix}`);
      }
      console.log();
    }

    console.log(
      "\nRun promptkit show <name> for details, or promptkit search <keyword> to search."
    );
  });

// Search components
program
  .command("search <keyword>")
  .description("Search components by keyword (matches name + description)")
  .option(
    "--type <type>",
    "Filter by type (persona, protocol, format, taxonomy, template)"
  )
  .option("--json", "Output as JSON")
  .action((keyword, opts) => {
    ensureContent();
    const { components } = loadManifest(contentDir);

    let results = searchComponents(components, keyword);
    if (opts.type) {
      results = results.filter((c) => c.type === opts.type);
    }

    if (opts.json) {
      console.log(JSON.stringify(results, null, 2));
      return;
    }

    if (results.length === 0) {
      console.log(`\nNo components match "${keyword}".\n`);
      return;
    }

    console.log(`\nSearch results for "${keyword}" (${results.length}):\n`);
    for (const c of results) {
      const desc = formatDescription(c.description);
      const meta = [c.type];
      if (c.category) meta.push(c.category);
      if (c.language) meta.push(c.language);
      console.log(`  ${c.name.padEnd(35)} [${meta.join(", ")}]`);
      console.log(`    ${desc}`);
      console.log();
    }
  });

// Show component detail
program
  .command("show <name>")
  .description("Show details and cross-references for a component")
  .option("--json", "Output as JSON")
  .action((name, opts) => {
    ensureContent();
    const { components, xrefs } = loadManifest(contentDir);

    const detail = showComponent(components, xrefs, name);
    if (!detail) {
      console.error(`Component "${name}" not found.`);
      process.exit(1);
    }

    if (opts.json) {
      console.log(JSON.stringify(detail, null, 2));
      return;
    }

    console.log(`\n${detail.name}`);
    console.log("=".repeat(detail.name.length));
    console.log(`Type:        ${detail.type}`);
    if (detail.category) console.log(`Category:    ${detail.category}`);
    if (detail.language) console.log(`Language:    ${detail.language}`);
    if (detail.domain) {
      const domains = Array.isArray(detail.domain)
        ? detail.domain.join(", ")
        : detail.domain;
      console.log(`Domain:      ${domains}`);
    }
    if (detail.tone) console.log(`Tone:        ${detail.tone}`);
    if (detail.produces) console.log(`Produces:    ${detail.produces}`);
    if (detail.consumes) console.log(`Consumes:    ${detail.consumes}`);
    if (detail.path) console.log(`Path:        ${detail.path}`);
    console.log();
    console.log(`Description: ${formatDescription(detail.description)}`);

    // Template-specific fields
    if (detail.type === "template") {
      console.log();
      if (detail.persona) console.log(`Persona:     ${detail.persona}`);
      if (detail.protocols) {
        console.log(`Protocols:   ${detail.protocols.join(", ")}`);
      }
      if (detail.format) console.log(`Format:      ${detail.format}`);
      if (detail.taxonomies) {
        console.log(`Taxonomies:  ${detail.taxonomies.join(", ")}`);
      }
    }

    // Cross-references
    if (detail.usedByTemplates && detail.usedByTemplates.length > 0) {
      console.log();
      console.log("Used by templates:");
      for (const t of detail.usedByTemplates) {
        console.log(`  - ${t}`);
      }
    }
    console.log();
  });

program.parse();
