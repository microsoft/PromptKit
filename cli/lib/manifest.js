// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// Parses manifest.yaml and resolves component paths.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function loadManifest(contentDir) {
  const manifestPath = path.join(contentDir, "manifest.yaml");
  const raw = fs.readFileSync(manifestPath, "utf8");
  return yaml.load(raw);
}

function getTemplates(manifest) {
  const templates = [];
  for (const [category, items] of Object.entries(manifest.templates || {})) {
    for (const item of items) {
      templates.push({ ...item, category });
    }
  }
  return templates;
}

function getPersona(manifest, name) {
  return (manifest.personas || []).find((p) => p.name === name);
}

function getProtocol(manifest, shortName) {
  for (const category of Object.values(manifest.protocols || {})) {
    const found = category.find((p) => p.name === shortName);
    if (found) return found;
  }
  return null;
}

function getFormat(manifest, name) {
  return (manifest.formats || []).find((f) => f.name === name);
}

function getTaxonomy(manifest, name) {
  return (manifest.taxonomies || []).find((t) => t.name === name);
}

function resolveTemplateDeps(manifest, template) {
  const persona = getPersona(manifest, template.persona);

  // Template frontmatter uses category/name paths; manifest uses short names.
  // The manifest entry has the short-name list, so we use that.
  const protocols = (template.protocols || []).map((shortName) => {
    const proto = getProtocol(manifest, shortName);
    if (!proto) {
      console.warn(`Warning: protocol '${shortName}' not found in manifest`);
    }
    return proto;
  }).filter(Boolean);

  const format = template.format ? getFormat(manifest, template.format) : null;

  const taxonomies = (template.taxonomies || []).map((name) => {
    const tax = getTaxonomy(manifest, name);
    if (!tax) {
      console.warn(`Warning: taxonomy '${name}' not found in manifest`);
    }
    return tax;
  }).filter(Boolean);

  return { persona, protocols, taxonomies, format };
}

module.exports = {
  loadManifest,
  getTemplates,
  getPersona,
  getProtocol,
  getFormat,
  getTaxonomy,
  resolveTemplateDeps,
};
