#!/usr/bin/env node
// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// Copies PromptKit content from the repo root into cli/content/
// for bundling in the npm package.

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const contentDir = path.resolve(__dirname, "..", "content");

const dirs = ["personas", "protocols", "formats", "templates", "taxonomies"];
const files = ["manifest.yaml", "bootstrap.md"];

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".yaml")) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean and recreate
if (fs.existsSync(contentDir)) {
  fs.rmSync(contentDir, { recursive: true });
}
fs.mkdirSync(contentDir, { recursive: true });

// Copy individual files
for (const file of files) {
  const src = path.join(repoRoot, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(contentDir, file));
  }
}

// Copy directories
for (const dir of dirs) {
  copyDirRecursive(path.join(repoRoot, dir), path.join(contentDir, dir));
}

function countEntries(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    count++;
    if (entry.isDirectory()) {
      count += countEntries(path.join(dir, entry.name));
    }
  }
  return count;
}

const count = countEntries(contentDir);
console.log(`Copied PromptKit content to cli/content/ (${count} entries)`);
