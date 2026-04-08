#!/usr/bin/env python3
# SPDX-License-Identifier: MIT
# Copyright (c) PromptKit Contributors
"""
CWE Taxonomy Ingestion Pipeline for PromptKit.

Parses the MITRE CWE XML corpus and generates per-domain security audit
taxonomy files for use with PromptKit templates.

Usage:
    python scripts/ingest-cwe.py <path-to-cwe-xml>

Outputs:
    data/cwe/<version>/meta.json
    data/cwe/<version>/cwe-normalized.json
    data/cwe/<version>/domain-mappings.json
    data/cwe/<version>/unmapped.json
    taxonomies/cwe-<domain>.md  (x13)
"""

import argparse
import hashlib
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

CWE_NS = "http://cwe.mitre.org/cwe-7"
NS = f"{{{CWE_NS}}}"

REPO_ROOT = Path(__file__).resolve().parent.parent

ABSTRACTION_ORDER = ["Pillar", "Class", "Base", "Variant", "Compound"]

# ---------------------------------------------------------------------------
# Domain Registry — 13 audit domains
# ---------------------------------------------------------------------------

DOMAIN_REGISTRY = OrderedDict([
    ("kernel-mode-c-cpp", {
        "display_name": "Kernel-Mode C/C++",
        "description": "OS kernel and driver code in C/C++",
    }),
    ("native-user-mode-c-cpp", {
        "display_name": "Native User-Mode C/C++",
        "description": "User-mode native applications in C/C++",
    }),
    ("managed-dotnet", {
        "display_name": "Managed .NET",
        "description": ".NET managed code (C#, F#, VB.NET)",
    }),
    ("web-js-ts", {
        "display_name": "Web Frontend JavaScript/TypeScript",
        "description": "Web frontend JavaScript/TypeScript",
    }),
    ("web-backend", {
        "display_name": "Web Backend",
        "description": "Server-side web applications (any language)",
    }),
    ("cloud-service", {
        "display_name": "Cloud Service",
        "description": "Cloud-hosted services and APIs",
    }),
    ("iac", {
        "display_name": "Infrastructure as Code",
        "description": "Infrastructure as Code (Terraform, Bicep, ARM, etc.)",
    }),
    ("firmware-embedded", {
        "display_name": "Firmware and Embedded Systems",
        "description": "Firmware and embedded systems",
    }),
    ("crypto-protocols", {
        "display_name": "Cryptographic Protocols",
        "description": "Cryptographic protocol design and implementation",
    }),
    ("data-processing", {
        "display_name": "Data Processing",
        "description": "Data pipelines, ETL, batch processing",
    }),
    ("cli-tools", {
        "display_name": "CLI Tools",
        "description": "Command-line tools and utilities",
    }),
    ("mobile-app", {
        "display_name": "Mobile Applications",
        "description": "Mobile applications (iOS, Android)",
    }),
    ("container-k8s", {
        "display_name": "Container and Kubernetes",
        "description": "Container and Kubernetes workloads",
    }),
])

# ---------------------------------------------------------------------------
# Platform-to-Domain Mappings (Priority 2)
# ---------------------------------------------------------------------------

LANGUAGE_DOMAIN_MAP = {
    "C": ["kernel-mode-c-cpp", "native-user-mode-c-cpp", "firmware-embedded"],
    "C++": ["kernel-mode-c-cpp", "native-user-mode-c-cpp"],
    "C#": ["managed-dotnet"],
    "Java": ["managed-dotnet", "web-backend"],
    "JavaScript": ["web-js-ts"],
    "TypeScript": ["web-js-ts"],
    "PHP": ["web-backend"],
    "Python": ["web-backend", "data-processing", "cli-tools"],
    "Ruby": ["web-backend"],
    "Perl": ["web-backend", "cli-tools"],
    "Go": ["web-backend", "cloud-service", "cli-tools"],
    "Rust": ["native-user-mode-c-cpp", "cli-tools"],
    "SQL": ["web-backend", "data-processing"],
    "Assembly": ["firmware-embedded", "kernel-mode-c-cpp"],
    "Kotlin": ["mobile-app", "web-backend"],
    "Swift": ["mobile-app"],
    "Objective-C": ["mobile-app"],
    "Scala": ["web-backend", "data-processing"],
    "JSP": ["web-backend"],
    "ASP.NET": ["web-backend", "managed-dotnet"],
    "Verilog": ["firmware-embedded"],
    "VHDL": ["firmware-embedded"],
}

LANGUAGE_CLASS_DOMAIN_MAP = {
    "Memory-Unsafe": [
        "kernel-mode-c-cpp", "native-user-mode-c-cpp", "firmware-embedded",
    ],
    "Interpreted": ["web-backend", "web-js-ts"],
}

TECHNOLOGY_DOMAIN_MAP = {
    "Web Server": ["web-backend"],
    "Web Based": ["web-backend", "web-js-ts"],
    "Database Server": ["web-backend", "data-processing"],
    "Mobile": ["mobile-app"],
    "Cloud Computing": ["cloud-service"],
    "AI/ML": ["data-processing"],
    "ICS/OT": ["firmware-embedded"],
    "Microcontroller Hardware": ["firmware-embedded"],
    "Processor Hardware": ["firmware-embedded"],
    "Memory Hardware": ["firmware-embedded"],
    "Bus/Interface Hardware": ["firmware-embedded"],
    "Security Hardware": ["firmware-embedded"],
    "Power Management Hardware": ["firmware-embedded"],
    "Test/Debug Hardware": ["firmware-embedded"],
    "Sensor Hardware": ["firmware-embedded"],
}

