// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// cli/lib/manifest.js — Shared manifest parser and cross-reference builder

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Parse manifest.yaml and return a structured component inventory
 * with cross-reference maps.
 */
function loadManifest(contentDir) {
  const raw = fs.readFileSync(
    path.join(contentDir, "manifest.yaml"),
    "utf8"
  );
  const manifest = yaml.load(raw);

  const components = {
    personas: [],
    protocols: [],
    formats: [],
    taxonomies: [],
    templates: [],
  };

  // Personas
  for (const p of manifest.personas || []) {
    components.personas.push({ ...p, type: "persona" });
  }

  // Protocols (nested by category)
  for (const [category, items] of Object.entries(manifest.protocols || {})) {
    for (const item of items) {
      components.protocols.push({ ...item, type: "protocol", category });
    }
  }

  // Formats
  for (const f of manifest.formats || []) {
    components.formats.push({ ...f, type: "format" });
  }

  // Taxonomies
  for (const t of manifest.taxonomies || []) {
    components.taxonomies.push({ ...t, type: "taxonomy" });
  }

  // Templates (nested by category)
  for (const [category, items] of Object.entries(manifest.templates || {})) {
    for (const item of items) {
      components.templates.push({ ...item, type: "template", category });
    }
  }

  // Build cross-reference maps
  const xrefs = buildCrossRefs(components);

  return { manifest, components, xrefs, version: manifest.version };
}

/**
 * Build reverse cross-reference maps:
 * - protocolUsedBy: protocol name → [template names]
 * - personaUsedBy: persona name → [template names]
 * - formatUsedBy: format name → [template names]
 * - taxonomyUsedBy: taxonomy name → [template names]
 */
function buildCrossRefs(components) {
  const protocolUsedBy = {};
  const personaUsedBy = {};
  const formatUsedBy = {};
  const taxonomyUsedBy = {};

  for (const t of components.templates) {
    // Protocols
    if (t.protocols) {
      for (const p of t.protocols) {
        if (!protocolUsedBy[p]) protocolUsedBy[p] = [];
        protocolUsedBy[p].push(t.name);
      }
    }
    // Persona
    if (t.persona) {
      if (!personaUsedBy[t.persona]) personaUsedBy[t.persona] = [];
      personaUsedBy[t.persona].push(t.name);
    }
    // Format
    if (t.format) {
      if (!formatUsedBy[t.format]) formatUsedBy[t.format] = [];
      formatUsedBy[t.format].push(t.name);
    }
    // Taxonomies
    if (t.taxonomies) {
      for (const tx of t.taxonomies) {
        if (!taxonomyUsedBy[tx]) taxonomyUsedBy[tx] = [];
        taxonomyUsedBy[tx].push(t.name);
      }
    }
  }

  return { protocolUsedBy, personaUsedBy, formatUsedBy, taxonomyUsedBy };
}

/**
 * Get all components as a flat array with unified shape.
 */
function allComponents(components) {
  return [
    ...components.personas,
    ...components.protocols,
    ...components.formats,
    ...components.taxonomies,
    ...components.templates,
  ];
}

/**
 * Search components by keyword (matches name + description).
 */
function searchComponents(components, keyword) {
  const lower = keyword.toLowerCase();
  return allComponents(components).filter((c) => {
    const name = (c.name || "").toLowerCase();
    const desc = (c.description || "").toLowerCase();
    return name.includes(lower) || desc.includes(lower);
  });
}

/**
 * Filter components by type, category, and/or language.
 */
function filterComponents(components, { type, category, language } = {}) {
  let results = allComponents(components);

  if (type) {
    results = results.filter((c) => c.type === type);
  }
  if (category) {
    const lower = category.toLowerCase();
    results = results.filter(
      (c) => c.category && c.category.toLowerCase() === lower
    );
  }
  if (language) {
    const lower = language.toLowerCase();
    results = results.filter(
      (c) => c.language && c.language.toLowerCase() === lower
    );
  }

  return results;
}

/**
 * Get detailed info for a single component by name, including cross-refs.
 */
function showComponent(components, xrefs, name) {
  const all = allComponents(components);
  const match = all.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (!match) return null;

  const detail = { ...match };

  // Add reverse cross-references
  if (match.type === "protocol") {
    detail.usedByTemplates = xrefs.protocolUsedBy[match.name] || [];
  } else if (match.type === "persona") {
    detail.usedByTemplates = xrefs.personaUsedBy[match.name] || [];
  } else if (match.type === "format") {
    detail.usedByTemplates = xrefs.formatUsedBy[match.name] || [];
  } else if (match.type === "taxonomy") {
    detail.usedByTemplates = xrefs.taxonomyUsedBy[match.name] || [];
  }

  return detail;
}

module.exports = {
  loadManifest,
  allComponents,
  searchComponents,
  filterComponents,
  showComponent,
};
