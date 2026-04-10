"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PlusCircle, History, Calculator, ShieldCheck, Scale, Info } from "lucide-react";
import Link from "next/link";
import { InheritanceCase } from "@/lib/types";

export default function HomePage() {
  const [recentCases, setRecentCases] = useState<InheritanceCase[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("warith_cases");
    if (saved) {
      setRecentCases(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <Scale className="w-12 h-12 text-accent" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">WarithGuide</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto font-light">
            AI-powered Islamic inheritance guidance. Calculate Fara'id shares with precision and educational insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 h-14 rounded-full shadow-lg transition-transform hover:scale-105">
              <Link href="/calculator" className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Start New Calculation
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 hover:bg-white/10 text-white h-14 rounded-full px-8">
              <Link href="#recent" className="flex items-center gap-2">
                <History className="w-5 h-5" />
                View History
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Feature Cards */}
      <main className="max-w-6xl mx-auto py-16 px-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard 
            icon={<Calculator className="w-6 h-6 text-primary" />}
            title="Precise Calculation"
            description="Our engine follows established Fara'id principles to provide accurate fractional and percentage splits."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-primary" />}
            title="AI Beneficiary Tool"
            description="Guiding you through identifying eligible heirs based on family structures and valid inheritance blocks."
          />
          <FeatureCard 
            icon={<Info className="w-6 h-6 text-primary" />}
            title="Educational Insights"
            description="Understand the 'why' behind every share with contextual AI explanations of Islamic inheritance laws."
          />
        </div>

        {/* Recent Cases */}
        <section id="recent" className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold">Recent Cases</h2>
            {recentCases.length > 0 && (
               <Link href="/history" className="text-primary hover:underline text-sm font-medium">View all history</Link>
            )}
          </div>
          
          {recentCases.length === 0 ? (
            <div className="bg-secondary/30 rounded-2xl p-12 text-center border-2 border-dashed border-primary/10">
              <p className="text-muted-foreground">You haven't saved any inheritance cases yet.</p>
              <Button asChild variant="link" className="text-primary mt-2">
                <Link href="/calculator">Create your first case</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCases.map((c) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow border-primary/10 overflow-hidden group">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="truncate">{c.deceasedDetails.deceasedName || "Untitled Case"}</CardTitle>
                    <CardDescription>{new Date(c.timestamp).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: c.deceasedDetails.currency || 'USD' }).format(c.deceasedDetails.estateValue)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Total Estate Value</p>
                  </CardContent>
                  <CardFooter className="bg-secondary/20 border-t py-3">
                     <Button asChild variant="ghost" size="sm" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                        <Link href={`/calculator?id=${c.id}`}>View Details</Link>
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-secondary/50 py-12 px-6 border-t mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Scale className="w-5 h-5" />
              WarithGuide
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Empowering justice through Fara'id education and precision.</p>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} WarithGuide. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/50 backdrop-blur-sm">
      <CardContent className="pt-8 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}