'use server';
/**
 * @fileOverview Generates website code (HTML, CSS, and JavaScript) based on a user prompt.
 *
 * - generateWebsite - A function that generates website code based on a user prompt.
 * - GenerateWebsiteInput - The input type for the generateWebsite function.
 * - GenerateWebsiteOutput - The return type for the generateWebsite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWebsiteInputSchema = z.object({
  prompt: z.string().describe('A detailed description of the desired website.'),
});
export type GenerateWebsiteInput = z.infer<typeof GenerateWebsiteInputSchema>;

const GenerateWebsiteOutputSchema = z.object({
  html: z.string().describe('The HTML code for the website.'),
  css: z.string().describe('The CSS code for the website.'),
  javascript: z.string().describe('The JavaScript code for the website.'),
});
export type GenerateWebsiteOutput = z.infer<typeof GenerateWebsiteOutputSchema>;

export async function generateWebsite(input: GenerateWebsiteInput): Promise<GenerateWebsiteOutput> {
  return generateWebsiteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebsitePrompt',
  input: {schema: GenerateWebsiteInputSchema},
  output: {schema: GenerateWebsiteOutputSchema},
  prompt: `You are an expert web developer. Generate HTML, CSS, and JavaScript code based on the user's prompt.

  Prompt: {{{prompt}}}

  Ensure the HTML is well-structured, the CSS is visually appealing, and the JavaScript provides the necessary functionality.

  Return the code as a JSON object with "html", "css", and "javascript" keys.
  `,
});

const generateWebsiteFlow = ai.defineFlow(
  {
    name: 'generateWebsiteFlow',
    inputSchema: GenerateWebsiteInputSchema,
    outputSchema: GenerateWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
