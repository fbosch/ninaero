"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/registry/ninaero/ui/chart";

const data = [
  { day: "Mon", visits: 24 },
  { day: "Tue", visits: 38 },
  { day: "Wed", visits: 29 },
  { day: "Thu", visits: 52 },
  { day: "Fri", visits: 43 },
];
const config = { visits: { label: "Visits", color: "var(--chart-1)" } };

export function ChartPreview() {
  return (
    <ChartContainer config={config} className="h-40 w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
