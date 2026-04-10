"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getFaraidRuleExplanations } from "@/ai/flows/get-faraid-rule-explanations";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface EducationalInsightsProps {
  deceasedDetails: string;
  beneficiaryShares: string;
}

export function EducationalInsights({ deceasedDetails, beneficiaryShares }: EducationalInsightsProps) {
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<{ ruleName: string; explanation: string }[]>([]);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await getFaraidRuleExplanations({ deceasedDetails, beneficiaryShares });
        setRules(response.rulesExplained);
      } catch (error) {
        console.error("Failed to fetch Faraid insights", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [deceasedDetails, beneficiaryShares]);

  return (
    <Card className="shadow-md border-accent/20">
      <CardHeader className="bg-accent/5">
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <BookOpen className="w-5 h-5 text-accent" />
          Educational Insights (AI Guided)
          <Sparkles className="w-4 h-4 text-accent ml-auto" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
            <p className="text-sm font-medium">Generating contextual Fara'id explanations...</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {rules.map((rule, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="hover:no-underline hover:text-primary text-left">
                  <span className="font-semibold">{rule.ruleName}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {rule.explanation}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}