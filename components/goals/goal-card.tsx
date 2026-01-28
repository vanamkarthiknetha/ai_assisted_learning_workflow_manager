"use client";

import { useRouter } from "next/navigation";
import { Calendar, BookOpen, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoalStatus } from "@/lib/types";
import { deleteGoal } from "@/app/actions/goals";
import { GoalDialog } from "./goal-dialog";

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description: string | null;
    status: GoalStatus;
    targetDate: Date | null;
    progress: number;
    totalResources: number;
    completedResources: number;
  };
}

const statusColors: Record<GoalStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  COMPLETED: "bg-green-100 text-green-800 hover:bg-green-100",
};

const statusLabels: Record<GoalStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export function GoalCard({ goal }: GoalCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this goal?")) return;

    setIsDeleting(true);
    const result = await deleteGoal(goal.id);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    setIsDeleting(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const handleCardClick = () => {
    router.push(`/goals/${goal.id}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Card 
        className="group hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
              {goal.title}
            </CardTitle>
            <Badge variant="secondary" className={statusColors[goal.status]}>
              {statusLabels[goal.status]}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          {goal.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {goal.description}
            </p>
          )}

          {/* Progress */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(goal.progress)}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>
                {goal.completedResources}/{goal.totalResources} resources
              </span>
            </div>
            {goal.targetDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(goal.targetDate)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <GoalDialog
        mode="edit"
        goal={goal}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </>
  );
}
