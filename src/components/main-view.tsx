'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateWebsiteAction,
  getSuggestionsAction,
  chatAction,
  type GenerateWebsiteResult,
} from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { LadeCoderLogo } from '@/components/icons';
import { CodePreview } from '@/components/code-preview';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useToast } from '@/hooks/use-toast';
import { SendHorizonal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

const promptSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt must be at least 10 characters.',
  }),
});

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export default function MainView() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GenerateWebsiteResult | null>(null);
  const [displayedCode, setDisplayedCode] = useState<GenerateWebsiteResult>({
    html: '',
    css: '',
    javascript: '',
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof promptSchema>>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const streamCode = useCallback((code: GenerateWebsiteResult) => {
    let htmlIndex = 0;
    let cssIndex = 0;
    let jsIndex = 0;
    let currentStage = 'html';

    setDisplayedCode({ html: '', css: '', javascript: '' });

    const interval = setInterval(() => {
      if (currentStage === 'html') {
        if (htmlIndex < code.html.length) {
          setDisplayedCode((prev) => ({ ...prev, html: prev.html + code.html[htmlIndex] }));
          htmlIndex++;
        } else {
          currentStage = 'css';
        }
      } else if (currentStage === 'css') {
        if (cssIndex < code.css.length) {
          setDisplayedCode((prev) => ({ ...prev, css: prev.css + code.css[cssIndex] }));
          cssIndex++;
        } else {
          currentStage = 'js';
        }
      } else if (currentStage === 'js') {
        if (jsIndex < code.javascript.length) {
          setDisplayedCode((prev) => ({ ...prev, javascript: prev.javascript + code.javascript[jsIndex] }));
          jsIndex++;
        } else {
          clearInterval(interval);
          setActiveTab('preview');
        }
      }
    }, 5);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (generatedCode) {
      const cleanup = streamCode(generatedCode);
      return cleanup;
    }
  }, [generatedCode, streamCode]);

  const onSubmit = async (values: z.infer<typeof promptSchema>) => {
    setIsLoading(true);
    setCurrentPrompt(values.prompt);
    
    if (isSubmitted) {
      // Handle chat interaction
      const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: values.prompt }];
      setChatHistory(newHistory);
      form.reset();
      
      try {
        const result = await chatAction(values.prompt);
        setChatHistory([...newHistory, { role: 'ai', content: result }]);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }

    } else {
      // Handle initial website generation
      setIsSubmitted(true);
      try {
        const result = await generateWebsiteAction(values.prompt);
        setGeneratedCode(result);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setIsSubmitted(false);
      }
    }
    
    setIsLoading(false);
  };

  const handleGetSuggestions = async () => {
    if (!generatedCode || !currentPrompt) return;
    setIsSuggestionsLoading(true);
    try {
      const fullCode = generatedCode.html + generatedCode.css + generatedCode.javascript;
      const result = await getSuggestionsAction(currentPrompt, fullCode);
      setSuggestions(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Could not fetch suggestions.',
      });
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleNewProject = () => {
    setIsSubmitted(false);
    setGeneratedCode(null);
    setDisplayedCode({ html: '', css: '', javascript: '' });
    setSuggestions([]);
    setCurrentPrompt('');
    setChatHistory([]);
    form.reset();
    setActiveTab('code');
  };

  return (
    <div className="flex h-screen w-full bg-background font-sans">
      <Sidebar
        isSidebarVisible={isSubmitted}
        onNewProject={handleNewProject}
        onGetSuggestions={handleGetSuggestions}
        suggestions={suggestions}
        isSuggestionsLoading={isSuggestionsLoading}
        generatedCode={displayedCode}
        chatHistory={chatHistory}
        onChatSubmit={form.handleSubmit(onSubmit)}
        chatForm={form}
        isChatLoading={isLoading}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header isVisible={isSubmitted} onNewProject={handleNewProject} />
        <main className="flex-1 flex items-center justify-center transition-all duration-500">
          <div
            className={cn(
              'w-full transition-all duration-700 ease-in-out',
              isSubmitted ? 'h-full' : 'max-w-2xl px-4'
            )}
          >
            {!isSubmitted ? (
              <div className="flex flex-col items-center text-center">
                <LadeCoderLogo className="w-24 h-24 mb-4" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Lade Coder
                </h1>
                <p className="text-muted-foreground mt-2 mb-8">
                  Build a website by chatting with AI.
                </p>
                <Card className="w-full">
                  <CardContent className="p-4">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                        <FormField
                          control={form.control}
                          name="prompt"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Build a modern e-commerce site for selling books..."
                                  className="w-full h-24 pr-24 resize-none text-base"
                                  disabled={isLoading}
                                  suppressHydrationWarning
                                />
                              </FormControl>
                              <FormMessage className="text-left" />
                            </FormItem>
                          )}
                        />
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isLoading}
                            aria-label="Optimize prompt"
                          >
                            <Sparkles className="h-5 w-5" />
                          </Button>
                          <Button
                            type="submit"
                            size="icon"
                            disabled={isLoading}
                            aria-label="Submit prompt"
                          >
                            <SendHorizonal className="h-5 w-5" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <CodePreview
                code={displayedCode}
                isLoading={isLoading && !generatedCode}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