# ---------------------------------------------------------------------------
# Context Keywords (Priority 3) — regex patterns, case-insensitive
# ---------------------------------------------------------------------------

CONTEXT_KEYWORDS = {
    "web-js-ts": [
        r"\bcookie\b", r"\bDOM\b", r"\bXSS\b", r"\bcross-site\s+scripting\b",
        r"\bbrowser\b", r"\bclient.side\b", r"\bJavaScript\b",
        r"\bprototype\s+pollution\b", r"\bweb\s+page\b",
    ],
    "web-backend": [
        r"\bSQL\s+injection\b", r"\bSQL\b.*\binjection\b", r"\bSSRF\b",
        r"\bserver.side\b", r"\bHTTP\s+response\b", r"\bheader\s+injection\b",
        r"\btemplate\s+injection\b", r"\bLDAP\s+injection\b",
        r"\bpath\s+traversal\b", r"\bdirectory\s+traversal\b",
        r"\bsession\s+fixation\b", r"\bopen\s+redirect\b",
        r"\bHTTP\s+request\s+smuggling\b", r"\bweb\s+(?:server|application)\b",
    ],
    "kernel-mode-c-cpp": [
        r"\bIRQL\b", r"\bDPC\b", r"\bdispatch\s+level\b", r"\bring.0\b",
        r"\bkernel\s+pool\b", r"\bPFN\b", r"\bPTE\b", r"\bkernel\s+mode\b",
        r"\bkernel\s+driver\b", r"\bsystem\s+call\b",
    ],
    "native-user-mode-c-cpp": [
        r"\bbuffer\s+overflow\b", r"\bheap\s+overflow\b",
        r"\bstack.based\s+(?:buffer\s+)?overflow\b",
        r"\bpointer\b", r"\bmalloc\b", r"\bfree\(\)",
        r"\bout.of.bounds\b", r"\buse.after.free\b", r"\bdouble.free\b",
        r"\bnull\s+pointer\b", r"\bformat\s+string\b",
        r"\binteger\s+overflow\b",
    ],
    "firmware-embedded": [
        r"\bfirmware\b", r"\bembedded\b", r"\bboot\b.*\bsecur\b",
        r"\bJTAG\b", r"\bdebug\s+port\b", r"\bphysical\s+access\b",
        r"\bside.channel\b", r"\btiming\s+attack\b",
        r"\bhardware\b",
    ],
    "crypto-protocols": [
        r"\bcryptograph", r"\bencrypt", r"\bdecrypt",
        r"\bcipher\b", r"\brandom\b.*\bnumber\b",
        r"\bkey\s+(?:size|length|management|exchange|generation)\b",
        r"\bcertificate\b.*\bvalid", r"\bTLS\b", r"\bSSL\b",
        r"\bPRNG\b", r"\bentropy\b", r"\bnonce\b",
        r"\bcleartext\b", r"\bplaintext\b.*\btransmission\b",
    ],
    "cloud-service": [
        r"\bcloud\b", r"\bAPI\s+key\b",
        r"\bsecret\b.*\b(?:management|storage|exposure)\b",
        r"\bIAM\b", r"\bservice\s+account\b", r"\bOAuth\b",
    ],
    "iac": [
        r"\bhardcoded\b.*\b(?:credential|password|secret|key)\b",
        r"\bdefault\b.*\b(?:credential|password)\b",
        r"\bpermission\b.*\b(?:overly|excessive|world)\b",
    ],
    "data-processing": [
        r"\bdeserializ", r"\bXML\s+external\s+entity\b", r"\bXXE\b",
        r"\bdata\s+(?:pipeline|transform|processing)\b",
        r"\bETL\b", r"\bbatch\s+processing\b",
        r"\bCSV\s+injection\b", r"\bformula\s+injection\b",
    ],
    "cli-tools": [
        r"\bcommand\s+injection\b", r"\bargument\s+injection\b",
        r"\bcommand.line\b",
        r"\bshell\b.*\b(?:injection|escape|command)\b",
        r"\bsymlink\b", r"\bsymbolic\s+link\b",
        r"\btemp\w*\s+file\b",
    ],
    "mobile-app": [
        r"\bmobile\b.*\b(?:app|device|platform)\b",
        r"\bAndroid\b", r"\biOS\b",
        r"\bkeychain\b", r"\bsandbox\b.*\b(?:escape|bypass)\b",
        r"\bintent\b.*\b(?:inject|redirect|hijack)\b",
        r"\bdeep\s+link\b",
    ],
    "container-k8s": [
        r"\bcontainer\b.*\b(?:escape|breakout|isolation)\b",
        r"\bcgroup\b", r"\bseccomp\b",
        r"\bDocker\b", r"\bKubernetes\b",
        r"\borchestrat",
        r"\bimage\b.*\b(?:supply|chain|pull|registry)\b",
    ],
    "managed-dotnet": [
        r"\.NET\b", r"\bC#\b", r"\bCLR\b",
        r"\bgarbage\s+collect", r"\bmanaged\s+code\b",
        r"\breflection\b.*\b(?:inject|attack)\b",
        r"\bassembly\s+loading\b",
    ],
}

