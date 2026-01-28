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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceType } from "@/lib/types";
import { createResource, updateResource } from "@/app/actions/resources";

interface ResourceDialogProps {
  mode: "create" | "edit";
  goalId: string;
  resource?: {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    completed: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const resourceTypes = [
  { value: ResourceType.VIDEO, label: "Video" },
  { value: ResourceType.ARTICLE, label: "Article" },
  { value: ResourceType.COURSE, label: "Course" },
];

export function ResourceDialog({
  mode,
  goalId,
  resource,
  open,
  onOpenChange,
}: ResourceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Resource" : "Add New Resource";
  const description = isEdit
    ? "Update the learning resource details."
    : "Add a new learning resource to this goal.";

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setErrors({});

    // Add goalId to formData
    formData.set("goalId", goalId);

    try {
      const result = isEdit
        ? await updateResource(resource!.id, formData)
        : await createResource(formData);

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
                placeholder="e.g., React Tutorial - Part 1"
                defaultValue={resource?.title || ""}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                name="type"
                defaultValue={resource?.type || ResourceType.VIDEO}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com/resource"
                defaultValue={resource?.url || ""}
                disabled={isLoading}
              />
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url[0]}</p>
              )}
            </div>

            {isEdit && (
              <input
                type="hidden"
                name="completed"
                value={resource?.completed ? "true" : "false"}
              />
            )}
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
              {isEdit ? "Save Changes" : "Add Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
