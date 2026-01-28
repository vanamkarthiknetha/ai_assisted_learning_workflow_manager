"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { goalSchema } from "@/lib/validations/goal";
import { GoalStatus } from "@/lib/types";

export type GoalActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: { id: string };
};

// Get all goals for the current user
export async function getGoals() {
  const userId = await getCurrentUserId();

  const goals = await db.goal.findMany({
    where: { userId },
    include: {
      resources: {
        select: {
          id: true,
          completed: true,
        },
      },
      _count: {
        select: {
          resources: true,
          notes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate progress for each goal
  return goals.map((goal) => {
    const totalResources = goal.resources.length;
    const completedResources = goal.resources.filter((r) => r.completed).length;
    const progress = totalResources > 0 ? (completedResources / totalResources) * 100 : 0;

    return {
      ...goal,
      progress,
      totalResources,
      completedResources,
    };
  });
}

// Get a single goal by ID
export async function getGoalById(id: string) {
  const userId = await getCurrentUserId();

  const goal = await db.goal.findFirst({
    where: { id, userId },
    include: {
      resources: {
        orderBy: { createdAt: "desc" },
      },
      notes: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!goal) {
    return null;
  }

  const totalResources = goal.resources.length;
  const completedResources = goal.resources.filter((r) => r.completed).length;
  const progress = totalResources > 0 ? (completedResources / totalResources) * 100 : 0;

  return {
    ...goal,
    progress,
    totalResources,
    completedResources,
  };
}

// Create a new goal
export async function createGoal(formData: FormData): Promise<GoalActionResponse> {
  const userId = await getCurrentUserId();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status") || GoalStatus.NOT_STARTED,
    targetDate: formData.get("targetDate") || null,
  };

  const validatedFields = goalSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const goal = await db.goal.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        status: validatedFields.data.status,
        targetDate: validatedFields.data.targetDate,
        userId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${goal.id}`);

    return {
      success: true,
      message: "Goal created successfully",
      data: { id: goal.id },
    };
  } catch (error) {
    console.error("Create goal error:", error);
    return {
      success: false,
      message: "Failed to create goal. Please try again.",
    };
  }
}

// Update a goal
export async function updateGoal(
  id: string,
  formData: FormData
): Promise<GoalActionResponse> {
  const userId = await getCurrentUserId();

  // Verify ownership
  const existingGoal = await db.goal.findFirst({
    where: { id, userId },
  });

  if (!existingGoal) {
    return {
      success: false,
      message: "Goal not found",
    };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description") || "",
    status: formData.get("status") || existingGoal.status,
    targetDate: formData.get("targetDate") || null,
  };

  const validatedFields = goalSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db.goal.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.description || null,
        status: validatedFields.data.status,
        targetDate: validatedFields.data.targetDate,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${id}`);

    return {
      success: true,
      message: "Goal updated successfully",
      data: { id },
    };
  } catch (error) {
    console.error("Update goal error:", error);
    return {
      success: false,
      message: "Failed to update goal. Please try again.",
    };
  }
}

// Delete a goal
export async function deleteGoal(id: string): Promise<GoalActionResponse> {
  const userId = await getCurrentUserId();

  // Verify ownership
  const existingGoal = await db.goal.findFirst({
    where: { id, userId },
  });

  if (!existingGoal) {
    return {
      success: false,
      message: "Goal not found",
    };
  }

  try {
    await db.goal.delete({
      where: { id },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Goal deleted successfully",
    };
  } catch (error) {
    console.error("Delete goal error:", error);
    return {
      success: false,
      message: "Failed to delete goal. Please try again.",
    };
  }
}