# Auth/authz keywords — map to primary and secondary domains
AUTH_KEYWORDS = [
    r"\bauthenticat", r"\bauthoriz", r"\bcredential\b",
    r"\bpassword\b", r"\bprivilege\b.*\b(?:escalat|elevat)\b",
    r"\baccess\s+control\b",
]
AUTH_PRIMARY_DOMAINS = ["web-backend", "cloud-service"]

# File system keywords
FILESYSTEM_KEYWORDS = [
    r"\bfile\b.*\b(?:access|permission|upload|include|travers)",
    r"\bpath\b.*\btraversal\b", r"\bdirectory\b.*\btraversal\b",
]
FILESYSTEM_DOMAINS = [
    "native-user-mode-c-cpp", "cli-tools", "data-processing", "web-backend",
]

# Configuration keywords
CONFIG_KEYWORDS = [
    r"\bconfigur\b.*\b(?:default|insecure|weak|missing)\b",
    r"\bdefault\b.*\b(?:config|setting|permission)\b",
    r"\benvironment\s+variable\b",
]
CONFIG_DOMAINS = ["iac", "cloud-service", "container-k8s"]

# Override patterns (Priority 4)
KERNEL_ONLY_PATTERNS = [
    r"\bIRQL\b", r"\bDPC\b", r"\bdispatch\s+level\b", r"\bring.0\b",
    r"\bkernel\s+pool\b", r"\bPFN\b", r"\bPTE\b",
]

CONTAINER_SPECIFIC_PATTERNS = [
    r"\bcontainer\b.*\bescape\b",
    r"\bnamespace\b.*\b(?:bypass|isolation)\b",
    r"\bcgroup\b", r"\bseccomp\b",
]

SUPPLY_CHAIN_PATTERNS = [
    r"\bdependency\s+confusion\b", r"\bpackage\s+injection\b",
    r"\bsupply\s+chain\b",
]

# Domain exclusion tests for sanity checks
DOMAIN_EXCLUSION_TESTS = [
    ("kernel-mode-c-cpp", {79, 89, 352}, "Web-only CWEs (XSS, SQLi, CSRF)"),
    ("iac", {119, 416}, "Memory management CWEs"),
    ("managed-dotnet", {120, 122, 415, 416, 762},
     "C-exclusive memory management CWEs"),
]


# ---------------------------------------------------------------------------
# XML Parsing
# ---------------------------------------------------------------------------

def get_text(elem, tag):
    """Get text content of a child element, handling embedded HTML."""
    child = elem.find(NS + tag)
    if child is None:
        return None
    text = "".join(child.itertext()).strip()
    text = re.sub(r"\s+", " ", text)
    return text if text else None


def parse_applicable_platforms(elem):
    """Parse Applicable_Platforms into a structured dict."""
    ap = elem.find(NS + "Applicable_Platforms")
    result = {
        "languages": [],
        "language_classes": [],
        "operating_systems": [],
        "os_classes": [],
        "architectures": [],
        "technologies": [],
    }
    if ap is None:
        return result
    for child in ap:
        tag = child.tag.replace(NS, "")
        name = child.get("Name")
        cls = child.get("Class")
        prevalence = child.get("Prevalence", "Undetermined")
        if tag == "Language":
            if name:
                result["languages"].append(
                    {"name": name, "prevalence": prevalence}
                )
            if cls:
                result["language_classes"].append(
                    {"class": cls, "prevalence": prevalence}
                )
        elif tag == "Operating_System":
            if name:
                result["operating_systems"].append(
                    {"name": name, "prevalence": prevalence}
                )
            if cls:
                result["os_classes"].append(
                    {"class": cls, "prevalence": prevalence}
                )
        elif tag == "Architecture":
            result["architectures"].append(
                {"name": name or cls or "Unknown", "prevalence": prevalence}
            )
        elif tag == "Technology":
            if name:
                result["technologies"].append(
                    {"name": name, "prevalence": prevalence}
                )
            if cls:
                result["technologies"].append(
                    {"name": cls, "prevalence": prevalence}
                )
    return result


def parse_consequences(elem):
    """Parse Common_Consequences into a list of {scope, impact}."""
    cc = elem.find(NS + "Common_Consequences")
    if cc is None:
        return []
    results = []
    for cons in cc.findall(NS + "Consequence"):
        scopes = [s.text for s in cons.findall(NS + "Scope") if s.text]
        impacts = [i.text for i in cons.findall(NS + "Impact") if i.text]
        for scope in scopes:
            for impact in impacts:
                results.append({"scope": scope, "impact": impact})
    return results


def parse_detection_methods(elem):
    """Parse Detection_Methods into a list of {method, effectiveness}."""
    dm = elem.find(NS + "Detection_Methods")
    if dm is None:
        return []
    results = []
    for d in dm.findall(NS + "Detection_Method"):
        method_el = d.find(NS + "Method")
        eff_el = d.find(NS + "Effectiveness")
        method = (
            method_el.text
            if method_el is not None and method_el.text
            else None
        )
        eff = (
            eff_el.text if eff_el is not None and eff_el.text else None
        )
        if method:
            results.append({"method": method, "effectiveness": eff})
    return results


