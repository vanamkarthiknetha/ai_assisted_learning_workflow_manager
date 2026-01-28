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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GoalStatus } from "@/lib/types";
import { createGoal, updateGoal } from "@/app/actions/goals";

interface GoalDialogProps {
  mode: "create" | "edit";
  goal?: {
    id: string;
    title: string;
    description: string | null;
    status: GoalStatus;
    targetDate: Date | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: GoalStatus.NOT_STARTED, label: "Not Started" },
  { value: GoalStatus.IN_PROGRESS, label: "In Progress" },
  { value: GoalStatus.COMPLETED, label: "Completed" },
];

export function GoalDialog({ mode, goal, open, onOpenChange }: GoalDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Goal" : "Create New Goal";
  const description = isEdit
    ? "Update your learning goal details."
    : "Set a new learning goal to track your progress.";

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});

    try {
      const result = isEdit
        ? await updateGoal(goal!.id, formData)
        : await createGoal(formData);

      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        }
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Learn React Fundamentals"
                defaultValue={goal?.title || ""}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your learning goal..."
                defaultValue={goal?.description || ""}
                disabled={isLoading}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={goal?.status || GoalStatus.NOT_STARTED}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Date (optional)</Label>
                <div className="relative">
                  <Input
                    id="targetDate"
                    name="targetDate"
                    type="date"
                    defaultValue={formatDateForInput(goal?.targetDate || null)}
                    disabled={isLoading}
                    className="cursor-pointer w-full"
                    style={{
                      colorScheme: 'light dark'
                    }}
                  />
                </div>
                {errors.targetDate && (
                  <p className="text-sm text-destructive">
                    {errors.targetDate[0]}
                  </p>
                )}
              </div>
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
              {isEdit ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
