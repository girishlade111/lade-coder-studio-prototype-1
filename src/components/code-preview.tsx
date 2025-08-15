'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CodeXml,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GenerateWebsiteResult } from '@/app/actions';

interface CodePreviewProps {
  code: GenerateWebsiteResult;
  isLoading: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

type Device = 'desktop' | 'tablet' | 'mobile';

export function CodePreview({
  code,
  isLoading,
  activeTab,
  onTabChange,
}: CodePreviewProps) {
  const [device, setDevice] = useState<Device>('desktop');

  const previewContent = useMemo(() => {
    if (!code.html && !code.css && !code.javascript) return '';
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; }
          ${code.css}
        </style>
      </head>
      <body>
        ${code.html}
        <script>
          ${code.javascript}
        </script>
      </body>
      </html>
    `;
  }, [code]);

  const openInNewTab = () => {
    const blob = new Blob([previewContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const deviceDimensions: Record<Device, string> = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px]',
    mobile: 'w-[375px] h-[667px]',
  };

  const CodeSkeleton = () => (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-card rounded-lg border">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex flex-col h-full"
      >
        <div className="flex items-center justify-between p-2 border-b">
          <TabsList>
            <TabsTrigger value="code">
              <CodeXml className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {activeTab === 'preview' && (
              <>
                <Button
                  variant={device === 'desktop' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setDevice('desktop')}
                  aria-label="Desktop view"
                >
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button
                  variant={device === 'tablet' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setDevice('tablet')}
                  aria-label="Tablet view"
                >
                  <Tablet className="h-5 w-5" />
                </Button>
                <Button
                  variant={device === 'mobile' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setDevice('mobile')}
                  aria-label="Mobile view"
                >
                  <Smartphone className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openInNewTab}
                  aria-label="Open in new tab"
                  disabled={!previewContent}
                >
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <TabsContent value="code" className="m-0 h-full">
            <div className="h-full overflow-auto">
              {isLoading && !code.html ? (
                <CodeSkeleton />
              ) : (
                <div className="font-mono text-sm">
                  <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-sans font-semibold text-foreground">
                      HTML
                    </h3>
                  </div>
                  <pre className="p-4 overflow-auto">
                    <code>{code.html}</code>
                  </pre>
                  <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-sans font-semibold text-foreground">
                      CSS
                    </h3>
                  </div>
                  <pre className="p-4 overflow-auto">
                    <code>{code.css}</code>
                  </pre>
                  <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-sans font-semibold text-foreground">
                      JavaScript
                    </h3>
                  </div>
                  <pre className="p-4 overflow-auto">
                    <code>{code.javascript}</code>
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preview" className="m-0 h-full">
            <div className="w-full h-full bg-background flex items-center justify-center p-4">
              <iframe
                srcDoc={previewContent}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin"
                className={cn(
                  'bg-white rounded-md shadow-lg transition-all duration-300 ease-in-out',
                  deviceDimensions[device],
                  device !== 'desktop' ? 'max-w-full max-h-full' : ''
                )}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
