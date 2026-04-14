#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
# Copyright (c) PromptKit Contributors

"""Validate prompt graph integrity across all PromptKit components.

This script ensures that all prompt components reference each other
correctly, that no components are orphaned, and that required
companion components are present.

Checks performed:
  1. Broken paths      — manifest ``path`` fields point to actual files
  2. Broken references — template persona/protocol/format/taxonomy refs
                         resolve to entries in the manifest
  3. Orphaned files    — component files on disk not listed in the manifest
  4. Missing companions — templates lacking required persona and/or protocols
  5. Pipeline integrity — pipeline stage templates exist in the manifest
  6. Frontmatter refs  — template file frontmatter references resolve to
                         manifest entries (cross-checks the actual files)

Exit code 0 = all checks pass.
Exit code 1 = one or more issues detected.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Lightweight YAML helpers (avoids external dependencies)
# ---------------------------------------------------------------------------


def _parse_inline_list(text: str) -> list[str]:
    """Parse an inline YAML list: ``[a, b, c]`` → ``['a', 'b', 'c']``."""
    match = re.search(r"\[(.+?)]", text)
    if match:
        return [item.strip().strip("'\"") for item in match.group(1).split(",")]
    return []


def _protocol_short_name(full_path: str) -> str:
    """Extract the short protocol name from a category/name path.

    E.g. ``'guardrails/anti-hallucination'`` → ``'anti-hallucination'``
    """
    return full_path.rsplit("/", 1)[-1]


def _parse_template_frontmatter(text: str) -> dict[str, object] | None:
    """Extract key fields from a template file's YAML frontmatter.

    Returns a dict with ``persona``, ``protocols``, ``format``, and
    ``taxonomies``, or *None* if no frontmatter block is found.
    """
    match = re.search(r"^---\s*\n(.*?)\n---", text, re.DOTALL | re.MULTILINE)
    if not match:
        return None
    block = match.group(1)

    result: dict[str, object] = {
        "persona": "",
        "protocols": [],
        "format": "",
        "taxonomies": [],
    }
    current_list_field: str | None = None

    for line in block.splitlines():
        stripped = line.strip()
        indent = len(line) - len(line.lstrip())

        # Only match top-level fields (no indentation) to avoid
        # picking up identically-named keys inside nested blocks
        # like params, input_contract, or output_contract.
        if indent > 0:
            # Still collect multi-line list items at indent 2
            if current_list_field and stripped.startswith("- "):
                val = stripped[2:].strip().strip("'\"")
                # Strip inline YAML comments only when `#` follows whitespace
                val = re.split(r"\s+#", val, maxsplit=1)[0].strip().strip("'\"")
                result[current_list_field].append(val)
            elif stripped and current_list_field and not stripped.startswith("#"):
                current_list_field = None
            continue

        # Scalar fields
        for field in ("persona", "format"):
            if stripped.startswith(f"{field}:"):
                val = stripped.split(":", 1)[1].strip().strip("'\"")
                if val == "null":
                    val = ""
                result[field] = val
                current_list_field = None
                break
        else:
            # List fields (inline or multi-line)
            for list_field in ("protocols", "taxonomies"):
                if stripped.startswith(f"{list_field}:"):
                    inline = re.search(r"\[(.+)]", stripped)
                    if inline:
                        result[list_field] = [
                            item.strip().strip("'\"")
                            for item in inline.group(1).split(",")
                        ]
                        current_list_field = None
                    else:
                        current_list_field = list_field
                    break
            else:
                # Any other top-level key ends a multi-line list
                if current_list_field:
                    current_list_field = None

    return result


def _split_sections(text: str) -> dict[str, str]:
    """Split manifest text into top-level sections by unindented keys.

    Returns ``{section_name: text_of_all_lines_under_that_key}``.
    """
    sections: dict[str, str] = {}
    current_key: str | None = None
    current_lines: list[str] = []

    for line in text.splitlines():
        if line and not line[0].isspace() and ":" in line and not line.startswith("#"):
            if current_key is not None:
                sections[current_key] = "\n".join(current_lines)
            current_key = line.split(":")[0].strip()
            current_lines = []
        else:
            current_lines.append(line)

    if current_key is not None:
        sections[current_key] = "\n".join(current_lines)

    return sections


def _parse_entries(
    text: str,
    extra_fields: tuple[str, ...] = (),
) -> list[dict[str, object]]:
    """Parse ``- name:`` entries and extract ``path`` plus *extra_fields*.

    Works regardless of YAML nesting depth — it finds each ``- name:``
    line and scans forward for sibling fields (exactly two spaces deeper)
    until the indent drops back.
    """
    entries: list[dict[str, object]] = []
    lines = text.splitlines()
    i = 0

    while i < len(lines):
        stripped = lines[i].strip()

        if stripped.startswith("- name:"):
            entry_indent = len(lines[i]) - len(lines[i].lstrip())
            entry: dict[str, object] = {
                "name": stripped.split(":", 1)[1].strip().strip("'\""),
                "path": "",
            }
            # Initialise extra fields with appropriate default types
            for f in extra_fields:
                if f not in entry:
                    entry[f] = [] if f in ("protocols", "taxonomies") else ""

            j = i + 1
            while j < len(lines):
                fline = lines[j]
                fstripped = fline.strip()

                if not fstripped or fstripped.startswith("#"):
                    j += 1
                    continue

                findent = len(fline) - len(fline.lstrip())
                if findent <= entry_indent:
                    break  # next entry or section boundary

                # Only match fields at the expected sibling indent
                if findent == entry_indent + 2:
                    for field in ("path", *extra_fields):
                        if fstripped.startswith(f"{field}:"):
                            val = fstripped.split(":", 1)[1].strip()
                            if val.startswith("["):
                                entry[field] = _parse_inline_list(fstripped)
                            elif val in (">", "|", ""):
                                pass  # block scalar / empty — keep default
                            else:
                                entry[field] = val.strip("'\"")
                            break

                j += 1

            entries.append(entry)
            i = j
        else:
            i += 1

    return entries


def _parse_pipelines(text: str) -> dict[str, list[str]]:
    """Parse the ``pipelines`` section.

    Returns ``{pipeline_name: [template_name, ...]}``.
    """
    pipelines: dict[str, list[str]] = {}
    current: str | None = None

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue

        indent = len(line) - len(line.lstrip())

        # Pipeline name at indent 2
        if indent == 2 and stripped.endswith(":") and not stripped.startswith("-"):
            current = stripped[:-1]
            pipelines[current] = []
            continue

        if current and stripped.startswith("- template:"):
            tmpl = stripped.split(":", 1)[1].strip().strip("'\"")
            pipelines[current].append(tmpl)

    return pipelines


# ---------------------------------------------------------------------------
# File discovery
# ---------------------------------------------------------------------------


def _find_component_files(repo_root: Path) -> set[str]:
    """Find all ``.md`` files in component directories.

    Returns a set of repo-relative POSIX paths (e.g.
    ``protocols/guardrails/anti-hallucination.md``).
    """
    files: set[str] = set()

    for directory in ("personas", "formats", "taxonomies", "templates"):
        dir_path = repo_root / directory
        if dir_path.is_dir():
            for f in dir_path.glob("*.md"):
                files.add(f"{directory}/{f.name}")

    # Protocols are nested by category
    protocols_dir = repo_root / "protocols"
    if protocols_dir.is_dir():
        for f in protocols_dir.rglob("*.md"):
            files.add(f.relative_to(repo_root).as_posix())

    return files


# ---------------------------------------------------------------------------
# Validation checks
# ---------------------------------------------------------------------------


def validate(repo_root: Path) -> list[str]:
    """Run all graph integrity checks.

    Returns a list of tagged error strings (empty = all checks pass).
    """
    manifest_path = repo_root / "manifest.yaml"
    errors: list[str] = []

    if not manifest_path.exists():
        return ["[broken-path] manifest.yaml not found"]

    text = manifest_path.read_text(encoding="utf-8")
    sections = _split_sections(text)

    # Parse each component section
    personas = _parse_entries(sections.get("personas", ""))
    protocols = _parse_entries(sections.get("protocols", ""))
    formats = _parse_entries(sections.get("formats", ""))
    taxonomies = _parse_entries(sections.get("taxonomies", ""))
    templates = _parse_entries(
        sections.get("templates", ""),
        extra_fields=("persona", "protocols", "format", "taxonomies"),
    )
    pipelines = _parse_pipelines(sections.get("pipelines", ""))

    # Build lookup sets
    persona_names = {p["name"] for p in personas}
    protocol_names = {p["name"] for p in protocols}
    format_names = {f["name"] for f in formats}
    taxonomy_names = {t["name"] for t in taxonomies}
    template_names = {t["name"] for t in templates}

    all_components = personas + protocols + formats + taxonomies + templates
    manifest_paths = {str(c["path"]) for c in all_components if c.get("path")}

    # ------------------------------------------------------------------
    # Check 1: Broken paths — manifest path → file on disk
    # ------------------------------------------------------------------
    for component in all_components:
        path = component.get("path", "")
        if path and not (repo_root / str(path)).is_file():
            errors.append(
                f"[broken-path] {component['name']}: "
                f"path '{path}' does not exist"
            )

    # ------------------------------------------------------------------
    # Check 2: Broken references — template refs → manifest entries
    # ------------------------------------------------------------------
    for tmpl in templates:
        name = tmpl["name"]

        persona = tmpl.get("persona", "")
        if persona and persona != "configurable" and persona not in persona_names:
            errors.append(
                f"[broken-ref] template '{name}': "
                f"persona '{persona}' not found in manifest"
            )

        protos = tmpl.get("protocols", [])
        if isinstance(protos, list):
            for proto in protos:
                if proto not in protocol_names:
                    errors.append(
                        f"[broken-ref] template '{name}': "
                        f"protocol '{proto}' not found in manifest"
                    )

        fmt = tmpl.get("format", "")
        if fmt and fmt not in format_names:
            errors.append(
                f"[broken-ref] template '{name}': "
                f"format '{fmt}' not found in manifest"
            )

        taxes = tmpl.get("taxonomies", [])
        if isinstance(taxes, list):
            for tax in taxes:
                if tax not in taxonomy_names:
                    errors.append(
                        f"[broken-ref] template '{name}': "
                        f"taxonomy '{tax}' not found in manifest"
                    )

    # ------------------------------------------------------------------
    # Check 3: Orphaned components — files not in manifest
    # ------------------------------------------------------------------
    actual_files = _find_component_files(repo_root)
    for orphan in sorted(actual_files - manifest_paths):
        errors.append(f"[orphan] {orphan}: exists on disk but not in manifest")

    # ------------------------------------------------------------------
    # Check 4: Missing companion components
    #
    # Persona and protocols are always required.  Format may be null
    # for templates that define their output structure inline (e.g.
    # generate-commit-message), so its absence is not an error.
    # ------------------------------------------------------------------
    for tmpl in templates:
        name = tmpl["name"]
        if not tmpl.get("persona"):
            errors.append(f"[missing-companion] template '{name}': no persona")
        if not tmpl.get("protocols"):
            errors.append(f"[missing-companion] template '{name}': no protocols")

    # ------------------------------------------------------------------
    # Check 5: Pipeline integrity — stage templates exist
    # ------------------------------------------------------------------
    for pipeline_name, stage_templates in pipelines.items():
        for tmpl in stage_templates:
            if tmpl not in template_names:
                errors.append(
                    f"[broken-pipeline] pipeline '{pipeline_name}': "
                    f"stage template '{tmpl}' not found in manifest"
                )

    # ------------------------------------------------------------------
    # Check 6: Template frontmatter references → manifest entries
    #
    # Parse each template file's YAML frontmatter and validate that
    # persona, protocol, format, and taxonomy references resolve to
    # entries in the manifest.  Protocol paths are normalized to short
    # names (e.g. 'guardrails/anti-hallucination' → 'anti-hallucination').
    # ------------------------------------------------------------------
    templates_dir = repo_root / "templates"
    if templates_dir.is_dir():
        for tmpl_file in sorted(templates_dir.glob("*.md")):
            tmpl_text = tmpl_file.read_text(encoding="utf-8")
            fm = _parse_template_frontmatter(tmpl_text)
            if fm is None:
                continue

            fname = tmpl_file.stem

            persona = fm.get("persona", "")
            # Allow configurable/template-variable personas
            if (
                persona
                and persona != "configurable"
                and "{{" not in str(persona)
                and persona not in persona_names
            ):
                errors.append(
                    f"[broken-ref-frontmatter] {fname}: "
                    f"persona '{persona}' not in manifest"
                )

            for proto in fm.get("protocols", []):
                short = _protocol_short_name(str(proto))
                if short not in protocol_names:
                    errors.append(
                        f"[broken-ref-frontmatter] {fname}: "
                        f"protocol '{proto}' not in manifest"
                    )

            fmt = fm.get("format", "")
            if fmt and "{{" not in str(fmt) and fmt not in format_names:
                errors.append(
                    f"[broken-ref-frontmatter] {fname}: "
                    f"format '{fmt}' not in manifest"
                )

            for tax in fm.get("taxonomies", []):
                if tax not in taxonomy_names:
                    errors.append(
                        f"[broken-ref-frontmatter] {fname}: "
                        f"taxonomy '{tax}' not in manifest"
                    )

    return errors


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def main() -> int:
    """Run checks and print a structured report."""
    if len(sys.argv) > 1:
        repo_root = Path(sys.argv[1])
    else:
        repo_root = Path(__file__).resolve().parent.parent

    errors = validate(repo_root)

    if errors:
        # Group errors by check type for readability
        by_type: dict[str, list[str]] = {}
        for err in errors:
            m = re.match(r"\[([^\]]+)]", err)
            tag = m.group(1) if m else "other"
            by_type.setdefault(tag, []).append(err)

        print(f"FAIL: graph integrity check found {len(errors)} issue(s):\n")
        for tag, errs in by_type.items():
            print(f"  [{tag}] ({len(errs)}):")
            for err in errs:
                msg = re.sub(r"^\[[^\]]+]\s*", "", err)
                print(f"    - {msg}")
            print()
        return 1

    print("OK: all graph integrity checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
