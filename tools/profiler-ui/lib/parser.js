export const parseProfileData = (rawText) => {
  try {
    // 1. Target the JSON block specifically inside Markdown code fences
    // This brilliantly ignores conversational text or CLI noise.
    const jsonMatch =
      rawText.match(/```json\s*(\{[\s\S]*?\})\s*```/) ||
      rawText.match(/(\{[\s\S]*\})/); // Fallback to last-resort brace match

    if (!jsonMatch) {
      console.error("No valid JSON block found in the log.");
      return null;
    }

    // 2. Parse the extracted JSON string
    const data = JSON.parse(jsonMatch[1] || jsonMatch[0]);

    // 3. Pass the data straight through!
    // Since our backend PromptKit template now strictly outputs the exact 
    // structure our UI needs (executiveSummary, findings, remediationPlan),
    // we no longer have to manually map or calculate fields.
    return data;
    
  } catch (e) {
    console.error("Failed to parse AI-generated JSON:", e);
    return null;
  }
};