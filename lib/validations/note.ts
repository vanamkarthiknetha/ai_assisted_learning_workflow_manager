import { z } from "zod";

// Note creation/update validation schema
export const noteSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(5000, "Note must be less than 5000 characters"),
  goalId: z.string().optional().nullable(),
  resourceId: z.string().optional().nullable(),
}).refine(
  (data) => data.goalId || data.resourceId,
  "Note must be linked to either a goal or a resource"
);

// Type exports
export type NoteInput = z.infer<typeof noteSchema>;
