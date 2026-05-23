// Minimal chart helpers — we use Recharts directly in this project,
// so this file is intentionally trimmed to avoid Recharts v3 type drift.
import * as React from "react";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<string, { label?: React.ReactNode; color?: string }>;

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

export function ChartContainer({
  className, children, config, ...props
}: React.HTMLAttributes<HTMLDivElement> & { config?: ChartConfig; children: React.ReactNode }) {
  return (
    <ChartContext.Provider value={{ config: config ?? {} }}>
      <div className={cn("w-full", className)} {...props}>{children}</div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const ChartTooltipContent = () => null;
export const ChartLegend = ({ children }: { children?: React.ReactNode }) => <>{children}</>;
export const ChartLegendContent = () => null;
export const ChartStyle = () => null;
