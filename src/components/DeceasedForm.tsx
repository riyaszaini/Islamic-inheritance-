"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Banknote, ScrollText } from "lucide-react";

interface DeceasedFormProps {
  data: any;
  onChange: (data: any) => void;
}

export function DeceasedForm({ data, onChange }: DeceasedFormProps) {
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card className="shadow-md border-primary/10">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <ScrollText className="w-5 h-5" />
          Deceased & Estate Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="deceasedName">Deceased Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="deceasedName"
                className="pl-9"
                placeholder="Full Name"
                value={data.deceasedName || ""}
                onChange={(e) => updateField("deceasedName", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estateValue">Total Estate Value</Label>
            <div className="relative">
              <Banknote className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="estateValue"
                type="number"
                className="pl-9"
                placeholder="0.00"
                value={data.estateValue || ""}
                onChange={(e) => updateField("estateValue", parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Gender of the Deceased</Label>
          <RadioGroup
            value={data.deceasedGender}
            onValueChange={(val) => updateField("deceasedGender", val)}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors w-full cursor-pointer">
              <RadioGroupItem value="Male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">Male</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors w-full cursor-pointer">
              <RadioGroupItem value="Female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Marital Status</Label>
          <RadioGroup
            value={data.hasSpouse ? "yes" : "no"}
            onValueChange={(val) => updateField("hasSpouse", val === "yes")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors w-full cursor-pointer">
              <RadioGroupItem value="yes" id="married" />
              <Label htmlFor="married" className="cursor-pointer">Married (Living Spouse)</Label>
            </div>
            <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors w-full cursor-pointer">
              <RadioGroupItem value="no" id="single" />
              <Label htmlFor="single" className="cursor-pointer">Not Married</Label>
            </div>
          </RadioGroup>
        </div>

        {data.deceasedGender === "Male" && data.hasSpouse && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="numberOfWives">Number of Wives</Label>
            <Input
              id="numberOfWives"
              type="number"
              min="1"
              max="4"
              value={data.numberOfWives || 1}
              onChange={(e) => updateField("numberOfWives", parseInt(e.target.value))}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}