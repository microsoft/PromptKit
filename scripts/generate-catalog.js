#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// scripts/generate-catalog.js — Generate CATALOG.md from manifest.yaml
// Reuses cli/lib/manifest.js for parsing and cross-reference building.

const path = require("path");
const fs = require("fs");

const cliRoot = path.resolve(__dirname, "..", "cli");
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "CATALOG.md");

// Reuse the shared manifest parser from the CLI
let loadManifest;
try {
  ({ loadManifest } = require(path.join(cliRoot, "lib", "manifest")));
} catch (_error) {
  console.error(
    `Unable to load shared manifest module from ${cliRoot}/lib/manifest.js.\n` +
    `This script depends on the CLI dependencies being installed.\n` +
    `To fix this, run "npm ci" (or "npm install") in the "cli/" directory and try again.`
  );
  process.exit(1);
}

const { manifest, components, xrefs } = loadManifest(repoRoot);

// Organize protocols by category (the shared module flattens them)
const protocolsByCategory = { guardrails: [], analysis: [], reasoning: [] };
for (const p of components.protocols) {
  if (protocolsByCategory[p.category]) {
    protocolsByCategory[p.category].push(p);
  }
}

// Organize templates by category
const templatesByCategory = {};
for (const t of components.templates) {
  if (!templatesByCategory[t.category]) templatesByCategory[t.category] = [];
  templatesByCategory[t.category].push(t);
}

const pipelines = manifest.pipelines || {};

function desc(d) {
  return (d || "").trim().split("\n")[0].trim();
}

function xrefList(map, name) {
  const refs = map[name];
  if (!refs || refs.length === 0) return "—";
  return refs.map((r) => `\`${r}\``).join(", ");
}

// Count totals
const totalProtocols = components.protocols.length;
const totalTemplates = components.templates.length;
const total =
  components.personas.length +
  totalProtocols +
  components.formats.length +
  components.taxonomies.length +
  totalTemplates;

// Generate markdown
const lines = [];
const w = (s) => lines.push(s);

w("<!-- GENERATED FILE — do not edit manually. -->");
w("<!-- Regenerate with: node scripts/generate-catalog.js -->");
w("");
w("# PromptKit Component Catalog");
w("");
w(`> **${total} components** across 5 layers — auto-generated from \`manifest.yaml\` (v${manifest.version}).`);
w("");

// Quick reference
w("## Quick Reference");
w("");
w("| Layer | Count | Description |");
w("|-------|-------|-------------|");
w(`| Personas | ${components.personas.length} | Domain expert identities |`);
w(`| Protocols | ${totalProtocols} | Guardrails (${protocolsByCategory.guardrails.length}), Analysis (${protocolsByCategory.analysis.length}), Reasoning (${protocolsByCategory.reasoning.length}) |`);
w(`| Formats | ${components.formats.length} | Output structure definitions |`);
w(`| Taxonomies | ${components.taxonomies.length} | Classification schemes |`);
w(`| Templates | ${totalTemplates} | Task orchestration prompts |`);
w("");

// Templates by category
w("## Templates by Category");
w("");
for (const [cat, items] of Object.entries(templatesByCategory)) {
  w(`### ${cat} (${items.length})`);
  w("");
  w("| Template | Persona | Format | Description |");
  w("|----------|---------|--------|-------------|");
  for (const t of items) {
    w(
      `| \`${t.name}\` | ${t.persona || "—"} | ${t.format || "—"} | ${desc(t.description)} |`
    );
  }
  w("");
}

// Protocols by category
w("## Protocols");
w("");
for (const [cat, items] of Object.entries(protocolsByCategory)) {
  if (items.length === 0) continue;
  w(`### ${cat} (${items.length})`);
  w("");
  w("| Protocol | Language | Used by | Description |");
  w("|----------|----------|---------|-------------|");
  for (const p of items) {
    w(
      `| \`${p.name}\` | ${p.language || "—"} | ${xrefList(xrefs.protocolUsedBy, p.name)} | ${desc(p.description)} |`
    );
  }
  w("");
}

// Personas
w("## Personas");
w("");
w("| Persona | Used by | Description |");
w("|---------|---------|-------------|");
for (const p of components.personas) {
  w(
    `| \`${p.name}\` | ${xrefList(xrefs.personaUsedBy, p.name)} | ${desc(p.description)} |`
  );
}
w("");

// Formats
w("## Formats");
w("");
w("| Format | Produces | Consumes | Used by | Description |");
w("|--------|----------|----------|---------|-------------|");
for (const f of components.formats) {
  w(
    `| \`${f.name}\` | ${f.produces || "—"} | ${f.consumes || "—"} | ${xrefList(xrefs.formatUsedBy, f.name)} | ${desc(f.description)} |`
  );
}
w("");

// Taxonomies
w("## Taxonomies");
w("");
w("| Taxonomy | Domain | Used by | Description |");
w("|----------|--------|---------|-------------|");
for (const t of components.taxonomies) {
  w(
    `| \`${t.name}\` | ${t.domain || "—"} | ${xrefList(xrefs.taxonomyUsedBy, t.name)} | ${desc(t.description)} |`
  );
}
w("");

// Pipelines
w("## Pipelines");
w("");
for (const [name, pipeline] of Object.entries(pipelines)) {
  w(`### ${name}`);
  w("");
  w(desc(pipeline.description));
  w("");
  w("| Stage | Template | Consumes | Produces |");
  w("|-------|----------|----------|----------|");
  for (let i = 0; i < (pipeline.stages || []).length; i++) {
    const s = pipeline.stages[i];
    const consumes = s.consumes
      ? Array.isArray(s.consumes)
        ? s.consumes.join(", ")
        : s.consumes
      : "—";
    w(`| ${i + 1} | \`${s.template}\` | ${consumes} | ${s.produces || "—"} |`);
  }
  w("");
}

// Cross-reference index — iterate actual component inventories
// to include unused components and avoid phantom entries like "configurable"
w("## Cross-Reference Index");
w("");

function writeXrefSection(title, inventory, usedByMap) {
  w(title);
  w("");
  const names = inventory.map((c) => c.name).sort();
  for (const name of names) {
    const refs = usedByMap[name];
    const rendered = refs && refs.length > 0
      ? refs.map((t) => `\`${t}\``).join(", ")
      : "—";
    w(`- **\`${name}\`** → ${rendered}`);
  }
  w("");
}

writeXrefSection(
  "### Which templates use a given protocol?",
  components.protocols,
  xrefs.protocolUsedBy
);
writeXrefSection(
  "### Which templates use a given persona?",
  components.personas,
  xrefs.personaUsedBy
);
writeXrefSection(
  "### Which templates use a given format?",
  components.formats,
  xrefs.formatUsedBy
);
w("");

// Write output
const content = lines.join("\n") + "\n";
fs.writeFileSync(outputPath, content);
console.log(`Generated CATALOG.md (${total} components)`);
