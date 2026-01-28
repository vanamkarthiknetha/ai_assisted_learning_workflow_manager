import { z } from "zod";
import { ResourceType } from "@/lib/types";

// Resource creation/update validation schema
export const resourceSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  type: z.enum([ResourceType.VIDEO, ResourceType.ARTICLE, ResourceType.COURSE]),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL"),
  completed: z.boolean().default(false),
  goalId: z.string().min(1, "Goal ID is required"),
});

// Type exports
export type ResourceInput = z.infer<typeof resourceSchema>;
