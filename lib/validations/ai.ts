import { z } from "zod";

// Summarization input validation
export const summarizeSchema = z.object({
  content: z
    .string()
    .min(50, "Content must be at least 50 characters")
    .max(10000, "Content must be less than 10,000 characters"),
});

// Study plan input validation
export const studyPlanSchema = z.object({
  goalTitle: z
    .string()
    .min(3, "Goal title must be at least 3 characters")
    .max(100, "Goal title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  targetDate: z
    .string()
    .min(1, "Target date is required")
    .refine(
      (val) => {
        const date = new Date(val);
        return date > new Date();
      },
      "Target date must be in the future"
    ),
});

export type SummarizeInput = z.infer<typeof summarizeSchema>;
export type StudyPlanInput = z.infer<typeof studyPlanSchema>;
