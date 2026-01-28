import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SummarizeForm } from "@/components/ai/summarize-form";
import { StudyPlanForm } from "@/components/ai/study-plan-form";

export default function AIToolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8" />
          AI Tools
        </h1>
        <p className="text-muted-foreground mt-2">
          Leverage AI to enhance your learning with smart summaries and
          personalized study plans.
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summarize" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="summarize">Summarize Content</TabsTrigger>
          <TabsTrigger value="study-plan">Study Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="summarize">
          <SummarizeForm />
        </TabsContent>

        <TabsContent value="study-plan">
          <StudyPlanForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