def parse_relationships(elem):
    """Parse Related_Weaknesses into a list of {nature, cwe_id}."""
    rw = elem.find(NS + "Related_Weaknesses")
    if rw is None:
        return []
    results = []
    for r in rw.findall(NS + "Related_Weakness"):
        nature = r.get("Nature")
        cwe_id = r.get("CWE_ID")
        if nature and cwe_id:
            results.append({"nature": nature, "cwe_id": int(cwe_id)})
    return results


def extract_weaknesses(root):
    """Extract all Weakness elements into structured records."""
    weaknesses = {}
    ws = root.find(NS + "Weaknesses")
    if ws is None:
        return weaknesses
    for w in ws:
        wid = int(w.get("ID"))
        weaknesses[wid] = {
            "cwe_id": wid,
            "name": w.get("Name"),
            "abstraction": w.get("Abstraction"),
            "status": w.get("Status"),
            "description": get_text(w, "Description"),
            "extended_description": get_text(w, "Extended_Description"),
            "applicable_platforms": parse_applicable_platforms(w),
            "common_consequences": parse_consequences(w),
            "detection_methods": parse_detection_methods(w),
            "relationships": parse_relationships(w),
        }
    return weaknesses


def resolve_view_members(root, view_id):
    """Resolve all CWE weakness IDs that belong to a view.

    Filter-based views (658, 659, 660, 919) return an empty set here;
    their membership is handled during platform matching in Priority 1.
    Direct-member and category-based views (1194, 1435, 1450) are
    resolved by traversing Has_Member relationships.
    """
    views = root.find(NS + "Views")
    if views is None:
        return set()
    view_elem = None
    for v in views:
        if v.get("ID") == str(view_id):
            view_elem = v
            break
    if view_elem is None:
        return set()

    # Filter-based views are handled via platform matching
    filter_elem = view_elem.find(NS + "Filter")
    if filter_elem is not None and filter_elem.text:
        return set()

    members = view_elem.find(NS + "Members")
    if members is None:
        return set()

    weaknesses_container = root.find(NS + "Weaknesses")
    if weaknesses_container is None:
        return set()
    w_ids = {w.get("ID") for w in weaknesses_container}

    cats_container = root.find(NS + "Categories")
    cat_map = (
        {c.get("ID"): c for c in cats_container}
        if cats_container is not None
        else {}
    )

    cwe_ids = set()
    for m in members:
        mid = m.get("CWE_ID")
        if mid in w_ids:
            cwe_ids.add(int(mid))
        elif mid in cat_map:
            rels = cat_map[mid].find(NS + "Relationships")
            if rels is not None:
                for r in rels:
                    cid = r.get("CWE_ID")
                    if cid in w_ids:
                        cwe_ids.add(int(cid))
    return cwe_ids


# ---------------------------------------------------------------------------
# Domain Mapping
# ---------------------------------------------------------------------------

def matches_any(text, patterns):
    """Return True if *text* matches any regex in *patterns* (case-insensitive)."""
    if not text:
        return False
    for p in patterns:
        if re.search(p, text, re.IGNORECASE):
            return True
    return False


def build_xss_family(weaknesses):
    """Return the set of CWE IDs that are CWE-79 or descendants of CWE-79."""
    family = {79}
    changed = True
    while changed:
        changed = False
        for wid, w in weaknesses.items():
            if wid in family:
                continue
            for rel in w["relationships"]:
                if rel["nature"] == "ChildOf" and rel["cwe_id"] in family:
                    family.add(wid)
                    changed = True
                    break
    return family


