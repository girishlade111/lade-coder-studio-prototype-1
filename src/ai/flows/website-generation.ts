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
  const prompt = `You are an expert web developer. Generate HTML, CSS, and JavaScript code based on the user's prompt.

  Prompt: ${input.prompt}

  Ensure the HTML is well-structured, the CSS is visually appealing, and the JavaScript provides the necessary functionality.

  Return the code as a JSON object with "html", "css", and "javascript" keys. The JSON object should be the only thing in your response.
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "response_format": { "type": "json_object" }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenRouter API error response:', errorBody);
      throw new Error(`OpenRouter API request failed with status ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    return GenerateWebsiteOutputSchema.parse(parsedContent);
  } catch (error) {
    console.error('Failed to generate website with OpenRouter:', error);
    throw new Error('Failed to generate website using OpenRouter API.');
  }
}
