"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/session";
import { noteSchema } from "@/lib/validations/note";

export type NoteActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: { id: string };
};

// Verify that the goal or resource belongs to the current user
async function verifyOwnership(
  userId: string,
  goalId?: string | null,
  resourceId?: string | null
) {
  if (goalId) {
    const goal = await db.goal.findFirst({
      where: { id: goalId, userId },
    });
    return !!goal;
  }

  if (resourceId) {
    const resource = await db.resource.findUnique({
      where: { id: resourceId },
      include: { goal: true },
    });
    return resource?.goal.userId === userId;
  }

  return false;
}

// Create a new note
export async function createNote(
  formData: FormData
): Promise<NoteActionResponse> {
  const userId = await getCurrentUserId();

  const rawData = {
    content: formData.get("content"),
    goalId: formData.get("goalId") || null,
    resourceId: formData.get("resourceId") || null,
  };

  const validatedFields = noteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Verify ownership
  const isOwner = await verifyOwnership(
    userId,
    validatedFields.data.goalId,
    validatedFields.data.resourceId
  );

  if (!isOwner) {
    return {
      success: false,
      message: "Not authorized",
    };
  }

  try {
    const note = await db.note.create({
      data: {
        content: validatedFields.data.content,
        goalId: validatedFields.data.goalId,
        resourceId: validatedFields.data.resourceId,
      },
    });

    // Revalidate the goal page
    if (validatedFields.data.goalId) {
      revalidatePath(`/goals/${validatedFields.data.goalId}`);
    }

    return {
      success: true,
      message: "Note added successfully",
      data: { id: note.id },
    };
  } catch (error) {
    console.error("Create note error:", error);
    return {
      success: false,
      message: "Failed to add note. Please try again.",
    };
  }
}

// Update a note
export async function updateNote(
  id: string,
  formData: FormData
): Promise<NoteActionResponse> {
  const userId = await getCurrentUserId();

  // Get existing note with goal
  const existingNote = await db.note.findUnique({
    where: { id },
    include: {
      goal: true,
      resource: { include: { goal: true } },
    },
  });

  if (!existingNote) {
    return {
      success: false,
      message: "Note not found",
    };
  }

  // Verify ownership
  const noteUserId =
    existingNote.goal?.userId || existingNote.resource?.goal.userId;
  if (noteUserId !== userId) {
    return {
      success: false,
      message: "Not authorized",
    };
  }

  const content = formData.get("content");

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return {
      success: false,
      message: "Note content is required",
    };
  }

  try {
    await db.note.update({
      where: { id },
      data: { content: content.trim() },
    });

    // Revalidate the goal page
    const goalId = existingNote.goalId || existingNote.resource?.goalId;
    if (goalId) {
      revalidatePath(`/goals/${goalId}`);
    }

    return {
      success: true,
      message: "Note updated successfully",
      data: { id },
    };
  } catch (error) {
    console.error("Update note error:", error);
    return {
      success: false,
      message: "Failed to update note. Please try again.",
    };
  }
}

// Delete a note
export async function deleteNote(id: string): Promise<NoteActionResponse> {
  const userId = await getCurrentUserId();

  // Get existing note with goal
  const existingNote = await db.note.findUnique({
    where: { id },
    include: {
      goal: true,
      resource: { include: { goal: true } },
    },
  });

  if (!existingNote) {
    return {
      success: false,
      message: "Note not found",
    };
  }

  // Verify ownership
  const noteUserId =
    existingNote.goal?.userId || existingNote.resource?.goal.userId;
  if (noteUserId !== userId) {
    return {
      success: false,
      message: "Not authorized",
    };
  }

  try {
    await db.note.delete({
      where: { id },
    });

    // Revalidate the goal page
    const goalId = existingNote.goalId || existingNote.resource?.goalId;
    if (goalId) {
      revalidatePath(`/goals/${goalId}`);
    }

    return {
      success: true,
      message: "Note deleted successfully",
    };
  } catch (error) {
    console.error("Delete note error:", error);
    return {
      success: false,
      message: "Failed to delete note. Please try again.",
    };
  }
}
