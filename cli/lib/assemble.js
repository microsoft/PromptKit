// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// Loads and composes PromptKit components into an assembled prompt.

const fs = require("fs");
const path = require("path");

function stripFrontmatter(content) {
  const match = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (match) {
    return content.slice(match[0].length).trim();
  }
  return content.trim();
}

function loadComponent(contentDir, componentPath) {
  const fullPath = path.join(contentDir, componentPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: component not found: ${componentPath}`);
    return null;
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  // Strip leading HTML comments (SPDX headers)
  let body = raw;
  while (body.match(/^\s*<!--[\s\S]*?-->/)) {
    body = body.replace(/^\s*<!--[\s\S]*?-->/, "").trim();
  }
  // Strip YAML frontmatter
  body = stripFrontmatter(body);
  return body;
}

function substituteParams(content, params) {
  let result = content;
  for (const [key, value] of Object.entries(params)) {
    const placeholder = `{{${key}}}`;
    result = result.split(placeholder).join(value);
  }
  return result;
}

function assemble(contentDir, manifest, templateEntry, params = {}) {
  const { resolveTemplateDeps } = require("./manifest");
  const { persona, protocols, format } = resolveTemplateDeps(
    manifest,
    templateEntry
  );

  const sections = [];

  // 1. Identity (persona)
  if (persona) {
    const body = loadComponent(contentDir, persona.path);
    if (body) {
      sections.push("# Identity\n\n" + body);
    }
  }

  // 2. Reasoning Protocols
  if (protocols.length > 0) {
    const protocolBodies = protocols
      .map((p) => loadComponent(contentDir, p.path))
      .filter(Boolean);
    if (protocolBodies.length > 0) {
      sections.push(
        "# Reasoning Protocols\n\n" + protocolBodies.join("\n\n---\n\n")
      );
    }
  }

  // 3. Output Format
  if (format) {
    const body = loadComponent(contentDir, format.path);
    if (body) {
      sections.push("# Output Format\n\n" + body);
    }
  }

  // 4. Task (template)
  const templateBody = loadComponent(contentDir, templateEntry.path);
  if (templateBody) {
    sections.push("# Task\n\n" + templateBody);
  }

  let assembled = sections.join("\n\n---\n\n");

  // Substitute params
  if (Object.keys(params).length > 0) {
    assembled = substituteParams(assembled, params);
  }

  return assembled;
}

module.exports = { assemble, loadComponent, stripFrontmatter };
