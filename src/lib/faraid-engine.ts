import { IdentifyEligibleHeirsInput } from "@/ai/flows/identify-eligible-heirs-flow";

export interface Fraction {
  numerator: number;
  denominator: number;
}

export function formatFraction(f: Fraction): string {
  return `${f.numerator}/${f.denominator}`;
}

/**
 * Simplified Fara'id calculation for common heirs.
 * Real Fara'id is highly complex; this handles core cases for demonstration.
 */
export function calculateShares(input: IdentifyEligibleHeirsInput, estateValue: number) {
  const shares: { relationship: string; share: Fraction; reason: string }[] = [];
  
  const hasChildren = input.sonsCount > 0 || input.daughtersCount > 0;
  const hasSons = input.sonsCount > 0;

  // 1. Spouse Share
  if (input.hasSpouse) {
    if (input.deceasedGender === 'Female') {
      // Husband
      const share = hasChildren ? { numerator: 1, denominator: 4 } : { numerator: 1, denominator: 2 };
      shares.push({ relationship: "Husband", share, reason: hasChildren ? "1/4 because there are children" : "1/2 because no children" });
    } else {
      // Wives
      const wivesCount = input.numberOfWives || 1;
      const totalWifeShare = hasChildren ? { numerator: 1, denominator: 8 } : { numerator: 1, denominator: 4 };
      const individualWifeShare = { numerator: totalWifeShare.numerator, denominator: totalWifeShare.denominator * wivesCount };
      for (let i = 0; i < wivesCount; i++) {
        shares.push({ 
          relationship: `Wife ${wivesCount > 1 ? i + 1 : ""}`.trim(), 
          share: totalWifeShare, // Total share allocated to wives group, then divided by count for visualization
          reason: hasChildren ? "1/8 shared among wives" : "1/4 shared among wives" 
        });
      }
    }
  }

  // 2. Parents
  if (input.motherAlive) {
    const share = hasChildren ? { numerator: 1, denominator: 6 } : { numerator: 1, denominator: 3 };
    shares.push({ relationship: "Mother", share, reason: hasChildren ? "1/6 due to children" : "1/3 due to no children" });
  }

  if (input.fatherAlive) {
    const share = hasChildren ? { numerator: 1, denominator: 6 } : { numerator: 1, denominator: 1 }; // Father as residuary if no children
    shares.push({ relationship: "Father", share, reason: hasChildren ? "1/6 fixed share" : "Residuary heir" });
  }

  // 3. Children (Residuaries)
  // Calculate remaining estate after fixed shares
  let fixedSum = 0;
  shares.forEach(s => fixedSum += (s.share.numerator / s.share.denominator));
  
  const remainder = 1 - fixedSum;
  
  if (remainder > 0) {
    if (hasChildren) {
      // 2:1 rule for sons and daughters
      const totalUnits = (input.sonsCount * 2) + input.daughtersCount;
      const unitValue = remainder / totalUnits;

      for (let i = 0; i < input.sonsCount; i++) {
        shares.push({ 
          relationship: `Son ${input.sonsCount > 1 ? i + 1 : ""}`.trim(), 
          share: { numerator: Math.round(unitValue * 2 * 100), denominator: 100 },
          reason: "Residuary (2:1 ratio)"
        });
      }
      for (let i = 0; i < input.daughtersCount; i++) {
        shares.push({ 
          relationship: `Daughter ${input.daughtersCount > 1 ? i + 1 : ""}`.trim(), 
          share: { numerator: Math.round(unitValue * 100), denominator: 100 },
          reason: "Residuary (2:1 ratio)"
        });
      }
    } else if (input.fatherAlive && !hasChildren) {
      // Father takes the rest as residuary if no children
      const fatherIndex = shares.findIndex(s => s.relationship === "Father");
      if (fatherIndex !== -1) {
        shares[fatherIndex].share = { numerator: Math.round(remainder * 100) + Math.round((shares[fatherIndex].share.numerator / shares[fatherIndex].share.denominator) * 100), denominator: 100 };
      }
    }
  }

  // Final mapping to percentage and amount
  return shares.map(s => {
    const decimal = s.share.numerator / s.share.denominator;
    return {
      relationship: s.relationship,
      fraction: s.share.denominator === 100 ? `${Math.round(decimal * 24)}/24` : formatFraction(s.share),
      percentage: decimal * 100,
      amount: decimal * estateValue,
      reason: s.reason,
      heirType: s.reason.includes("Residuary") ? "Residuary" : "Sharer"
    };
  });
}