def map_weaknesses_to_domains(weaknesses, root):
    """Apply the 4-priority domain mapping algorithm.

    Returns (domain_mappings, unmapped) where domain_mappings is a dict
    of domain_key -> list of CWE entry dicts, and unmapped is a list of
    CWE entries that could not be mapped.
    """
    # Pre-compute view memberships for direct-member views
    view_members = {}
    for vid in (1194, 1435, 1450):
        view_members[vid] = resolve_view_members(root, vid)

    xss_family = build_xss_family(weaknesses)

    domain_mappings = {dk: [] for dk in DOMAIN_REGISTRY}
    unmapped = []

    for wid, w in weaknesses.items():
        if w["status"] in ("Deprecated", "Obsolete"):
            continue

        domains = {}  # domain_key -> (source, rationale)
        desc_text = (w["description"] or "") + " " + (w["extended_description"] or "")
        platforms = w["applicable_platforms"]
        lang_names = {lang["name"] for lang in platforms["languages"]}
        tech_names = {t["name"] for t in platforms["technologies"]}

        # ── Priority 1: View membership ──────────────────────────────

        # View 658 (C) — filter-based
        if "C" in lang_names:
            for d in ("kernel-mode-c-cpp", "native-user-mode-c-cpp",
                       "firmware-embedded"):
                domains[d] = ("view",
                              "View 658 (C language in Applicable_Platforms)")

        # View 659 (C++) — filter-based
        if "C++" in lang_names:
            for d in ("kernel-mode-c-cpp", "native-user-mode-c-cpp"):
                domains[d] = ("view",
                              "View 659 (C++ language in Applicable_Platforms)")

        # View 660 (Java) — filter-based, .NET by analogy
        if "Java" in lang_names:
            for d in ("managed-dotnet", "web-backend"):
                domains[d] = ("view",
                              "View 660 (Java; .NET by analogy)")

        # View 919 (Mobile) — filter-based on Technology Class=Mobile
        if "Mobile" in tech_names:
            domains["mobile-app"] = ("view",
                                     "View 919 (Mobile technology)")

        # View 1194 (Hardware Design) — direct category members
        if wid in view_members.get(1194, set()):
            domains["firmware-embedded"] = ("view",
                                            "View 1194 (Hardware Design)")

        # View 1450 (OWASP Top Ten 2025) — category members
        if wid in view_members.get(1450, set()):
            for d in ("web-backend", "web-js-ts"):
                domains[d] = ("view", "View 1450 (OWASP Top Ten 2025)")

        # View 1435 is a cross-domain reference — not auto-assigned

        # ── Priority 2: Applicable_Platforms match ───────────────────

        for lang in platforms["languages"]:
            name, prev = lang["name"], lang["prevalence"]
            if prev in ("Often", "Sometimes") and name in LANGUAGE_DOMAIN_MAP:
                for d in LANGUAGE_DOMAIN_MAP[name]:
                    if d not in domains:
                        domains[d] = ("platform",
                                      f"Language {name} ({prev})")

        for lc in platforms["language_classes"]:
            cls, prev = lc["class"], lc["prevalence"]
            if (prev in ("Often", "Sometimes")
                    and cls in LANGUAGE_CLASS_DOMAIN_MAP):
                for d in LANGUAGE_CLASS_DOMAIN_MAP[cls]:
                    if d not in domains:
                        domains[d] = ("platform",
                                      f"Language class {cls} ({prev})")

        for tech in platforms["technologies"]:
            name, prev = tech["name"], tech["prevalence"]
            if prev in ("Often", "Sometimes") and name in TECHNOLOGY_DOMAIN_MAP:
                for d in TECHNOLOGY_DOMAIN_MAP[name]:
                    if d not in domains:
                        domains[d] = ("platform",
                                      f"Technology {name} ({prev})")

        # ── Priority 3: Context / keyword analysis ───────────────────

        # Apply context keywords when no domains yet OR the weakness is
        # language-agnostic (Not Language-Specific)
        is_lang_agnostic = (
            not lang_names
            and any(lc["class"] == "Not Language-Specific"
                    for lc in platforms["language_classes"])
        )

        if not domains or is_lang_agnostic:
            for domain_key, patterns in CONTEXT_KEYWORDS.items():
                if domain_key not in domains and matches_any(desc_text, patterns):
                    domains[domain_key] = ("context",
                                           f"Description matches {domain_key} keywords")

            # Auth/authz — weight toward primary domains
            if matches_any(desc_text, AUTH_KEYWORDS):
                for d in AUTH_PRIMARY_DOMAINS:
                    if d not in domains:
                        domains[d] = ("context",
                                      "Auth/authz weakness (primary)")

            # File system operations
            if matches_any(desc_text, FILESYSTEM_KEYWORDS):
                for d in FILESYSTEM_DOMAINS:
                    if d not in domains:
                        domains[d] = ("context", "File system weakness")

            # Configuration
            if matches_any(desc_text, CONFIG_KEYWORDS):
                for d in CONFIG_DOMAINS:
                    if d not in domains:
                        domains[d] = ("context", "Configuration weakness")

        # ── Priority 4: Override rules ───────────────────────────────

        # Kernel-only terms → add kernel, remove native-user-mode
        if matches_any(desc_text, KERNEL_ONLY_PATTERNS):
            if "kernel-mode-c-cpp" not in domains:
                domains["kernel-mode-c-cpp"] = (
                    "override", "Kernel-specific terms in description")
            domains.pop("native-user-mode-c-cpp", None)

        # XSS family → restrict to web-js-ts and web-backend only
        if wid in xss_family:
            xss_domains = {}
            for d in ("web-js-ts", "web-backend"):
                xss_domains[d] = domains.get(
                    d, ("override", "XSS family — web domains only"))
            domains = xss_domains

        # Container-specific terms
        if matches_any(desc_text, CONTAINER_SPECIFIC_PATTERNS):
            if "container-k8s" not in domains:
                domains["container-k8s"] = (
                    "override", "Container-specific terms in description")

        # Supply chain adjacency
        if matches_any(desc_text, SUPPLY_CHAIN_PATTERNS):
            for d in ("container-k8s", "cli-tools"):
                if d not in domains:
                    domains[d] = ("override", "Supply chain adjacency")

        # ── Record mappings ──────────────────────────────────────────

        if domains:
            for dk, (source, rationale) in domains.items():
                domain_mappings[dk].append({
                    "cwe_id": wid,
                    "name": w["name"],
                    "abstraction": w["abstraction"],
                    "mapping_source": source,
                    "mapping_rationale": rationale,
                })
        else:
            unmapped.append({
                "cwe_id": wid,
                "name": w["name"],
                "abstraction": w["abstraction"],
                "reason": "No view, platform, context, or override match",
            })

    # Sort each domain's entries by CWE ID
    for dk in domain_mappings:
        domain_mappings[dk].sort(key=lambda x: x["cwe_id"])

    return domain_mappings, unmapped


