// Shared types that can be used in both client and server components
// These match the Prisma schema enums

export const GoalStatus = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const;

export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];

export const ResourceType = {
  VIDEO: "VIDEO",
  ARTICLE: "ARTICLE",
  COURSE: "COURSE",
} as const;

export type ResourceType = (typeof ResourceType)[keyof typeof ResourceType];
