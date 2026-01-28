import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
);

// Get the Gemini model
export function getGeminiModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

// Summarization prompt template
export const summarizationPrompt = (content: string) => `
You are an expert learning assistant. Analyze the following learning content and provide:

1. A SHORT SUMMARY (3-4 sentences maximum) that captures the main points
2. KEY TAKEAWAYS as bullet points (5-7 points maximum)

Format your response EXACTLY as follows:
## Summary
[Your 3-4 sentence summary here]

## Key Takeaways
- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]
...

Here is the content to summarize:

${content}
`;

// Study plan prompt template
export const studyPlanPrompt = (
  goalTitle: string,
  targetDate: string,
  description?: string
) => `
You are an expert learning coach. Create a practical, actionable weekly study plan for the following learning goal.

Learning Goal: ${goalTitle}
${description ? `Description: ${description}` : ""}
Target Completion Date: ${targetDate}

Calculate the number of weeks available and create a week-by-week study plan.

Format your response EXACTLY as follows:
## Study Plan Overview
[Brief overview of the approach - 2-3 sentences]

## Weekly Breakdown

### Week 1: [Focus Area Title]
- [Specific task or topic to cover]
- [Specific task or topic to cover]
- [Recommended time allocation]

### Week 2: [Focus Area Title]
- [Specific task or topic to cover]
- [Specific task or topic to cover]
- [Recommended time allocation]

[Continue for remaining weeks...]

## Tips for Success
- [Practical tip 1]
- [Practical tip 2]
- [Practical tip 3]

Keep the plan realistic, actionable, and focused. Don't overload any single week.
`;
