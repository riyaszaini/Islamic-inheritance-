import { IdentifyEligibleHeirsInput, IdentifyEligibleHeirsOutput } from "@/ai/flows/identify-eligible-heirs-flow";
import { GetFaraidRuleExplanationsOutput } from "@/ai/flows/get-faraid-rule-explanations";

export interface EstateDetails {
  deceasedName: string;
  estateValue: number;
  currency: string;
  notes?: string;
}

export interface HeirResult {
  relationship: string;
  fraction: string;
  percentage: number;
  amount: number;
  reason: string;
  heirType: string;
}

export interface InheritanceCase {
  id: string;
  timestamp: number;
  deceasedDetails: EstateDetails & IdentifyEligibleHeirsInput;
  results: HeirResult[];
  aiExplanations: GetFaraidRuleExplanationsOutput["rulesExplained"];
}