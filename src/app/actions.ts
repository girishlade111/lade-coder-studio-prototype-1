// @ts-nocheck
'use server';

import { generateWebsite } from '@/ai/flows/website-generation';
import { aiSuggestions } from '@/ai/flows/ai-suggestions';

export interface GenerateWebsiteResult {
  html: string;
  css: string;
  javascript: string;
}

export async function generateWebsiteAction(
  prompt: string
): Promise<GenerateWebsiteResult> {
  try {
    const result = await generateWebsite({ prompt });
    return result;
  } catch (error) {
    console.error('Error generating website:', error);
    throw new Error('Failed to generate website. Please try again.');
  }
}

export async function getSuggestionsAction(
  prompt: string,
  code: string
): Promise<string[]> {
  try {
    const result = await aiSuggestions({ prompt, code });
    return result.suggestions;
  } catch (error) {
    console.error('Error getting suggestions:', error);
    throw new Error('Failed to get suggestions. Please try again.');
  }
}
