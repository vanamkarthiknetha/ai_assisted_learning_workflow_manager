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
You are an expert learning assistant. Analyze the following learning content and provide a well-formatted markdown response.

IMPORTANT: Format your entire response in Markdown syntax.

Provide:
1. A SHORT SUMMARY (3-4 sentences maximum) that captures the main points
2. KEY TAKEAWAYS as bullet points (5-7 points maximum)

Format your response in Markdown EXACTLY as follows:

## Summary
[Your 3-4 sentence summary here]

## Key Takeaways
- [Takeaway 1]
- [Takeaway 2]
- [Takeaway 3]
- [Takeaway 4]
- [Continue as needed...]

Use **bold** for emphasis on important terms and concepts.

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

IMPORTANT: Format your entire response in Markdown syntax with proper headings, lists, and emphasis.

Learning Goal: ${goalTitle}
${description ? `Description: ${description}` : ""}
Target Completion Date: ${targetDate}

Calculate the number of weeks available and create a week-by-week study plan.

Format your response in Markdown EXACTLY as follows:

## Study Plan Overview
[Brief overview of the approach - 2-3 sentences. Use **bold** for key concepts.]

## Weekly Breakdown

### Week 1: [Focus Area Title]
- **[Specific task or topic to cover]** - [Brief description]
- **[Specific task or topic to cover]** - [Brief description]
- *Recommended time: [X hours/week]*

### Week 2: [Focus Area Title]
- **[Specific task or topic to cover]** - [Brief description]
- **[Specific task or topic to cover]** - [Brief description]
- *Recommended time: [X hours/week]*

[Continue for remaining weeks...]

## Tips for Success
- **[Practical tip 1]** - [Explanation]
- **[Practical tip 2]** - [Explanation]
- **[Practical tip 3]** - [Explanation]

Use proper Markdown formatting:
- Use ## for main sections
- Use ### for week headings
- Use **bold** for important tasks and concepts
- Use *italics* for time recommendations
- Use - for bullet points

Keep the plan realistic, actionable, and focused. Don't overload any single week.
`;
