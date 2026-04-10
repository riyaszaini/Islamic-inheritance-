'use server';
/**
 * @fileOverview Provides contextual explanations for Fara'id (Islamic inheritance) rules applied in a given calculation.
 *
 * - getFaraidRuleExplanations - A function that fetches explanations for Fara'id rules.
 * - GetFaraidRuleExplanationsInput - The input type for the getFaraidRuleExplanations function.
 * - GetFaraidRuleExplanationsOutput - The return type for the getFaraidRuleExplanations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetFaraidRuleExplanationsInputSchema = z.object({
  deceasedDetails: z
    .string()
    .describe(
      'A summary of the deceased\'s relevant details for inheritance, such as marital status, number of children, parents alive, etc.'
    ),
  beneficiaryShares: z
    .string()
    .describe(
      'A string describing the beneficiaries and their calculated shares (e.g., "Wife: 1/8, Son: 7/8, Daughter: 7/16").'
    ),
});
export type GetFaraidRuleExplanationsInput = z.infer<
  typeof GetFaraidRuleExplanationsInputSchema
>;

const GetFaraidRuleExplanationsOutputSchema = z.object({
  rulesExplained: z
    .array(
      z.object({
        ruleName: z
          .string()
          .describe(
            'The common name or reference of the Fara\'id rule (e.g., "Wife\'s Share", "Residuary Heirs", "Agnatic Descendants").'
          ),
        explanation: z
          .string()
          .describe(
            'A brief, contextual explanation of the rule, referencing the provided inheritance summary.'
          ),
      })
    )
    .describe('An array of Fara\'id rules and their explanations.'),
});
export type GetFaraidRuleExplanationsOutput = z.infer<
  typeof GetFaraidRuleExplanationsOutputSchema
>;

export async function getFaraidRuleExplanations(
  input: GetFaraidRuleExplanationsInput
): Promise<GetFaraidRuleExplanationsOutput> {
  return getFaraidRuleExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFaraidRuleExplanationsPrompt',
  input: { schema: GetFaraidRuleExplanationsInputSchema },
  output: { schema: GetFaraidRuleExplanationsOutputSchema },
  prompt: `You are an expert in Islamic inheritance law (Fara'id). Your task is to provide brief, contextual explanations for the specific Fara'id rules that were applied in the given inheritance calculation.

Based on the following inheritance calculation summary, identify the Fara'id rules at play and explain each one. For each rule, provide its common name and a brief explanation in the context of this specific case.

Deceased Details: {{{deceasedDetails}}}
Beneficiary Shares: {{{beneficiaryShares}}}`,
});

const getFaraidRuleExplanationsFlow = ai.defineFlow(
  {
    name: 'getFaraidRuleExplanationsFlow',
    inputSchema: GetFaraidRuleExplanationsInputSchema,
    outputSchema: GetFaraidRuleExplanationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