# ---------------------------------------------------------------------------
# Taxonomy File Generation
# ---------------------------------------------------------------------------

def condense_description(desc, max_sentences=3):
    """Return the first *max_sentences* sentences of *desc*."""
    if not desc:
        return "No description available."
    sentences = re.split(r"(?<=[.!?])\s+", desc.strip())
    condensed = " ".join(sentences[:max_sentences])
    if not condensed.endswith((".", "!", "?")):
        condensed += "."
    return condensed


def format_detection_hints(detection_methods):
    """Format detection methods into a concise string."""
    if not detection_methods:
        return "No specific detection method documented in CWE."
    seen = set()
    hints = []
    for dm in detection_methods:
        hint = dm["method"]
        if dm.get("effectiveness"):
            hint += f" ({dm['effectiveness']})"
        if hint not in seen:
            seen.add(hint)
            hints.append(hint)
    return "; ".join(hints[:5])


def generate_taxonomy_file(domain_key, cwes, weaknesses, version):
    """Generate taxonomy Markdown content for one domain."""
    info = DOMAIN_REGISTRY[domain_key]
    n = len(cwes)

    lines = [
        "<!-- SPDX-License-Identifier: MIT -->",
        "<!-- Copyright (c) PromptKit Contributors -->",
        "",
        "---",
        f"name: cwe-{domain_key}",
        "type: taxonomy",
        f"domain: {domain_key}",
        "description: >",
        f"  CWE-derived classification scheme for {info['description']}.",
        f"  {n} weakness classes from CWE version {version}. Use to scope",
        "  security audits to domain-relevant vulnerability classes only.",
        f'cwe_version: "{version}"',
        "applicable_to:",
        "  - investigate-security",
        "  - review-code",
        "  - review-cpp-code",
        "  - exhaustive-bug-hunt",
        "---",
        "",
        f"# Taxonomy: CWE {info['display_name']}",
        "",
        f"This taxonomy contains {n} CWE weakness classes applicable to",
        f"{info['description']}. Derived from CWE version {version}.",
        "",
        f"When performing a security audit scoped to the `{domain_key}` domain,",
        "**only** consider CWE IDs listed in this taxonomy. If you find something",
        "plausible outside this subset, record it as `out-of-scope candidate`",
        "with the CWE ID \u2014 do not expand scope.",
        "",
        "## Classes",
    ]

    # Group by abstraction level, sort within each level by CWE ID
    groups = {a: [] for a in ABSTRACTION_ORDER}
    for entry in cwes:
        wid = entry["cwe_id"]
        w = weaknesses.get(wid)
        if w is None:
            continue
        abst = w["abstraction"]
        bucket = groups.get(abst)
        if bucket is not None:
            bucket.append((wid, w))

    for abst in ABSTRACTION_ORDER:
        entries = sorted(groups[abst], key=lambda x: x[0])
        for wid, w in entries:
            lines += [
                "",
                f"### CWE-{wid}: {w['name']}",
                "",
                condense_description(w["description"]),
                "",
                f"**Abstraction**: {w['abstraction']}",
                "",
                f"**Detection Hints**: {format_detection_hints(w['detection_methods'])}",
            ]

    # Summary table
    total = 0
    rows = []
    for abst in ABSTRACTION_ORDER:
        count = len(groups[abst])
        total += count
        rows.append(f"| {abst:<11} | {count:<5} |")

    lines += [
        "",
        "## Summary",
        "",
        "| Abstraction | Count |",
        "|-------------|-------|",
    ]
    lines += rows
    lines.append(f"| **Total**   | **{total}** |")
    lines.append("")

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# I/O Helpers
# ---------------------------------------------------------------------------

def write_json(data, path):
    """Write JSON to *path*, creating parent directories as needed."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
    print(f"  Written: {path}")


def write_text(text, path):
    """Write text to *path*, creating parent directories as needed."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)
    print(f"  Written: {path}")


# ---------------------------------------------------------------------------
# Sanity Checks (Phase 6)
# ---------------------------------------------------------------------------

