import { z } from "zod";
import { GoalStatus } from "@/lib/types";

// Goal creation/update validation schema
export const goalSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum([GoalStatus.NOT_STARTED, GoalStatus.IN_PROGRESS, GoalStatus.COMPLETED]).default(GoalStatus.NOT_STARTED),
  targetDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : null))
    .nullable(),
});

// Type exports
export type GoalInput = z.infer<typeof goalSchema>;
