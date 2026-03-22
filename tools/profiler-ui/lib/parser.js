// lib/parser.js
export const parseLogData = (rawText) => {
  // Case-insensitive matching for better accuracy
  const known = (rawText.match(/KNOWN/gi) || []).length;
  const inferred = (rawText.match(/INFERRED/gi) || []).length;
  const assumed = (rawText.match(/ASSUMED|ASSUMPTION/gi) || []).length;

  const critical = (rawText.match(/CRITICAL/gi) || []).length;
  const high = (rawText.match(/HIGH/gi) || []).length;
  const medium = (rawText.match(/MEDIUM/gi) || []).length;

  // Extract Finding IDs (e.g., ml-001, ts-001) for the table
  const findingIds = Array.from(
    new Set(rawText.match(/(ml|ts)-\d{3}/gi) || []),
  );

  return {
    grounding: [
      { category: "Grounded (Known)", count: known, color: "#10b981" },
      { category: "Reasoned (Inferred)", count: inferred, color: "#3b82f6" },
      { category: "Assumptions", count: assumed, color: "#f59e0b" },
    ],
    hotspots: [
      { category: "Critical", count: critical, color: "#ef4444" },
      { category: "High", count: high, color: "#f97316" },
      { category: "Medium", count: medium, color: "#eab308" },
    ],
    findings: findingIds,
  };
};
