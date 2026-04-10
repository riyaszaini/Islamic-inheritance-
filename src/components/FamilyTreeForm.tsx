"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, Baby, Heart } from "lucide-react";

interface FamilyTreeFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function FamilyTreeForm({ data, onChange }: FamilyTreeFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="shadow-md border-primary/10">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="w-5 h-5" />
          Immediate Family & Relatives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Baby className="w-4 h-4" />
              Children
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sonsCount">Number of Sons</Label>
                <Input
                  id="sonsCount"
                  type="number"
                  min="0"
                  value={data.sonsCount ?? 0}
                  onChange={(e) => updateField("sonsCount", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="daughtersCount">Number of Daughters</Label>
                <Input
                  id="daughtersCount"
                  type="number"
                  min="0"
                  value={data.daughtersCount ?? 0}
                  onChange={(e) => updateField("daughtersCount", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Parents
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="motherAlive">Mother is Alive</Label>
                <Switch
                  id="motherAlive"
                  checked={data.motherAlive ?? false}
                  onCheckedChange={(val) => updateField("motherAlive", val)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="fatherAlive">Father is Alive</Label>
                <Switch
                  id="fatherAlive"
                  checked={data.fatherAlive ?? false}
                  onCheckedChange={(val) => updateField("fatherAlive", val)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Other Close Relatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <Label htmlFor="fullBrothersCount">Full Brothers</Label>
                <Input
                  id="fullBrothersCount"
                  type="number"
                  min="0"
                  value={data.fullBrothersCount ?? 0}
                  onChange={(e) => updateField("fullBrothersCount", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullSistersCount">Full Sisters</Label>
                <Input
                  id="fullSistersCount"
                  type="number"
                  min="0"
                  value={data.fullSistersCount ?? 0}
                  onChange={(e) => updateField("fullSistersCount", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="childrenOfSonsCount">Sons' Children</Label>
                <Input
                  id="childrenOfSonsCount"
                  type="number"
                  min="0"
                  value={data.childrenOfSonsCount ?? 0}
                  onChange={(e) => updateField("childrenOfSonsCount", parseInt(e.target.value))}
                />
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}