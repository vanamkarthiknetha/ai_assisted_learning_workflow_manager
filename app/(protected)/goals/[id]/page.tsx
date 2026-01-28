import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  StickyNote,
  Pencil,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getGoalById } from "@/app/actions/goals";
import { GoalStatus } from "@/lib/types";
import { ResourceItem } from "@/components/resources/resource-item";
import { AddResourceButton } from "@/components/resources/add-resource-button";
import { NoteItem } from "@/components/notes/note-item";
import { AddNoteButton } from "@/components/notes/add-note-button";
import { GoalActions } from "@/components/goals/goal-actions";

interface GoalDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<GoalStatus, string> = {
  NOT_STARTED: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

const statusLabels: Record<GoalStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export default async function GoalDetailPage({ params }: GoalDetailPageProps) {
  const { id } = await params;
  const goal = await getGoalById(id);

  if (!goal) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Link>

      {/* Goal Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{goal.title}</h1>
            <Badge variant="secondary" className={statusColors[goal.status]}>
              {statusLabels[goal.status]}
            </Badge>
          </div>
          {goal.description && (
            <p className="text-muted-foreground max-w-2xl">{goal.description}</p>
          )}
          {goal.targetDate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Target: {formatDate(goal.targetDate)}</span>
            </div>
          )}
        </div>
        <GoalActions goal={goal} />
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {goal.completedResources} of {goal.totalResources} resources
                completed
              </span>
              <span className="font-medium">{Math.round(goal.progress)}%</span>
            </div>
            <Progress value={goal.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Resources Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Resources</CardTitle>
            </div>
            <AddResourceButton goalId={goal.id} />
          </CardHeader>
          <CardContent>
            {goal.resources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No resources yet</p>
                <p className="text-sm">
                  Add videos, articles, or courses to track your learning.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {goal.resources.map((resource) => (
                  <ResourceItem
                    key={resource.id}
                    resource={resource}
                    goalId={goal.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notes</CardTitle>
            </div>
            <AddNoteButton goalId={goal.id} />
          </CardHeader>
          <CardContent>
            {goal.notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notes yet</p>
                <p className="text-sm">
                  Add notes to capture important learnings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {goal.notes.map((note) => (
                  <NoteItem key={note.id} note={note} goalId={goal.id} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
