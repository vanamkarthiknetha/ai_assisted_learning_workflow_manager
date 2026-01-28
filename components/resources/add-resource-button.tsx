"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceDialog } from "./resource-dialog";

interface AddResourceButtonProps {
  goalId: string;
}

export function AddResourceButton({ goalId }: AddResourceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Resource
      </Button>
      <ResourceDialog
        mode="create"
        goalId={goalId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
}
