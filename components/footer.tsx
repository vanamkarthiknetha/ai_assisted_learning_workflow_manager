import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p className="font-medium">Built by Karthik Vanam</p>
            <p className="text-xs">AI-Assisted Learning Workflow Manager © 2026</p>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/vanamkarthiknetha"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/karthikvanam"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
