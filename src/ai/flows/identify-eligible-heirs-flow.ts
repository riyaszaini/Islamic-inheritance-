'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying eligible heirs based on family relationships
 * and Islamic inheritance scenarios, providing explanations for their eligibility or exclusion.
 *
 * - identifyEligibleHeirs - A function that handles the heir identification process.
 * - IdentifyEligibleHeirsInput - The input type for the identifyEligibleHeirs function.
 * - IdentifyEligibleHeirsOutput - The return type for the identifyEligibleHeirs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyEligibleHeirsInputSchema = z.object({
  deceasedGender: z.enum(['Male', 'Female']).describe('The gender of the deceased. This is crucial as it affects spouse\u0027s share and residual distribution.'),
  hasSpouse: z.boolean().describe('True if the deceased has a living spouse.'),
  numberOfWives: z.number().optional().describe('If the deceased is male and has a living spouse, specify the number of wives (e.g., 1, 2, 3, or 4). Required if deceasedGender is Male and hasSpouse is true.'),
  motherAlive: z.boolean().describe('True if the deceased\u0027s mother is alive.'),
  fatherAlive: z.boolean().describe('True if the deceased\u0027s father is alive.'),
  sonsCount: z.number().describe('The number of living biological sons of the deceased. Adopted children are generally not considered heirs in Islamic law.'),
  daughtersCount: z.number().describe('The number of living biological daughters of the deceased. Adopted children are generally not considered heirs in Islamic law.'),
  paternalGrandfatherAlive: z.boolean().describe('True if the deceased\u0027s paternal grandfather (father\u0027s father) is alive.'),
  maternalGrandmotherAlive: z.boolean().describe('True if the deceased\u0027s maternal grandmother (mother\u0027s mother) is alive.'),
  fullBrothersCount: z.number().describe('The number of living full brothers (sharing both parents with the deceased).'),
  fullSistersCount: z.number().describe('The number of living full sisters (sharing both parents with the deceased).'),
  paternalHalfBrothersCount: z.number().describe('The number of living paternal half-brothers (sharing father only with the deceased).'),
  paternalHalfSistersCount: z.number().describe('The number of living paternal half-sisters (sharing father only with the deceased).'),
  maternalHalfBrothersCount: z.number().describe('The number of living maternal half-brothers (sharing mother only with the deceased).'),
  maternalHalfSistersCount: z.number().describe('The number of living maternal half-sisters (sharing mother only with the deceased).'),
  childrenOfSonsCount: z.number().describe('The total number of living children of sons (grandchildren through the male line).'),
  otherRelativesDescription: z.string().optional().describe('Any other relevant living relatives not covered by the explicit fields, such as great-grandparents, uncles, aunts, nephews, nieces, or cousins. Describe their relationship to the deceased clearly.'),
  additionalContext: z.string().optional().describe('Any additional specific context or details about the family situation (e.g., unborn child, missing relative status, legal specifics) that might be relevant for inheritance determination.'),
}).describe('Input details for identifying eligible heirs based on family relationships for Islamic inheritance.');

export type IdentifyEligibleHeirsInput = z.infer<typeof IdentifyEligibleHeirsInputSchema>;

const IdentifyEligibleHeirsOutputSchema = z.object({
  eligibleHeirs: z.array(
    z.object({
      relationship: z.string().describe('The specific relationship of the heir to the deceased (e.g., "Wife", "Son", "Father", "Full Sister").'),
      count: z.number().optional().describe('The number of individuals with this relationship (e.g., "2 Wives", "3 Sons"). Omitted if count is 1.'),
      heirType: z.enum(['Sharer', 'Residuary', 'Distant Kindred', 'Excluded']).describe('The category of heir according to Fara\u0027id: Sharer (Ashab al-Faraid), Residuary (Asabat), Distant Kindred (Dhawu al-Arham), or Excluded (blocked heir).'),
      reason: z.string().describe('A brief explanation based on Fara\u0027id principles for their eligibility, their share entitlement, or the reason for their exclusion (e.g., "Blocked by presence of son").'),
    })
  ).describe('A list of all identified eligible heirs, their status, and the rationale based on Islamic inheritance law.'),
  summaryNotes: z.string().optional().describe('Any general summary or important notes about the inheritance scenario, such as ambiguities or specific conditions for certain heirs.'),
}).describe('Output containing the identified eligible heirs and their inheritance status with explanations.');

export type IdentifyEligibleHeirsOutput = z.infer<typeof IdentifyEligibleHeirsOutputSchema>;

export async function identifyEligibleHeirs(input: IdentifyEligibleHeirsInput): Promise<IdentifyEligibleHeirsOutput> {
  return identifyEligibleHeirsFlow(input);
}

const identifyEligibleHeirsPrompt = ai.definePrompt({
  name: 'identifyEligibleHeirsPrompt',
  input: { schema: IdentifyEligibleHeirsInputSchema },
  output: { schema: IdentifyEligibleHeirsOutputSchema },
  prompt: `You are an expert in Sunni Islamic inheritance law (Fara'id). Your task is to identify all eligible heirs for a deceased person based on the provided family relationships. For each relative, determine if they are an eligible heir, state their heir type (Sharer, Residuary, Distant Kindred, or Excluded), and provide a brief, clear reason for their status according to Fara'id principles. You must also account for rules of exclusion.

Here are the details of the deceased and their living relatives:

Deceased's Gender: {{{deceasedGender}}}
Has Spouse: {{{hasSpouse}}}
{{#if (and (eq deceasedGender 'Male') hasSpouse)}}Number of Wives: {{{numberOfWives}}}{{/if}}
Mother Alive: {{{motherAlive}}}
Father Alive: {{{fatherAlive}}}
Number of Sons: {{{sonsCount}}}
Number of Daughters: {{{daughtersCount}}}
Paternal Grandfather Alive: {{{paternalGrandfatherAlive}}}
Maternal Grandmother Alive: {{{maternalGrandmotherAlive}}}
Number of Full Brothers: {{{fullBrothersCount}}}
Number of Full Sisters: {{{fullSistersCount}}}
Number of Paternal Half-Brothers: {{{paternalHalfBrothersCount}}}
Number of Paternal Half-Sisters: {{{paternalHalfSistersCount}}}
Number of Maternal Half-Brothers: {{{maternalHalfBrothersCount}}}
Number of Maternal Half-Sisters: {{{maternalHalfSistersCount}}}
Number of Children of Sons (grandchildren through male line): {{{childrenOfSonsCount}}}
{{#if otherRelativesDescription}}Other Relatives: {{{otherRelativesDescription}}}{{/if}}
{{#if additionalContext}}Additional Context: {{{additionalContext}}}{{/if}}

Identify all potential heirs and provide their status and reason. If a relative is present but excluded, explicitly list them with 'Excluded' as heirType and the reason for their exclusion. Focus on identifying heirs and their status, not calculating precise shares, but the reason should allude to why they are entitled or excluded.
`,
});

const identifyEligibleHeirsFlow = ai.defineFlow(
  {
    name: 'identifyEligibleHeirsFlow',
    inputSchema: IdentifyEligibleHeirsInputSchema,
    outputSchema: IdentifyEligibleHeirsOutputSchema,
  },
  async (input) => {
    const { output } = await identifyEligibleHeirsPrompt(input);
    return output!;
  }
);
