"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HeirResult } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface DistributionSummaryProps {
  results: HeirResult[];
  currency: string;
}

export function DistributionSummary({ results, currency }: DistributionSummaryProps) {
  const chartData = results.map(r => ({
    name: r.relationship,
    value: r.percentage,
    amount: r.amount
  }));

  const COLORS = ['#2989CC', '#4DE0BB', '#FF8042', '#00C49F', '#FFBB28', '#8884d8'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Share Visualization</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Percentage']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Share Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((heir, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{heir.relationship}</TableCell>
                    <TableCell>
                      <Badge variant={heir.heirType === 'Sharer' ? 'default' : 'secondary'}>
                        {heir.heirType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-primary font-bold">
                      {heir.fraction} ({heir.percentage.toFixed(1)}%)
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(heir.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}