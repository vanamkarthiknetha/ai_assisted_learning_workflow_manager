"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNote, updateNote } from "@/app/actions/notes";

interface NoteDialogProps {
  mode: "create" | "edit";
  goalId?: string;
  resourceId?: string;
  note?: {
    id: string;
    content: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoteDialog({
  mode,
  goalId,
  resourceId,
  note,
  open,
  onOpenChange,
}: NoteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Note" : "Add New Note";
  const description = isEdit
    ? "Update your note content."
    : "Add a note to capture important learnings.";

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    // Add goalId or resourceId to formData
    if (goalId) {
      formData.set("goalId", goalId);
    }
    if (resourceId) {
      formData.set("resourceId", resourceId);
    }

    try {
      const result = isEdit
        ? await updateNote(note!.id, formData)
        : await createNote(formData);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="content">Note</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your note here..."
                defaultValue={note?.content || ""}
                disabled={isLoading}
                rows={6}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
