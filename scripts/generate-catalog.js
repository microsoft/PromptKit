#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// scripts/generate-catalog.js — Generate CATALOG.md from manifest.yaml

const path = require("path");
const fs = require("fs");

// Resolve js-yaml from the CLI's node_modules
const yaml = require(require.resolve("js-yaml", {
  paths: [path.resolve(__dirname, "..", "cli")],
}));

const repoRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(repoRoot, "manifest.yaml");
const outputPath = path.join(repoRoot, "CATALOG.md");

const raw = fs.readFileSync(manifestPath, "utf8");
const manifest = yaml.load(raw);

// Collect all components
const personas = manifest.personas || [];
const protocols = { guardrails: [], analysis: [], reasoning: [] };
for (const [cat, items] of Object.entries(manifest.protocols || {})) {
  protocols[cat] = items;
}
const formats = manifest.formats || [];
const taxonomies = manifest.taxonomies || [];
const templates = {};
for (const [cat, items] of Object.entries(manifest.templates || {})) {
  templates[cat] = items;
}
const pipelines = manifest.pipelines || {};

// Build cross-reference maps
const protocolUsedBy = {};
const personaUsedBy = {};
const formatUsedBy = {};
const taxonomyUsedBy = {};

const allTemplates = [];
for (const [cat, items] of Object.entries(templates)) {
  for (const t of items) {
    allTemplates.push({ ...t, category: cat });
    if (t.protocols) {
      for (const p of t.protocols) {
        if (!protocolUsedBy[p]) protocolUsedBy[p] = [];
        protocolUsedBy[p].push(t.name);
      }
    }
    if (t.persona) {
      if (!personaUsedBy[t.persona]) personaUsedBy[t.persona] = [];
      personaUsedBy[t.persona].push(t.name);
    }
    if (t.format) {
      if (!formatUsedBy[t.format]) formatUsedBy[t.format] = [];
      formatUsedBy[t.format].push(t.name);
    }
    if (t.taxonomies) {
      for (const tx of t.taxonomies) {
        if (!taxonomyUsedBy[tx]) taxonomyUsedBy[tx] = [];
        taxonomyUsedBy[tx].push(t.name);
      }
    }
  }
}

function desc(d) {
  return (d || "").trim().split("\n")[0].trim();
}

function xrefList(map, name) {
  const refs = map[name];
  if (!refs || refs.length === 0) return "—";
  return refs.map((r) => `\`${r}\``).join(", ");
}

// Count totals
const totalProtocols =
  protocols.guardrails.length +
  protocols.analysis.length +
  protocols.reasoning.length;
const totalTemplates = allTemplates.length;
const total =
  personas.length +
  totalProtocols +
  formats.length +
  taxonomies.length +
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
w(`| Personas | ${personas.length} | Domain expert identities |`);
w(`| Protocols | ${totalProtocols} | Guardrails (${protocols.guardrails.length}), Analysis (${protocols.analysis.length}), Reasoning (${protocols.reasoning.length}) |`);
w(`| Formats | ${formats.length} | Output structure definitions |`);
w(`| Taxonomies | ${taxonomies.length} | Classification schemes |`);
w(`| Templates | ${totalTemplates} | Task orchestration prompts |`);
w("");

// Templates by category
w("## Templates by Category");
w("");
for (const [cat, items] of Object.entries(templates)) {
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
for (const [cat, items] of Object.entries(protocols)) {
  if (items.length === 0) continue;
  w(`### ${cat} (${items.length})`);
  w("");
  w("| Protocol | Language | Used by | Description |");
  w("|----------|----------|---------|-------------|");
  for (const p of items) {
    w(
      `| \`${p.name}\` | ${p.language || "—"} | ${xrefList(protocolUsedBy, p.name)} | ${desc(p.description)} |`
    );
  }
  w("");
}

// Personas
w("## Personas");
w("");
w("| Persona | Used by | Description |");
w("|---------|---------|-------------|");
for (const p of personas) {
  w(
    `| \`${p.name}\` | ${xrefList(personaUsedBy, p.name)} | ${desc(p.description)} |`
  );
}
w("");

// Formats
w("## Formats");
w("");
w("| Format | Produces | Consumes | Used by | Description |");
w("|--------|----------|----------|---------|-------------|");
for (const f of formats) {
  w(
    `| \`${f.name}\` | ${f.produces || "—"} | ${f.consumes || "—"} | ${xrefList(formatUsedBy, f.name)} | ${desc(f.description)} |`
  );
}
w("");

// Taxonomies
w("## Taxonomies");
w("");
w("| Taxonomy | Domain | Used by | Description |");
w("|----------|--------|---------|-------------|");
for (const t of taxonomies) {
  w(
    `| \`${t.name}\` | ${t.domain || "—"} | ${xrefList(taxonomyUsedBy, t.name)} | ${desc(t.description)} |`
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

// Cross-reference index
w("## Cross-Reference Index");
w("");
w("### Which templates use a given protocol?");
w("");
const sortedProtocols = Object.keys(protocolUsedBy).sort();
for (const p of sortedProtocols) {
  w(`- **\`${p}\`** → ${protocolUsedBy[p].map((t) => `\`${t}\``).join(", ")}`);
}
w("");

w("### Which templates use a given persona?");
w("");
const sortedPersonas = Object.keys(personaUsedBy).sort();
for (const p of sortedPersonas) {
  w(`- **\`${p}\`** → ${personaUsedBy[p].map((t) => `\`${t}\``).join(", ")}`);
}
w("");

w("### Which templates use a given format?");
w("");
const sortedFormats = Object.keys(formatUsedBy).sort();
for (const f of sortedFormats) {
  w(`- **\`${f}\`** → ${formatUsedBy[f].map((t) => `\`${t}\``).join(", ")}`);
}
w("");

// Write output
const content = lines.join("\n") + "\n";
fs.writeFileSync(outputPath, content);
console.log(`Generated CATALOG.md (${total} components)`);
