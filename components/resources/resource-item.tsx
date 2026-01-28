"use client";

import { useState } from "react";
import {
  Video,
  FileText,
  GraduationCap,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  Circle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResourceType } from "@/lib/types";
import {
  deleteResource,
  toggleResourceCompletion,
} from "@/app/actions/resources";
import { ResourceDialog } from "./resource-dialog";

interface ResourceItemProps {
  resource: {
    id: string;
    title: string;
    type: ResourceType;
    url: string;
    completed: boolean;
  };
  goalId: string;
}

const typeIcons: Record<ResourceType, typeof Video> = {
  VIDEO: Video,
  ARTICLE: FileText,
  COURSE: GraduationCap,
};

const typeLabels: Record<ResourceType, string> = {
  VIDEO: "Video",
  ARTICLE: "Article",
  COURSE: "Course",
};

export function ResourceItem({ resource, goalId }: ResourceItemProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const Icon = typeIcons[resource.type];

  const handleToggleComplete = async () => {
    setIsLoading(true);
    const result = await toggleResourceCompletion(resource.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    setIsLoading(true);
    const result = await deleteResource(resource.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors group">
        {/* Completion toggle */}
        <button
          type="button"
          onClick={handleToggleComplete}
          disabled={isLoading}
          className="flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {resource.completed ? (
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>

        {/* Resource info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <h4
              className={`font-medium truncate ${
                resource.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {resource.title}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {typeLabels[resource.type]}
            </Badge>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate max-w-[200px]"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{resource.url}</span>
            </a>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isLoading}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ResourceDialog
        mode="edit"
        goalId={goalId}
        resource={resource}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
