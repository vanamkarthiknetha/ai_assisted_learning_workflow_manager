"use client";

import { useState } from "react";
import { Loader2, Calendar, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateStudyPlan } from "@/app/actions/ai";

export function StudyPlanForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [copied, setCopied] = useState(false);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    setResult(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await generateStudyPlan(formData);

      if (response.success && response.data) {
        setResult(response.data);
        toast.success(response.message);
      } else {
        setError(response.message);
        if (response.errors) {
          setFieldErrors(response.errors);
        }
        toast.error(response.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async () => {
    if (result && !isCopying) {
      setIsCopying(true);
      try {
        await navigator.clipboard.writeText(result);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Failed to copy");
      } finally {
        setIsCopying(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Study Plan Generator
          </CardTitle>
          <CardDescription>
            Enter your learning goal and target date to get a personalized
            week-by-week study plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalTitle">Learning Goal</Label>
              <Input
                id="goalTitle"
                name="goalTitle"
                placeholder="e.g., Learn React and Build a Portfolio Project"
                disabled={isLoading}
              />
              {fieldErrors.goalTitle && (
                <p className="text-sm text-destructive">{fieldErrors.goalTitle[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add more context about what you want to learn..."
                disabled={isLoading}
                rows={3}
              />
              {fieldErrors.description && (
                <p className="text-sm text-destructive">{fieldErrors.description[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Completion Date</Label>
              <div className="relative">
                <Input
                  id="targetDate"
                  name="targetDate"
                  type="date"
                  min={getMinDate()}
                  disabled={isLoading}
                  className="cursor-pointer w-full"
                  style={{
                    colorScheme: 'light dark'
                  }}
                />
              </div>
              {fieldErrors.targetDate && (
                <p className="text-sm text-destructive">{fieldErrors.targetDate[0]}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Your Study Plan</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              disabled={isCopying || copied}
            >
              {isCopying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Copying...
                </>
              ) : copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
