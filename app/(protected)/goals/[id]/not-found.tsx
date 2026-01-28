import Link from "next/link";
import { Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GoalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Target className="h-16 w-16 text-muted-foreground mb-6" />
      <h1 className="text-2xl font-bold mb-2">Goal Not Found</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        The goal you&apos;re looking for doesn&apos;t exist or you don&apos;t
        have permission to view it.
      </p>
      <Link href="/dashboard">
        <Button>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
