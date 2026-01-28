"use client";

import { useState } from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateSummary } from "@/app/actions/ai";

export function SummarizeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    setResult(null);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await generateSummary(formData);

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
            <Sparkles className="h-5 w-5" />
            Content Summarizer
          </CardTitle>
          <CardDescription>
            Paste your learning content and get an AI-generated summary with key
            takeaways.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Learning Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Paste your learning content here (article text, notes, etc.)..."
                disabled={isLoading}
                rows={8}
                className="resize-none"
              />
              {fieldErrors.content && (
                <p className="text-sm text-destructive">{fieldErrors.content[0]}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Minimum 50 characters, maximum 10,000 characters
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="min-w-[180px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
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
            <CardTitle>Generated Summary</CardTitle>
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
