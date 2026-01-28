"use server";

import { getCurrentUserId } from "@/lib/session";
import { getGeminiModel, summarizationPrompt, studyPlanPrompt } from "@/lib/ai";
import { summarizeSchema, studyPlanSchema } from "@/lib/validations/ai";

export type AIActionResponse = {
  success: boolean;
  message: string;
  data?: string;
  errors?: Record<string, string[]>;
};

// Generate summary from content
export async function generateSummary(
  formData: FormData
): Promise<AIActionResponse> {
  // Verify authentication
  await getCurrentUserId();

  const rawData = {
    content: formData.get("content"),
  };

  const validatedFields = summarizeSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const model = getGeminiModel();
    const prompt = summarizationPrompt(validatedFields.data.content);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return {
        success: false,
        message: "Failed to generate summary. Please try again.",
      };
    }

    return {
      success: true,
      message: "Summary generated successfully",
      data: text,
    };
  } catch (error) {
    console.error("AI summarization error:", error);
    return {
      success: false,
      message: "Failed to generate summary. Please check your API key and try again.",
    };
  }
}

// Generate study plan
export async function generateStudyPlan(
  formData: FormData
): Promise<AIActionResponse> {
  // Verify authentication
  await getCurrentUserId();

  const rawData = {
    goalTitle: formData.get("goalTitle"),
    description: formData.get("description") || "",
    targetDate: formData.get("targetDate"),
  };

  const validatedFields = studyPlanSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const model = getGeminiModel();

    // Format the target date for the prompt
    const formattedDate = new Date(
      validatedFields.data.targetDate
    ).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const prompt = studyPlanPrompt(
      validatedFields.data.goalTitle,
      formattedDate,
      validatedFields.data.description || undefined
    );

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    if (!text) {
      return {
        success: false,
        message: "Failed to generate study plan. Please try again.",
      };
    }

    return {
      success: true,
      message: "Study plan generated successfully",
      data: text,
    };
  } catch (error) {
    console.error("AI study plan error:", error);
    return {
      success: false,
      message: "Failed to generate study plan. Please check your API key and try again.",
    };
  }
}
