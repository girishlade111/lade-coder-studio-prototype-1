'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { LadeCoderLogo } from '@/components/icons';
import { Download, Lightbulb, Plus, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerateWebsiteResult } from '@/app/actions';

interface SidebarProps {
  isSidebarVisible: boolean;
  onNewProject: () => void;
  onGetSuggestions: () => void;
  suggestions: string[];
  isSuggestionsLoading: boolean;
  generatedCode: GenerateWebsiteResult | null;
}

export function Sidebar({
  isSidebarVisible,
  onNewProject,
  onGetSuggestions,
  suggestions,
  isSuggestionsLoading,
  generatedCode,
}: SidebarProps) {
  const handleExport = () => {
    if (!generatedCode) return;

    const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <style>${generatedCode.css}</style>
      </head>
      <body>
        ${generatedCode.html}
        <script>${generatedCode.javascript}</script>
      </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside
      className={cn(
        'bg-card border-r flex-col h-screen transition-all duration-500 ease-in-out hidden md:flex',
        isSidebarVisible ? 'w-80 p-4' : 'w-0 p-0'
      )}
    >
      <div className={cn('flex flex-col h-full', isSidebarVisible ? 'opacity-100' : 'opacity-0')}>
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <LadeCoderLogo className="w-8 h-8" />
            <h2 className="text-lg font-semibold">Lade Coder</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onNewProject}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 mt-4 overflow-y-auto">
          {/* Chat history would go here */}
        </div>

        <div className="mt-auto pt-4 border-t space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExport}
            disabled={!generatedCode?.html}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Code
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onGetSuggestions}
                disabled={!generatedCode?.html}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Suggestions
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>AI Suggestions</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100%-4rem)] mt-4 pr-4">
                {isSuggestionsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <Bot className="h-5 w-5" />
                        </div>
                        <p className="flex-1 text-sm text-muted-foreground pt-1">{suggestion}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground text-center mt-8">
                    Click the button again to generate suggestions for the current code.
                  </p>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </aside>
  );
}