def run_sanity_checks(domain_mappings, weaknesses, version):
    """Run all Phase 6 sanity checks. Returns (errors, warnings)."""
    errors = []
    warnings = []

    # ── Domain Exclusion Tests ───────────────────────────────────────
    print("\n=== Domain Exclusion Tests ===")

    for domain_key, excluded_ids, reason in DOMAIN_EXCLUSION_TESTS:
        mapped_ids = {c["cwe_id"] for c in domain_mappings.get(domain_key, [])}
        violations = mapped_ids & excluded_ids
        if violations:
            msg = (f"FAIL: {domain_key} contains excluded CWEs "
                   f"{violations} ({reason})")
            errors.append(msg)
            print(f"  [FAIL] {msg}")
        else:
            print(f"  [PASS] {domain_key}: excludes {excluded_ids} ({reason})")

    # Web domains must not contain kernel-only CWEs
    for domain_key in ("web-js-ts", "web-backend"):
        mapped_ids = {c["cwe_id"] for c in domain_mappings.get(domain_key, [])}
        for wid in mapped_ids:
            w = weaknesses.get(wid)
            if w:
                desc = ((w["description"] or "")
                        + " " + (w["extended_description"] or ""))
                if matches_any(desc, KERNEL_ONLY_PATTERNS):
                    msg = (f"FAIL: {domain_key} contains kernel-specific "
                           f"CWE-{wid} ({w['name']})")
                    errors.append(msg)
                    print(f"  [FAIL] {msg}")
    if not any("kernel-specific" in e for e in errors):
        print("  [PASS] web-js-ts and web-backend: no kernel-specific CWEs")

    # ── Consistency Checks ───────────────────────────────────────────
    print("\n=== Consistency Checks ===")

    # All mapped CWE IDs exist in the weakness data
    bad_refs = []
    for dk, cwes in domain_mappings.items():
        for c in cwes:
            if c["cwe_id"] not in weaknesses:
                bad_refs.append((dk, c["cwe_id"]))
    if bad_refs:
        msg = f"FAIL: {len(bad_refs)} CWE IDs in mappings not in normalized data"
        errors.append(msg)
        print(f"  [FAIL] {msg}")
    else:
        print("  [PASS] All mapped CWE IDs exist in normalized data")

    # No empty domains
    empty = [dk for dk, cwes in domain_mappings.items() if not cwes]
    if empty:
        msg = f"FAIL: Empty domains: {empty}"
        errors.append(msg)
        print(f"  [FAIL] {msg}")
    else:
        print("  [PASS] No empty domains")

    # Domain count
    if len(domain_mappings) != len(DOMAIN_REGISTRY):
        msg = (f"FAIL: Expected {len(DOMAIN_REGISTRY)} domains, "
               f"got {len(domain_mappings)}")
        errors.append(msg)
        print(f"  [FAIL] {msg}")
    else:
        print(f"  [PASS] All {len(DOMAIN_REGISTRY)} domains present")

    # ── Cross-Domain Coverage ────────────────────────────────────────
    print("\n=== Cross-Domain Coverage ===")

    active = {wid for wid, w in weaknesses.items()
              if w["status"] not in ("Deprecated", "Obsolete")}
    all_mapped = set()
    cwe_domain_count = {}
    for dk, cwes in domain_mappings.items():
        for c in cwes:
            all_mapped.add(c["cwe_id"])
            cwe_domain_count[c["cwe_id"]] = (
                cwe_domain_count.get(c["cwe_id"], 0) + 1)

    unmapped_ids = active - all_mapped
    avg = (sum(cwe_domain_count.values()) / max(len(cwe_domain_count), 1))

    sizes = {dk: len(cwes) for dk, cwes in domain_mappings.items()}
    largest = max(sizes, key=sizes.get)
    smallest = min(sizes, key=sizes.get)

    print(f"  Total active CWEs (excl. Deprecated/Obsolete): {len(active)}")
    print(f"  Mapped to >=1 domain: {len(all_mapped)}")
    print(f"  Unmapped: {len(unmapped_ids)}")
    print(f"  Average domains per CWE: {avg:.1f}")
    print(f"  Largest domain: {largest} ({sizes[largest]} CWEs)")
    print(f"  Smallest domain: {smallest} ({sizes[smallest]} CWEs)")

    for dk, count in sizes.items():
        if count > 200:
            w = f"WARNING: {dk} has {count} CWEs (>200) -- review for splitting"
            warnings.append(w)
            print(f"  [WARN] {w}")

    print("\n  Domain sizes:")
    for dk in DOMAIN_REGISTRY:
        print(f"    {dk}: {sizes.get(dk, 0)}")

    return errors, warnings


