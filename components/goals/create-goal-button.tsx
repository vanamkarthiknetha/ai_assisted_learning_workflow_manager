"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalDialog } from "./goal-dialog";

export function CreateGoalButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        New Goal
      </Button>
      <GoalDialog mode="create" open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
