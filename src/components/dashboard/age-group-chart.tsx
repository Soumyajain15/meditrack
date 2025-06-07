"use client";

import type React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Patient } from '@/lib/types';
import { Activity } from 'lucide-react'; // Using Activity as a generic chart icon

interface AgeGroupChartProps {
  patients: Patient[];
}

const AGE_GROUPS = [
  { name: '0-18', min: 0, max: 18 },
  { name: '19-35', min: 19, max: 35 },
  { name: '36-50', min: 36, max: 50 },
  { name: '51-65', min: 51, max: 65 },
  { name: '65+', min: 66, max: Infinity },
];

const AgeGroupChart: React.FC<AgeGroupChartProps> = ({ patients }) => {
  const ageGroupData = AGE_GROUPS.map(group => {
    const count = patients.filter(p => p.age >= group.min && p.age <= group.max).length;
    return { name: group.name, patients: count };
  });

  if (patients.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <Activity className="mr-2 h-6 w-6 text-primary" />
            Age Group Distribution
          </CardTitle>
          <CardDescription>Patient age demographics.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for age group distribution.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
           <Activity className="mr-2 h-6 w-6 text-primary" />
           Age Group Distribution
        </CardTitle>
        <CardDescription>Patient age demographics.</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageGroupData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ fontSize: '14px' }}/>
            <Bar dataKey="patients" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AgeGroupChart;
