'use server';
/**
 * @fileOverview An AI agent that suggests relevant library resources or specific library sections
 * based on the visitor's declared purpose of visit.
 *
 * - suggestLibraryResources - A function that handles the resource suggestion process.
 * - SuggestLibraryResourcesInput - The input type for the suggestLibraryResources function.
 * - SuggestLibraryResourcesOutput - The return type for the suggestLibraryResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const SuggestLibraryResourcesInputSchema = z.object({
  purposeOfVisit: z.string().describe('The declared purpose of the visitor\'s visit to the library. Examples: "research for thesis", "reading books", "use of computer", "doing assignments".')
});
export type SuggestLibraryResourcesInput = z.infer<typeof SuggestLibraryResourcesInputSchema>;

// Output Schema
const SuggestLibraryResourcesOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      name: z.string().describe('The name of the suggested resource or library section.'),
      description: z.string().describe('A brief description of the resource or section and why it is relevant.')
    })
  ).describe('A list of suggested library resources or sections based on the purpose of visit.')
});
export type SuggestLibraryResourcesOutput = z.infer<typeof SuggestLibraryResourcesOutputSchema>;

/**
 * Suggests relevant library resources or sections based on the visitor's purpose of visit.
 * @param input The purpose of the visitor's visit.
 * @returns A list of suggested library resources or sections.
 */
export async function suggestLibraryResources(input: SuggestLibraryResourcesInput): Promise<SuggestLibraryResourcesOutput> {
  return suggestLibraryResourcesFlow(input);
}

// Prompt definition
const prompt = ai.definePrompt({
  name: 'suggestLibraryResourcesPrompt',
  input: { schema: SuggestLibraryResourcesInputSchema },
  output: { schema: SuggestLibraryResourcesOutputSchema },
  prompt: `You are an AI assistant for the NEU Library. Your goal is to help visitors find relevant resources or sections of the library based on their stated purpose of visit.\n\nGiven the purpose of visit, suggest 3-5 highly relevant library resources, specific sections, or types of materials that would be most useful. Provide a brief description for each suggestion.\n\nPurpose of visit: "{{{purposeOfVisit}}}"`
});

// Flow definition
const suggestLibraryResourcesFlow = ai.defineFlow(
  {
    name: 'suggestLibraryResourcesFlow',
    inputSchema: SuggestLibraryResourcesInputSchema,
    outputSchema: SuggestLibraryResourcesOutputSchema
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('No output received from the AI model.');
    }
    return output;
  }
);
