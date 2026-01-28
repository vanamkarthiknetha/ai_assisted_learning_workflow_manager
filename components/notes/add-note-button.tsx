"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteDialog } from "./note-dialog";

interface AddNoteButtonProps {
  goalId?: string;
  resourceId?: string;
}

export function AddNoteButton({ goalId, resourceId }: AddNoteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Note
      </Button>
      <NoteDialog
        mode="create"
        goalId={goalId}
        resourceId={resourceId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
