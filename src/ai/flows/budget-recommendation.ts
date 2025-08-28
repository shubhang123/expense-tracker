'use server';
/**
 * @fileOverview An AI agent for budget recommendations.
 *
 * - getBudgetRecommendations - A function that provides budget recommendations based on spending history.
 * - BudgetRecommendationInput - The input type for the getBudgetRecommendations function.
 * - BudgetRecommendationOutput - The return type for the getBudgetRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetRecommendationInputSchema = z.object({
  spendingHistory: z
    .string()
    .describe(
      'A JSON string of the user\'s transaction history.'
    ),
  categories: z.string().describe('A JSON string of user categories.'),
});
export type BudgetRecommendationInput = z.infer<typeof BudgetRecommendationInputSchema>;

const BudgetRecommendationOutputSchema = z.object({
  recommendations: z.array(z.object({
      category: z.string().describe('The category for the budget recommendation.'),
      budget: z.number().describe('The recommended monthly budget for the category.'),
      reasoning: z.string().describe('The reasoning behind the recommendation.')
  })).describe('An array of budget recommendations.')
});
export type BudgetRecommendationOutput = z.infer<typeof BudgetRecommendationOutputSchema>;

export async function getBudgetRecommendations(
  input: BudgetRecommendationInput
): Promise<BudgetRecommendationOutput> {
  return budgetRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetRecommendationPrompt',
  input: {schema: BudgetRecommendationInputSchema},
  output: {schema: BudgetRecommendationOutputSchema},
  prompt: `You are a personal finance advisor. Your goal is to provide intelligent budget recommendations.

Analyze the user's spending history and their existing categories to suggest a monthly budget for each category.

Base your recommendations on the past month's spending patterns. Provide a brief reasoning for each recommendation.

User's Categories:
{{{categories}}}

User's Spending History (last 30 days):
{{{spendingHistory}}}
`,
});

const budgetRecommendationFlow = ai.defineFlow(
  {
    name: 'budgetRecommendationFlow',
    inputSchema: BudgetRecommendationInputSchema,
    outputSchema: BudgetRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
