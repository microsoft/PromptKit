// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// cli/lib/update-check.js — best-effort npm registry update check for the
// PromptKit CLI. All network and filesystem operations are wrapped so that
// any failure (timeout, DNS, bad JSON, unwritable cache dir, etc.) is
// swallowed — an update check must never block or break the CLI.

const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const FETCH_TIMEOUT_MS = 1500;
const REGISTRY_BASE = "https://registry.npmjs.org";

function cachePath() {
  return path.join(os.homedir(), ".promptkit", "update-check.json");
}

function readCache() {
  try {
    return JSON.parse(fs.readFileSync(cachePath(), "utf8"));
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    const file = cachePath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data));
  } catch {
    // Best-effort only; cache failures must never surface.
  }
}

// Parse a version string into [major, minor, patch]. Strips an optional
// leading 'v' and ignores any prerelease/build suffix after the patch number.
// Returns null for unparseable input.
function parseVersion(v) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)/.exec(String(v || ""));
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isNewer(candidate, current) {
  const a = parseVersion(candidate);
  const b = parseVersion(current);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return true;
    if (a[i] < b[i]) return false;
  }
  return false;
}

function formatBanner(pkgName, current, latest) {
  const line1 = `Update available: ${current} -> ${latest}`;
  const line2 = `Run: npm i -g ${pkgName}`;
  const inner = Math.max(line1.length, line2.length);
  const bar = "-".repeat(inner + 2);
  return (
    `+${bar}+\n` +
    `| ${line1.padEnd(inner)} |\n` +
    `| ${line2.padEnd(inner)} |\n` +
    `+${bar}+`
  );
}

function fetchLatest(pkgName) {
  return new Promise((resolve) => {
    const url = `${REGISTRY_BASE}/${pkgName}/latest`;
    let settled = false;
    let hardTimer = null;
    const done = (value) => {
      if (settled) return;
      settled = true;
      if (hardTimer) clearTimeout(hardTimer);
      resolve(value);
    };
    try {
      const req = https.get(
        url,
        { timeout: FETCH_TIMEOUT_MS, headers: { Accept: "application/json" } },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            return done(null);
          }
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
            // Hard cap to avoid unbounded memory on a misbehaving registry.
            if (body.length > 64 * 1024) {
              req.destroy();
              done(null);
            }
          });
          res.on("end", () => {
            try {
              const json = JSON.parse(body);
              const version =
                typeof json.version === "string" ? json.version : null;
              // Only return parseable semver so we never cache or surface
              // a malformed value (e.g., missing patch, garbage string).
              done(version && parseVersion(version) ? version : null);
            } catch {
              done(null);
            }
          });
          res.on("error", () => done(null));
        }
      );
      // The { timeout } option above is only a socket-inactivity timeout —
      // a server that trickles bytes can keep the request alive well past
      // FETCH_TIMEOUT_MS. Add an overall hard deadline so interactive
      // startup is never delayed longer than intended.
      hardTimer = setTimeout(() => {
        req.destroy();
        done(null);
      }, FETCH_TIMEOUT_MS);
      if (typeof hardTimer.unref === "function") hardTimer.unref();
      req.on("timeout", () => {
        req.destroy();
        done(null);
      });
      req.on("error", () => done(null));
    } catch {
      done(null);
    }
  });
}

// Decide whether update checking should be performed in this invocation.
// Returns a short string describing the suppression reason, or null if the
// check should proceed.
function suppressionReason({ force = false, ttyOverride } = {}) {
  if (force) return null;
  if (process.env.NO_UPDATE_NOTIFIER === "1") return "NO_UPDATE_NOTIFIER";
  if (process.env.CI) return "CI";
  const isTty = ttyOverride !== undefined ? ttyOverride : !!process.stdout.isTTY;
  if (!isTty) return "non-tty";
  return null;
}

async function checkForUpdate(
  pkgName,
  currentVersion,
  { force = false, now = Date.now() } = {}
) {
  if (suppressionReason({ force })) return null;

  // Dispatch through module.exports._internals so tests can stub these
  // without depending on the real filesystem or network.
  const { readCache, writeCache, fetchLatest } = module.exports._internals;

  const cache = readCache();
  let latest = null;

  if (
    !force &&
    cache &&
    cache.pkg === pkgName &&
    typeof cache.latest === "string" &&
    parseVersion(cache.latest) &&
    typeof cache.checkedAt === "number" &&
    now - cache.checkedAt < CACHE_TTL_MS
  ) {
    latest = cache.latest;
  } else {
    latest = await fetchLatest(pkgName);
    // fetchLatest already filters to parseable semver, but guard again so
    // a future change to that contract can't poison the cache.
    if (latest && parseVersion(latest)) {
      writeCache({ pkg: pkgName, latest, checkedAt: now });
    } else {
      latest = null;
    }
  }

  if (!latest) return null;
  return { latest, isUpdate: isNewer(latest, currentVersion) };
}

module.exports = {
  checkForUpdate,
  formatBanner,
  isNewer,
  parseVersion,
  suppressionReason,
  // Exported for tests that need to bypass the real paths.
  _internals: { cachePath, readCache, writeCache, fetchLatest },
};
