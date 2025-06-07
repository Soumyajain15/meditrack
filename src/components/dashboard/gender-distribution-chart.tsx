"use client";

import type React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Patient } from '@/lib/types';
import { Users } from 'lucide-react';

interface GenderDistributionChartProps {
  patients: Patient[];
}

const COLORS = {
  male: 'hsl(var(--chart-1))', // Blue
  female: 'hsl(var(--chart-2))', // Green (adjusted from original theme for better distinction)
  other: 'hsl(var(--chart-3))', // Orange/Yellow
};

const GenderDistributionChart: React.FC<GenderDistributionChartProps> = ({ patients }) => {
  const genderData = patients.reduce((acc, patient) => {
    acc[patient.gender] = (acc[patient.gender] || 0) + 1;
    return acc;
  }, {} as Record<'male' | 'female' | 'other', number>);

  const data = Object.entries(genderData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
    value,
  })).filter(item => item.value > 0); // Filter out genders with 0 count

  if (data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Gender Distribution
          </CardTitle>
          <CardDescription>Patient gender demographics.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for gender distribution.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
           <Users className="mr-2 h-6 w-6 text-primary" />
           Gender Distribution
        </CardTitle>
        <CardDescription>Patient gender demographics.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as 'male' | 'female' | 'other'] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value} patients`, undefined]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GenderDistributionChart;
