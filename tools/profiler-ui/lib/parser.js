export const parseProfileData = (rawText) => {
  try {
    // 1. Target the JSON block specifically inside Markdown code fences
    // This ignores PowerShell noise or extra text in the log.
    const jsonMatch =
      rawText.match(/```json\s*(\{[\s\S]*?\})\s*```/) ||
      rawText.match(/(\{[\s\S]*\})/); // Fallback to last-resort brace match

    if (!jsonMatch) {
      console.error("No valid JSON block found in the log.");
      return null;
    }

    // Use the first capture group (the actual JSON)
    const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // 2. Handle the new 'token_counts' schema in the optimized log
    // We map 'by_component' from the new log to the 'components' chart data.
    const componentSource =
      data.token_counts?.by_component || data.component_breakdown || {};

    const chartComponents = Object.entries(componentSource).map(
      ([key, val]) => ({
        name: key.replace(/_/g, " ").toUpperCase(),
        // Handle both old schema (object with tokens_estimated) and new schema (number)
        tokens: typeof val === "object" ? val.tokens_estimated : val,
      }),
    );

    // 3. Map the rest of the summary and recommendations
    return {
      summary: {
        efficiency_score: data.session_summary?.efficiency_loss
          ? 100 - parseInt(data.session_summary.efficiency_loss)
          : data.summary?.efficiency_score || 0,
        efficiency_rating: data.summary?.efficiency_rating || "Optimized",
        key_findings:
          data.session_summary?.key_findings ||
          data.summary?.key_findings ||
          [],
      },
      components: chartComponents,
      recommendations: data.optimization_recommendations || [],
    };
  } catch (e) {
    console.error("Failed to parse AI-generated JSON:", e);
    return null;
  }
};
