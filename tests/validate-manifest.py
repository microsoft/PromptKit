#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
# Copyright (c) PromptKit Contributors

"""Validate that manifest.yaml protocol lists match template frontmatter.

This script prevents drift between the protocol lists declared in
manifest.yaml (which bootstrap.md reads to assemble prompts) and the
protocol lists in each template's YAML frontmatter (the source of truth
for which protocols a template actually uses).

Exit code 0 = all protocol lists match.
Exit code 1 = one or more mismatches detected.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Lightweight YAML helpers (avoids external dependencies)
# ---------------------------------------------------------------------------

def parse_yaml_frontmatter(text: str) -> dict[str, object] | None:
    """Extract the YAML frontmatter block between --- delimiters.

    Returns a minimal dict with the keys we care about (protocols),
    or None if no frontmatter is found.
    """
    match = re.search(r"^---\s*\n(.*?)\n---", text, re.DOTALL | re.MULTILINE)
    if not match:
        return None
    block = match.group(1)
    protocols: list[str] = []
    in_protocols = False
    for line in block.splitlines():
        stripped = line.strip()
        if stripped.startswith("protocols:"):
            in_protocols = True
            # Handle inline list: protocols: [a, b, c]
            inline = re.search(r"\[(.+)]", stripped)
            if inline:
                protocols = [p.strip().strip("'\"") for p in inline.group(1).split(",")]
                in_protocols = False
            continue
        if in_protocols:
            if stripped.startswith("- "):
                protocols.append(stripped[2:].strip().strip("'\""))
            else:
                in_protocols = False
    return {"protocols": protocols}


def parse_manifest_templates(manifest_text: str) -> dict[str, list[str]]:
    """Parse manifest.yaml and return {template_name: [protocol_short_names]}.

    Uses a line-by-line state machine to avoid a PyYAML dependency.
    """
    templates: dict[str, list[str]] = {}
    current_name: str | None = None
    for line in manifest_text.splitlines():
        stripped = line.strip()
        # Detect template name
        name_match = re.match(r"^-\s*name:\s*(.+)", stripped)
        if name_match:
            # Only capture names under the templates section; we rely on
            # the fact that template entries have a 'path' starting with
            # 'templates/'.  We'll validate that below.
            current_name = name_match.group(1).strip().strip("'\"")
            continue
        # Detect path to confirm this is a template entry
        if current_name and stripped.startswith("path:"):
            path_val = stripped.split(":", 1)[1].strip().strip("'\"")
            if not path_val.startswith("templates/"):
                current_name = None
            continue
        # Detect protocols line
        if current_name and stripped.startswith("protocols:"):
            inline = re.search(r"\[(.+)]", stripped)
            if inline:
                protocols = [p.strip().strip("'\"") for p in inline.group(1).split(",")]
                templates[current_name] = protocols
            current_name = None
            continue
    return templates


def protocol_short_name(full_path: str) -> str:
    """Extract the short protocol name from a category/name path.

    E.g. 'guardrails/anti-hallucination' -> 'anti-hallucination'
         'anti-hallucination'            -> 'anti-hallucination'
    """
    return full_path.rsplit("/", 1)[-1]

# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate(repo_root: Path) -> list[str]:
    """Compare manifest protocol lists against template frontmatter.

    Returns a list of human-readable error strings (empty = success).
    """
    manifest_path = repo_root / "manifest.yaml"
    templates_dir = repo_root / "templates"
    errors: list[str] = []

    if not manifest_path.exists():
        errors.append(f"manifest.yaml not found at {manifest_path}")
        return errors

    manifest_text = manifest_path.read_text(encoding="utf-8")
    manifest_templates = parse_manifest_templates(manifest_text)

    if not manifest_templates:
        errors.append("No templates found in manifest.yaml")
        return errors

    # Check every template file in the templates directory
    template_files = sorted(templates_dir.glob("*.md"))
    frontmatter_names: set[str] = set()

    for tmpl_file in template_files:
        tmpl_text = tmpl_file.read_text(encoding="utf-8")
        fm = parse_yaml_frontmatter(tmpl_text)
        if fm is None:
            errors.append(f"{tmpl_file.name}: no YAML frontmatter found")
            continue

        # Derive the template name from frontmatter or filename
        name_match = re.search(r"^name:\s*(.+)", tmpl_text.split("---")[1], re.MULTILINE)
        if name_match:
            tmpl_name = name_match.group(1).strip().strip("'\"")
        else:
            tmpl_name = tmpl_file.stem
        frontmatter_names.add(tmpl_name)

        # Get protocols from frontmatter (normalize to short names)
        fm_protocols = sorted(set(protocol_short_name(p) for p in fm["protocols"]))

        # Get protocols from manifest
        if tmpl_name not in manifest_templates:
            errors.append(
                f"{tmpl_name}: present in templates/ but missing from manifest.yaml"
            )
            continue

        manifest_protocols = sorted(set(manifest_templates[tmpl_name]))

        if fm_protocols != manifest_protocols:
            fm_only = sorted(set(fm_protocols) - set(manifest_protocols))
            manifest_only = sorted(set(manifest_protocols) - set(fm_protocols))
            parts = [f"{tmpl_name}: protocol mismatch"]
            if fm_only:
                parts.append(f"  in frontmatter but not manifest: {', '.join(fm_only)}")
            if manifest_only:
                parts.append(f"  in manifest but not frontmatter: {', '.join(manifest_only)}")
            errors.append("\n".join(parts))

    # Check for templates in manifest that don't have a corresponding file
    for manifest_name in sorted(manifest_templates):
        if manifest_name not in frontmatter_names:
            expected_file = templates_dir / f"{manifest_name}.md"
            if not expected_file.exists():
                errors.append(
                    f"{manifest_name}: listed in manifest.yaml but "
                    f"no file found at templates/{manifest_name}.md"
                )

    return errors


def main() -> int:
    # Allow passing repo root as an argument; default to script's grandparent
    if len(sys.argv) > 1:
        repo_root = Path(sys.argv[1])
    else:
        repo_root = Path(__file__).resolve().parent.parent

    errors = validate(repo_root)

    if errors:
        print(f"FAIL: manifest.yaml validation failed ({len(errors)} error(s)):\n")
        for err in errors:
            print(f"  - {err}")
        print(
            "\nManifest protocol lists must match template YAML frontmatter.\n"
            "See CONTRIBUTING.md for the convention."
        )
        return 1

    print("OK: manifest.yaml protocols match all template frontmatter.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