# ---------------------------------------------------------------------------
# Main Entry Point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="CWE Taxonomy Ingestion Pipeline for PromptKit",
    )
    parser.add_argument("xml_path", help="Path to CWE XML file")
    args = parser.parse_args()

    xml_path = Path(args.xml_path).resolve()
    if not xml_path.exists():
        print(f"Error: XML file not found: {xml_path}", file=sys.stderr)
        sys.exit(1)

    print("=== CWE Taxonomy Ingestion Pipeline ===")
    print(f"XML source: {xml_path}")

    # ── Phase 1: Acquisition and Validation ──────────────────────────
    print("\n--- Phase 1: Acquisition and Validation ---")

    with open(xml_path, "rb") as fh:
        sha256 = hashlib.sha256(fh.read()).hexdigest()
    print(f"  SHA-256: {sha256}")

    tree = ET.parse(str(xml_path))
    root = tree.getroot()

    if root.tag != NS + "Weakness_Catalog":
        print(f"Error: Expected root <Weakness_Catalog>, got {root.tag}",
              file=sys.stderr)
        sys.exit(1)

    version = root.get("Version")
    cwe_name = root.get("Name")
    cwe_date = root.get("Date")
    print(f"  CWE Version: {version}")
    print(f"  Name: {cwe_name}")
    print(f"  Date: {cwe_date}")

    # Check for previous versions
    def _version_sort_key(name):
        if re.fullmatch(r"\d+(?:\.\d+)*", name):
            return (1, tuple(int(p) for p in name.split(".")))
        return (0, name)

    data_dir = REPO_ROOT / "data" / "cwe"
    prev_version = None
    if data_dir.exists():
        existing = [d.name for d in data_dir.iterdir() if d.is_dir()]
        if existing:
            prev_version = max(existing, key=_version_sort_key)
            print(f"  Previous version found: {prev_version}")

    out_dir = data_dir / version
    os.makedirs(out_dir, exist_ok=True)

    # ── Phase 2: Parsing and Normalization ───────────────────────────
    print("\n--- Phase 2: Parsing and Normalization ---")

    weaknesses = extract_weaknesses(root)
    active_count = sum(
        1 for w in weaknesses.values()
        if w["status"] not in ("Deprecated", "Obsolete")
    )
    print(f"  Total weaknesses: {len(weaknesses)}")
    print(f"  Active (non-deprecated): {active_count}")

    write_json(
        list(weaknesses.values()),
        str(out_dir / "cwe-normalized.json"),
    )

    # ── Phase 3: Domain Mapping ──────────────────────────────────────
    print("\n--- Phase 3: Domain Mapping ---")

    domain_mappings, unmapped = map_weaknesses_to_domains(weaknesses, root)

    mappings_output = {}
    for dk in DOMAIN_REGISTRY:
        mappings_output[dk] = {
            "description": DOMAIN_REGISTRY[dk]["description"],
            "cwe_count": len(domain_mappings[dk]),
            "cwes": domain_mappings[dk],
        }
    write_json(mappings_output, str(out_dir / "domain-mappings.json"))
    write_json(unmapped, str(out_dir / "unmapped.json"))
    print(f"  Unmapped CWEs: {len(unmapped)}")

    # ── Phase 4: Taxonomy Generation ─────────────────────────────────
    print("\n--- Phase 4: Taxonomy Generation ---")

    taxonomy_dir = REPO_ROOT / "taxonomies"
    os.makedirs(taxonomy_dir, exist_ok=True)

    for dk in DOMAIN_REGISTRY:
        content = generate_taxonomy_file(
            dk, domain_mappings[dk], weaknesses, version,
        )
        write_text(content, str(taxonomy_dir / f"cwe-{dk}.md"))

    # ── Phase 5: Meta and Integration ────────────────────────────────
    print("\n--- Phase 5: Meta and Integration ---")

    all_mapped_ids = {
        c["cwe_id"]
        for cwes in domain_mappings.values()
        for c in cwes
    }
    meta = {
        "cwe_version": version,
        "cwe_name": cwe_name,
        "cwe_date": cwe_date,
        "source_sha256": sha256,
        "generation_timestamp": datetime.now(timezone.utc).isoformat(),
        "domain_count": len(DOMAIN_REGISTRY),
        "total_weaknesses": len(weaknesses),
        "active_weaknesses": active_count,
        "mapped_weaknesses": len(all_mapped_ids),
        "unmapped_weaknesses": len(unmapped),
    }
    write_json(meta, str(out_dir / "meta.json"))

    # Diff report (if a previous version exists)
    if prev_version:
        prev_path = data_dir / prev_version / "domain-mappings.json"
        if prev_path.exists():
            with open(prev_path, encoding="utf-8") as fh:
                prev_data = json.load(fh)
            diff = {}
            for dk in DOMAIN_REGISTRY:
                curr = {c["cwe_id"] for c in domain_mappings.get(dk, [])}
                prev = {
                    c["cwe_id"]
                    for c in prev_data.get(dk, {}).get("cwes", [])
                }
                added = curr - prev
                removed = prev - curr
                # Build lookup for previous CWE names
                prev_name_map = {
                    c["cwe_id"]: c.get("name", "?")
                    for c in prev_data.get(dk, {}).get("cwes", [])
                }
                diff[dk] = {
                    "added": [
                        {"cwe_id": wid,
                         "name": weaknesses.get(wid, {}).get("name", "?")}
                        for wid in sorted(added)
                    ],
                    "removed": [
                        {"cwe_id": wid,
                         "name": prev_name_map.get(wid, "?")}
                        for wid in sorted(removed)
                    ],
                    "added_count": len(added),
                    "removed_count": len(removed),
                }
            diff_path = out_dir / f"diff-from-{prev_version}.json"
            write_json(diff, str(diff_path))

            print(f"\n  Diff summary vs {prev_version}:")
            for dk, d in diff.items():
                if d["added_count"] or d["removed_count"]:
                    print(f"    {dk}: +{d['added_count']} "
                          f"-{d['removed_count']}")

    # ── Phase 6: Sanity Checks ───────────────────────────────────────
    print("\n--- Phase 6: Sanity Checks ---")

    errs, warns = run_sanity_checks(domain_mappings, weaknesses, version)

    if errs:
        print(f"\nFAILED: {len(errs)} sanity check(s) failed:")
        for e in errs:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("\nAll sanity checks passed.")
        for w in warns:
            print(f"  [WARN] {w}")

    print(f"\n=== Ingestion Complete ===")
    print(f"CWE Version: {version}")
    print(f"Taxonomy files: {len(DOMAIN_REGISTRY)}")
    print(f"Output directory: {out_dir}")


if __name__ == "__main__":
    main()
