"use client";

import React, { useState, useEffect } from "react";
import { DeceasedForm } from "@/components/DeceasedForm";
import { FamilyTreeForm } from "@/components/FamilyTreeForm";
import { DistributionSummary } from "@/components/DistributionSummary";
import { EducationalInsights } from "@/components/EducationalInsights";
import { PrintableReport } from "@/components/PrintableReport";
import { Button } from "@/components/ui/button";
import { calculateShares } from "@/lib/faraid-engine";
import { HeirResult, InheritanceCase } from "@/lib/types";
import { ArrowLeft, ArrowRight, Calculator, CheckCircle2, Printer, Save, Trash2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function CalculatorPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    deceasedName: "",
    estateValue: 0,
    deceasedGender: "Male",
    hasSpouse: true,
    numberOfWives: 1,
    motherAlive: false,
    fatherAlive: false,
    sonsCount: 0,
    daughtersCount: 0,
    fullBrothersCount: 0,
    fullSistersCount: 0,
    childrenOfSonsCount: 0,
    currency: "USD"
  });
  const [results, setResults] = useState<HeirResult[]>([]);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const saved = localStorage.getItem("warith_cases");
      if (saved) {
        const cases = JSON.parse(saved);
        const found = cases.find((c: InheritanceCase) => c.id === id);
        if (found) {
          setFormData(found.deceasedDetails);
          setResults(found.results);
          setIsCalculated(true);
          setStep(3);
        }
      }
    }
  }, [searchParams]);

  const handleCalculate = () => {
    const shares = calculateShares(formData, formData.estateValue);
    setResults(shares);
    setIsCalculated(true);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    const id = searchParams.get("id") || crypto.randomUUID();
    const newCase: InheritanceCase = {
      id,
      timestamp: Date.now(),
      deceasedDetails: formData,
      results,
      aiExplanations: [] // This will be fetched in the educational insights component
    };

    const saved = localStorage.getItem("warith_cases");
    let cases = saved ? JSON.parse(saved) : [];
    
    const existingIndex = cases.findIndex((c: any) => c.id === id);
    if (existingIndex !== -1) {
      cases[existingIndex] = newCase;
    } else {
      cases = [newCase, ...cases];
    }

    localStorage.setItem("warith_cases", JSON.stringify(cases));
    toast({
      title: "Case Saved",
      description: "Your inheritance calculation has been saved to local storage.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <nav className="no-print bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <Link href="/" className="font-bold text-primary flex items-center gap-2">
          <Home className="w-5 h-5" />
          <span className="hidden sm:inline">WarithGuide</span>
        </Link>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? "bg-primary text-white scale-110" : step > s ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
           {isCalculated && (
             <>
               <Button onClick={handleSave} variant="outline" size="sm" className="hidden md:flex gap-2">
                 <Save className="w-4 h-4" /> Save
               </Button>
               <Button onClick={handlePrint} variant="outline" size="sm" className="hidden md:flex gap-2">
                 <Printer className="w-4 h-4" /> Print
               </Button>
             </>
           )}
        </div>
      </nav>

      <div className="no-print max-w-4xl mx-auto mt-8 px-6 space-y-8">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <DeceasedForm data={formData} onChange={setFormData} />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <FamilyTreeForm data={formData} onChange={setFormData} />
          </div>
        )}

        {step === 3 && isCalculated && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-primary/10 p-6 rounded-2xl border border-primary/20">
              <div>
                <h2 className="text-2xl font-bold text-primary">Calculation Complete</h2>
                <p className="text-muted-foreground">Distribution for {formData.deceasedName || "an unnamed individual"}'s estate.</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} variant="default" className="gap-2">
                   <Save className="w-4 h-4" /> Save Case
                </Button>
              </div>
            </div>

            <DistributionSummary results={results} currency={formData.currency} />

            <EducationalInsights 
              deceasedDetails={`Gender: ${formData.deceasedGender}, Spouse: ${formData.hasSpouse ? 'Yes' : 'No'}, Mother: ${formData.motherAlive ? 'Yes' : 'No'}, Father: ${formData.fatherAlive ? 'Yes' : 'No'}, Sons: ${formData.sonsCount}, Daughters: ${formData.daughtersCount}`}
              beneficiaryShares={results.map(r => `${r.relationship}: ${r.fraction}`).join(", ")}
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="no-print flex justify-between pt-6 border-t items-center">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step === 1 && (
            <Button onClick={() => setStep(2)} className="bg-primary hover:bg-primary/90 gap-2">
              Continue to Family <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {step === 2 && (
            <Button onClick={handleCalculate} className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 font-bold px-8 h-12">
              <Calculator className="w-5 h-5" /> Calculate Shares
            </Button>
          )}

          {step === 3 && (
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
               Modify Input <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Hidden print report */}
      {isCalculated && <PrintableReport deceased={formData} results={results} />}
    </div>
  );
}