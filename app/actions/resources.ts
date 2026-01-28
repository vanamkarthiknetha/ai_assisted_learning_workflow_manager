"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { resourceSchema } from "@/lib/validations/resource";

export type ResourceActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: { id: string };
};

// Verify that the goal belongs to the current user
async function verifyGoalOwnership(goalId: string, userId: string) {
  const goal = await db.goal.findFirst({
    where: { id: goalId, userId },
  });
  return !!goal;
}

// Create a new resource
export async function createResource(
  formData: FormData
): Promise<ResourceActionResponse> {
  const userId = await getCurrentUserId();

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    url: formData.get("url"),
    completed: formData.get("completed") === "true",
    goalId: formData.get("goalId"),
  };

  const validatedFields = resourceSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Verify ownership
  const isOwner = await verifyGoalOwnership(validatedFields.data.goalId, userId);
  if (!isOwner) {
    return {
      success: false,
      message: "Goal not found",
    };
  }

  try {
    const resource = await db.resource.create({
      data: {
        title: validatedFields.data.title,
        type: validatedFields.data.type,
        url: validatedFields.data.url,
        completed: validatedFields.data.completed,
        goalId: validatedFields.data.goalId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${validatedFields.data.goalId}`);

    return {
      success: true,
      message: "Resource added successfully",
      data: { id: resource.id },
    };
  } catch (error) {
    console.error("Create resource error:", error);
    return {
      success: false,
      message: "Failed to add resource. Please try again.",
    };
  }
}

// Update a resource
export async function updateResource(
  id: string,
  formData: FormData
): Promise<ResourceActionResponse> {
  const userId = await getCurrentUserId();

  // Get existing resource with goal
  const existingResource = await db.resource.findUnique({
    where: { id },
    include: { goal: true },
  });

  if (!existingResource || existingResource.goal.userId !== userId) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  const rawData = {
    title: formData.get("title"),
    type: formData.get("type"),
    url: formData.get("url"),
    completed: formData.get("completed") === "true",
    goalId: existingResource.goalId,
  };

  const validatedFields = resourceSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await db.resource.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        type: validatedFields.data.type,
        url: validatedFields.data.url,
        completed: validatedFields.data.completed,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${existingResource.goalId}`);

    return {
      success: true,
      message: "Resource updated successfully",
      data: { id },
    };
  } catch (error) {
    console.error("Update resource error:", error);
    return {
      success: false,
      message: "Failed to update resource. Please try again.",
    };
  }
}

// Toggle resource completion status
export async function toggleResourceCompletion(
  id: string
): Promise<ResourceActionResponse> {
  const userId = await getCurrentUserId();

  // Get existing resource with goal
  const existingResource = await db.resource.findUnique({
    where: { id },
    include: { goal: true },
  });

  if (!existingResource || existingResource.goal.userId !== userId) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  try {
    await db.resource.update({
      where: { id },
      data: {
        completed: !existingResource.completed,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${existingResource.goalId}`);

    return {
      success: true,
      message: existingResource.completed
        ? "Resource marked as incomplete"
        : "Resource marked as complete",
      data: { id },
    };
  } catch (error) {
    console.error("Toggle resource error:", error);
    return {
      success: false,
      message: "Failed to update resource. Please try again.",
    };
  }
}

// Delete a resource
export async function deleteResource(id: string): Promise<ResourceActionResponse> {
  const userId = await getCurrentUserId();

  // Get existing resource with goal
  const existingResource = await db.resource.findUnique({
    where: { id },
    include: { goal: true },
  });

  if (!existingResource || existingResource.goal.userId !== userId) {
    return {
      success: false,
      message: "Resource not found",
    };
  }

  try {
    await db.resource.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/goals/${existingResource.goalId}`);

    return {
      success: true,
      message: "Resource deleted successfully",
    };
  } catch (error) {
    console.error("Delete resource error:", error);
    return {
      success: false,
      message: "Failed to delete resource. Please try again.",
    };
  }
}
